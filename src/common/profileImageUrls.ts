import avatar from '../images/avatarplaceholder.png';
import banner from '../images/bannerplaceholder.png';

export const getProfileImageUrl = (imageUrl: string | null | undefined) => {
  return imageUrl
    ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto/${imageUrl}`
    : avatar;
};

export const getProfileBannerUrl = (imageUrl: string | null | undefined) => {
  return imageUrl
    ? `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto/${imageUrl}`
    : banner;
};
