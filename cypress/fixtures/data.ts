export const tokenWithInvalidSignature =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0VXNlcjEiLCJpYXQiOjczMDAwMDAwMDAsImV4cCI6NzMwMDAwMDAwMH0.fhJVbEimJkupu1Wi8L64ZZKAMwBl0nQF3Or23grCFcA';

export const loggedUser = {
  id: 1,
  name: 'test user 1',
  username: 'testUser1',
  createdAt: '2021-06-30T23:32:05.384Z',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  pinnedId: null,
  profileImageUrl: null,
  profileBannerUrl: null,
  followerCount: 0,
  followedCount: 0,
  isFollowing: false,
};

export const timelineScratches = [
  {
    id: 2,
    authorId: loggedUser.id,
    parentId: 1,
    rescratchedId: null,
    body: 'child',
    mediaUrl: null,
    createdAt: '2021-06-30T23:32:05.395Z',
    author: {
      id: loggedUser.id,
      name: loggedUser.name,
      username: loggedUser.username,
      profileImageUrl: loggedUser.profileImageUrl,
    },
    replyCount: 0,
    rescratchCount: 0,
    likeCount: 0,
    isRescratched: false,
    isLiked: false,
    isBookmarked: false,
    rescratchType: 'none',
  },
  {
    id: 1,
    authorId: loggedUser.id,
    parentId: null,
    rescratchedId: null,
    body: 'parent',
    mediaUrl: null,
    createdAt: '2021-06-30T23:32:05.395Z',
    author: {
      id: loggedUser.id,
      name: loggedUser.name,
      username: loggedUser.username,
      profileImageUrl: loggedUser.profileImageUrl,
    },
    replyCount: 1,
    rescratchCount: 0,
    likeCount: 0,
    isRescratched: false,
    isLiked: false,
    isBookmarked: false,
    rescratchType: 'none',
  },
];
