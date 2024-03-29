import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { AppStore } from './app/store';
import {
  decodedJWT,
  PostScratchRequestObj,
  Scratch,
  ScratchResponseObj,
  themeAccent,
  themeBackground,
  User,
} from './common/types';
import { logout, setAccessToken } from './features/auth/authSlice';

axios.defaults.baseURL =
  process.env.REACT_APP_AXIOS_BASE_URL || 'http://localhost:8000';

const axiosApi = axios.create();

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;

  // sync local storage with redux state
  let currentToken: string | null = null;
  let currentThemeAccent: themeAccent | null = null;
  let currentThemeBackground: themeBackground | null = null;
  store.subscribe(() => {
    const oldToken = currentToken;
    currentToken = store.getState().auth.token;
    if (currentToken !== oldToken) {
      if (currentToken) {
        localStorage.setItem('accessToken', currentToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    }

    const oldThemeAccent = currentThemeAccent;
    currentThemeAccent = store.getState().theme.accent;
    if (oldThemeAccent !== currentThemeAccent) {
      localStorage.setItem('themeAccent', currentThemeAccent);
    }

    const oldThemeBackground = currentThemeBackground;
    currentThemeBackground = store.getState().theme.background;
    if (oldThemeBackground !== currentThemeBackground) {
      localStorage.setItem('themeBackground', currentThemeBackground);
    }
  });
};

let isFetchingRefreshToken = false;
let fetchQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (err: any, token?: string) => {
  fetchQueue.forEach(({ resolve, reject }) => {
    if (err) {
      reject(err);
    } else {
      resolve(token);
    }
  });

  fetchQueue = [];
};

axiosApi.interceptors.request.use(async (config) => {
  if (config.headers === undefined) return config;
  if (!isFetchingRefreshToken) {
    // if client has an access token saved, add it to each request
    const accessToken = store.getState().auth.token;

    if (accessToken) {
      const decoded = jwt_decode<decodedJWT>(accessToken);

      // refresh the token a bit before actual expiration time
      // used to avoid situations where the token expires right before getting checked by the server
      const maxMsBeforeExpiry = 60 * 1000;
      if (Date.now() > decoded.exp * 1000 - maxMsBeforeExpiry) {
        isFetchingRefreshToken = true;
        try {
          const res = await axios.post<{ accessToken: string }>(
            '/api/auth/refresh-token',
            {},
            { withCredentials: true }
          );
          store.dispatch(setAccessToken(res.data.accessToken));
          processQueue(null, res.data.accessToken);
          config.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
        } catch (failedRefreshError) {
          processQueue(failedRefreshError);
          await store.dispatch(logout());
          return Promise.reject(failedRefreshError);
        } finally {
          isFetchingRefreshToken = false;
        }
      } else {
        config.headers['Authorization'] = 'Bearer ' + accessToken;
      }
    }
  } else {
    try {
      const newAccessToken = await new Promise((resolve, reject) => {
        fetchQueue.push({ resolve, reject });
      });
      config.headers['Authorization'] = 'Bearer ' + newAccessToken;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return config;
});

export const getScratch = (id: number) => {
  return axiosApi.get<ScratchResponseObj>(`/api/scratches/${id}`);
};

interface PostScratchResponseJson {
  success: boolean;
  id: number;
  authorId: number;
}

export const postScratch = (args: PostScratchRequestObj) => {
  return axiosApi.post<PostScratchResponseJson>('/api/scratches', args);
};

interface DeleteScratchResponseJson {
  success: boolean;
  id: number;
  authorId: number;
}

export const deleteScratch = (id: number) => {
  return axiosApi.delete<DeleteScratchResponseJson>(`/api/scratches/${id}`);
};

export const deleteDirectRescratch = (id: number) => {
  return axiosApi.delete<DeleteScratchResponseJson>(
    `/api/scratches/${id}/direct-rescratch`
  );
};

export const getUserByUsername = (username: string) => {
  return axiosApi.get<User>(`/api/users/username/${username}`);
};

export const postProfileImage = (formData: FormData) => {
  return axiosApi.post<{
    success: boolean;
    id: number;
    profileImageUrl: string;
  }>(`/api/media/profile-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const postProfileBanner = (formData: FormData) => {
  return axiosApi.post<{
    success: boolean;
    id: number;
    profileBannerUrl: string;
  }>(`/api/media/profile-banner`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProfileBanner = () => {
  return axiosApi.delete<{ success: boolean; id: number }>(
    `/api/media/profile-banner`
  );
};

interface PatchUserResponseJson {
  success: boolean;
  id: number;
  username: string;
}

export const patchUser = ({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}) => {
  return axiosApi.patch<PatchUserResponseJson>(`/api/users/${id}`, {
    name,
    description,
  });
};

interface DeleteUserResponseJson {
  success: boolean;
  id: number;
  username: string;
}

export const deleteUser = (id: number) => {
  return axiosApi.delete<DeleteUserResponseJson>(`/api/users/${id}`);
};

interface PostChangePasswordResponseJson {
  success: boolean;
  id: number;
  username: string;
}

export const postChangePassword = ({
  id,
  currentPassword,
  password,
  confirmPassword,
}: {
  id: number;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}) => {
  return axiosApi.post<PostChangePasswordResponseJson>(
    `/api/users/${id}/change-password`,
    {
      currentPassword,
      password,
      confirmPassword,
    }
  );
};

interface TimelineScratchesResponseJson {
  scratches: Scratch[];
  isFinished: boolean;
  extraScratches: { [key: string]: Scratch };
}

export const getHomeTimeline = (limit?: number, after?: number) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<TimelineScratchesResponseJson>('/api/users/timeline', {
    params: queryParams,
  });
};

export const getUserTimeline = (id: number, limit?: number, after?: number) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<TimelineScratchesResponseJson>(
    `/api/users/${id}/timeline`,
    { params: queryParams }
  );
};

export const getUserMediaScratches = (
  id: number,
  limit?: number,
  after?: number
) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<TimelineScratchesResponseJson>(`/api/users/${id}/media`, {
    params: queryParams,
  });
};

interface ScratchConversationResponseJson {
  parentChain: Scratch[];
  scratch: Scratch;
  replies: Scratch[];
  extraScratches: { [key: string]: Scratch };
}

export const getScratchConversation = (id: number) => {
  return axiosApi.get<ScratchConversationResponseJson>(
    `/api/scratches/${id}/conversation`
  );
};

interface UserScratchLikesReponseJson {
  scratches: Scratch[];
  isFinished: boolean;
  extraScratches: { [key: string]: Scratch };
}

export const getUserLikes = (id: number, limit?: number, after?: number) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<UserScratchLikesReponseJson>(`/api/users/${id}/likes`, {
    params: queryParams,
  });
};

export const getSuggestedUsers = (limit?: number) => {
  return axiosApi.get<User[]>('/api/users/suggested-users', {
    params: { limit },
  });
};

interface ScratchRescratchedUsersResponseJson {
  users: User[];
  isFinished: boolean;
}

export const getScratchRescratchedUsers = (
  id: number,
  limit?: number,
  after?: number
) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }
  return axiosApi.get<ScratchRescratchedUsersResponseJson>(
    `/api/scratches/${id}/rescratches`,
    {
      params: queryParams,
    }
  );
};

interface ScratchLikedUsersResponseJson {
  users: User[];
  isFinished: boolean;
}

export const getScratchLikedUsers = (
  id: number,
  limit?: number,
  after?: number
) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }
  return axiosApi.get<ScratchLikedUsersResponseJson>(
    `/api/scratches/${id}/likes`,
    {
      params: queryParams,
    }
  );
};

interface LikeResponseJson {
  success: boolean;
  userId: number;
  scratchId: number;
}

export const setScratchLike = (id: number) => {
  return axiosApi.post<LikeResponseJson>(`/api/scratches/${id}/likes`);
};

export const deleteScratchLike = (id: number) => {
  return axiosApi.delete<LikeResponseJson>(`/api/scratches/${id}/likes`);
};

interface BookmarkResponseJson {
  success: boolean;
  userId: number;
  scratchId: number;
}

export const setScratchBookmark = (id: number) => {
  return axiosApi.post<BookmarkResponseJson>(`/api/scratches/${id}/bookmark`);
};

export const deleteScratchBookmark = (id: number) => {
  return axiosApi.delete<BookmarkResponseJson>(`/api/scratches/${id}/bookmark`);
};

interface PinResponseJson {
  success: boolean;
  userId: number;
  scratchId: number;
}

export const setScratchPin = (id: number) => {
  return axiosApi.post<PinResponseJson>(`/api/scratches/${id}/pin`);
};

export const deleteScratchPin = (id: number) => {
  return axiosApi.post<PinResponseJson>(`/api/scratches/${id}/unpin`);
};

interface FollowResponseJson {
  success: boolean;
  followerId: number;
  followedId: number;
}

export const setUserFollow = (id: number) => {
  return axiosApi.post<FollowResponseJson>(`/api/users/${id}/follow`);
};

export const deleteUserFollow = (id: number) => {
  return axiosApi.delete<FollowResponseJson>(`/api/users/${id}/follow`);
};

interface UserFollowersResponseJson {
  users: User[];
  isFinished: boolean;
}

export const getUserFollowers = (
  id: number,
  limit?: number,
  after?: number
) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<UserFollowersResponseJson>(`/api/users/${id}/followers`, {
    params: queryParams,
  });
};

interface UserFollowedResponseJson {
  users: User[];
  isFinished: boolean;
}

export const getUserFollowed = (id: number, limit?: number, after?: number) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<UserFollowedResponseJson>(`/api/users/${id}/followed`, {
    params: queryParams,
  });
};

interface UserScratchBookmarksReponseJson {
  scratches: Scratch[];
  isFinished: boolean;
  extraScratches: { [key: string]: Scratch };
}

export const getBookmarks = (id: number, limit?: number, after?: number) => {
  const queryParams: { limit?: number; after?: number } = {};
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<UserScratchBookmarksReponseJson>(
    `/api/users/${id}/bookmarks`,
    { params: queryParams }
  );
};

interface SearchScratchesResponseJson {
  scratches: Scratch[];
  isFinished: boolean;
  extraScratches: { [key: string]: Scratch };
}

export const getSearchScratches = (
  searchPattern: string,
  limit?: number,
  after?: number
) => {
  const queryParams: { query: string; limit?: number; after?: number } = {
    query: searchPattern,
  };
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<SearchScratchesResponseJson>(`/api/scratches/search`, {
    params: queryParams,
  });
};

interface SearchUsersResponseJson {
  users: User[];
  isFinished: boolean;
}

export const getSearchUsers = (
  searchPattern: string,
  limit?: number,
  after?: string
) => {
  const queryParams: { query: string; limit?: number; after?: string } = {
    query: searchPattern,
  };
  if (limit) {
    queryParams.limit = limit;
  }
  if (after) {
    queryParams.after = after;
  }

  return axiosApi.get<SearchUsersResponseJson>(`/api/users/search`, {
    params: queryParams,
  });
};

export const postUploadMedia = (formData: FormData) => {
  return axiosApi.post<{ success: boolean; name: string }>(
    `/api/media`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

export default axiosApi;
