import axios from 'axios';
import { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  deleteProfileBanner,
  patchUser,
  postProfileBanner,
  postProfileImage,
} from '../../axiosApi';
import {
  getProfileBannerUrl,
  getProfileImageUrl,
} from '../../common/profileImageUrls';
import { generateUserPath } from '../../common/routePaths';
import { apiError } from '../../common/types';
import usePreviewImage from '../../common/usePreviewImage';
import { selectAuthUser } from '../auth/authSlice';
import { openImagePreview } from '../imagePreview/imagePreviewSlice';
import { pushNotification } from '../notification/notificationSlice';
import {
  EditProfileDescriptionField,
  EditProfileFileUploadButton,
  EditProfileNameField,
  ImageCropper,
} from './EditProfileComponents';

const EditProfilePage = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [bannerDeleted, setBannerDeleted] = useState(false);
  const [previewProfileImage] = usePreviewImage(profileImageFile);
  const [previewProfileBanner] = usePreviewImage(profileBannerFile);
  const [showProfileImageCropper, setShowProfileImageCropper] = useState(false);
  const [showProfileBannerCropper, setShowProfileBannerCropper] =
    useState(false);
  const [name, setName] = useState(loggedUser?.name || '');
  const [nameError, setNameError] = useState(false);
  const [description, setDescription] = useState(loggedUser?.description || '');
  const [descriptionError, setDescriptionError] = useState(false);
  const navigate = useNavigate();

  const profileImageUrl =
    previewProfileImage || getProfileImageUrl(loggedUser?.profileImageUrl);
  const profileBannerUrl =
    previewProfileBanner ||
    getProfileBannerUrl(bannerDeleted ? null : loggedUser?.profileBannerUrl);

  useEffect(() => {
    if (previewProfileImage) {
      setShowProfileImageCropper((showing) => !showing);
    }
  }, [previewProfileImage]);

  useEffect(() => {
    if (previewProfileBanner) {
      setShowProfileBannerCropper((showing) => !showing);
    }
  }, [previewProfileBanner]);

  const nameLimit = 50;
  const descriptionLimit = 160;

  const handleSubmit = async () => {
    setNameError(false);
    setDescriptionError(false);
    if (loggedUser) {
      if (
        name === loggedUser.name &&
        description === loggedUser.description &&
        !profileImageFile &&
        !profileBannerFile &&
        !bannerDeleted
      ) {
        dispatch(pushNotification('Profile information is already up to date'));
        return;
      }

      if (name.length === 0 || name.length > nameLimit) {
        setNameError(true);
        return;
      }

      if (description.length > descriptionLimit) {
        setDescriptionError(true);
        return;
      }

      try {
        if (profileImageFile) {
          let formData = new FormData();
          formData.append('file', profileImageFile);
          await postProfileImage(formData);
        }

        if (profileBannerFile) {
          let formData = new FormData();
          formData.append('file', profileBannerFile);
          await postProfileBanner(formData);
        }

        if (bannerDeleted) {
          await deleteProfileBanner();
        }

        if (
          name !== loggedUser.name ||
          description !== loggedUser.description
        ) {
          await patchUser({ id: loggedUser.id, name, description });
        }

        navigate(generateUserPath({ username: loggedUser.username }));
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          dispatch(pushNotification((err.response.data as apiError).err));
        }
      }
    }
  };

  if (!loggedUser) {
    return (
      <div className="mt-4 text-center">
        <h2 className="text-lg font-bold">
          Profile information failed to load
        </h2>
        <p className="text-sm text-muted">Please try again later.</p>
      </div>
    );
  }

  if (showProfileImageCropper) {
    return (
      <ImageCropper
        imageUrl={profileImageUrl}
        aspect={1}
        finalWidth={400}
        finalHeight={400}
        onApply={(image) => {
          if (image) {
            setProfileImageFile(image);
          }
        }}
      />
    );
  }

  if (showProfileBannerCropper) {
    return (
      <ImageCropper
        imageUrl={profileBannerUrl}
        aspect={3}
        finalWidth={1500}
        finalHeight={500}
        onApply={(image) => {
          if (image) {
            setProfileBannerFile(image);
          }
        }}
        objectFit="horizontal-cover"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="relative w-full overflow-hidden">
        <div className="pb-[33.3333%]"></div>
        <img
          className="absolute inset-0 mx-auto cursor-pointer"
          src={profileBannerUrl}
          alt="banner"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(openImagePreview(profileBannerUrl));
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-backdrop/50">
          <div className="w-full h-full flex justify-center items-center gap-5 opacity-75">
            <EditProfileFileUploadButton
              handleFileInputChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setBannerDeleted(false);
                  setProfileBannerFile(files[0]);
                }
              }}
              id="settings-banner-file-input"
            />
            {!bannerDeleted &&
              (loggedUser.profileBannerUrl || profileBannerFile) && (
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-backdrop/80 hover:bg-backdrop/60 active:bg-backdrop/40"
                  onClick={() => {
                    setBannerDeleted(true);
                    setProfileBannerFile(null);
                  }}
                  title="Remove photo"
                >
                  <X />
                </button>
              )}
          </div>
        </div>
      </div>
      <div className="pt-3 px-4">
        <div className="relative w-1/4 -mt-[14%] rounded-full overflow-hidden border-4 border-match-background">
          <div className="pb-[100%]"></div>
          <img
            className="absolute top-0 left-0 w-full h-full cursor-pointer"
            src={profileImageUrl}
            alt="avatar"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(openImagePreview(profileImageUrl));
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-backdrop/50">
            <div className="w-full h-full flex justify-center items-center opacity-75">
              <EditProfileFileUploadButton
                handleFileInputChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setProfileImageFile(files[0]);
                  }
                }}
                id="settings-image-file-input"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 w-[90%] mx-auto flex flex-col gap-6">
        <EditProfileNameField
          name={name}
          nameError={nameError}
          nameLimit={nameLimit}
          handleChange={(e) => {
            if (e.target.value.length <= nameLimit) {
              setName(e.target.value);
            }
          }}
        />
        <EditProfileDescriptionField
          description={description}
          descriptionError={descriptionError}
          descriptionLimit={descriptionLimit}
          handleChange={(e) => {
            if (e.target.value.length <= descriptionLimit) {
              setDescription(e.target.value);
            }
          }}
        />
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            className={`bg-accent rounded-full py-1.5 px-8 font-bold transition-colors hover:bg-accent/80 active:bg-accent/60`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
