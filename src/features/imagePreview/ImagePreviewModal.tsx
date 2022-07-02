import { useEffect } from 'react';
import { X } from 'react-feather';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeImagePreview, selectImagePreviewUrl } from './imagePreviewSlice';

const ImagePreviewModal = () => {
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector(selectImagePreviewUrl);
  const location = useLocation();

  useEffect(() => {
    if (imageUrl) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [imageUrl]);

  useEffect(() => {
    return () => {
      dispatch(closeImagePreview());
    };
  }, [location, dispatch]);

  if (!imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed h-screen w-full z-30 bg-backdrop/90 p-8"
      onClick={(e) => {
        e.stopPropagation();
        const target = e.target as Element;
        if (!target.closest('img')) dispatch(closeImagePreview());
      }}
    >
      <button className="absolute top-4 left-4 z-50 group" title="Close">
        <div className="absolute inset-0 -m-1.5 rounded-full transition-colors bg-hover-1 group-hover:bg-hover-2 group-active:bg-hover-3"></div>
        <X className="relative" />
      </button>
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt="attachment"
          className="max-h-full max-w-full w-auto h-auto"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
