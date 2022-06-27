import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patchUser } from '../../axiosApi';
import {
  getProfileBannerUrl,
  getProfileImageUrl,
} from '../../common/profileImageUrls';
import { generateUserPath } from '../../common/routePaths';
import { apiError } from '../../common/types';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { selectAuthUser } from '../auth/authSlice';
import { openImagePreview } from '../imagePreview/imagePreviewSlice';
import { pushNotification } from '../notification/notificationSlice';

const SettingsEditProfile = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);
  const [name, setName] = useState(loggedUser?.name || '');
  const [nameError, setNameError] = useState(false);
  const [description, setDescription] = useState(loggedUser?.description || '');
  const [descriptionError, setDescriptionError] = useState(false);
  const navigate = useNavigate();

  const inputFieldRef = useSyncTextareaHeight(description);

  const profileImageUrl = getProfileImageUrl(loggedUser?.profileImageUrl);
  const profileBannerUrl = getProfileBannerUrl(loggedUser?.profileBannerUrl);

  const nameLimit = 50;
  const descriptionLimit = 160;

  const handleSubmit = async () => {
    setNameError(false);
    setDescriptionError(false);
    if (loggedUser) {
      if (name !== loggedUser.name || description !== loggedUser.description) {
        if (name.length === 0 || name.length > nameLimit) {
          setNameError(true);
          return;
        }

        if (description.length > descriptionLimit) {
          setDescriptionError(true);
          return;
        }

        try {
          const res = await patchUser({ id: loggedUser.id, name, description });
          if (res.data.success) {
            navigate(generateUserPath({ username: res.data.username }));
          }
        } catch (err) {
          if (axios.isAxiosError(err) && err.response) {
            dispatch(pushNotification((err.response.data as apiError).err));
          }
        }
      } else {
        dispatch(pushNotification('Profile information is already up to date'));
      }
    }
  };

  if (!loggedUser) {
    return (
      <div className="mt-4 text-center">
        <h2 className="text-lg font-bold">
          Profile information failed to load
        </h2>
        <p className="text-sm text-secondary">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <img
        className="cursor-pointer"
        src={profileBannerUrl}
        alt="banner"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(openImagePreview(profileBannerUrl));
        }}
      />
      <div className="pt-3 px-4">
        <img
          className="w-1/5 rounded-full -mt-[12%] border-4 border-neutral cursor-pointer"
          src={profileImageUrl}
          alt="avatar"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openImagePreview(profileImageUrl));
          }}
        />
      </div>
      <div className="mt-4 w-[90%] mx-auto flex flex-col gap-6">
        <div className="relative">
          <input
            className={`peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
              nameError ? 'outline-red' : 'focus:outline-blue'
            }`}
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              if (e.target.value.length <= nameLimit) {
                setName(e.target.value);
              }
            }}
          />
          <label
            className={`absolute left-0 top-0 px-2 pt-1 text-sm text-secondary transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
              nameError ? 'text-red' : 'peer-focus:text-blue'
            }`}
            htmlFor="name"
          >
            Name
          </label>
          <span className="absolute right-0 top-0 px-2 pt-1 text-sm text-secondary">
            {name.length}/{nameLimit}
          </span>
          {nameError && (
            <span className="text-red text-sm">
              Name can't be blank and must be a maximum of {nameLimit}{' '}
              characters
            </span>
          )}
        </div>
        <div className="relative">
          <textarea
            className={`resize-none peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none ${
              descriptionError ? 'outline-red' : 'focus:outline-blue'
            }`}
            name="description"
            id="description"
            ref={inputFieldRef}
            placeholder="Description"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= descriptionLimit) {
                setDescription(e.target.value);
              }
            }}
          />
          <label
            className={`absolute left-0 top-0 px-2 pt-1 text-sm text-secondary transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm ${
              descriptionError ? 'text-red' : 'peer-focus:text-blue'
            }`}
            htmlFor="description"
          >
            Description
          </label>
          <span className="absolute right-0 top-0 px-2 pt-1 text-sm text-secondary">
            {description.length}/{descriptionLimit}
          </span>
          {descriptionError && (
            <span className="text-red text-sm">
              Description must be a maximum of {descriptionLimit} characters
            </span>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            className={`bg-blue rounded-full py-1.5 px-8 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsEditProfile;
