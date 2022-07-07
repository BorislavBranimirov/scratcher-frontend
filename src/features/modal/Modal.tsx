import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModal, selectModalShow, selectModalType } from './modalSlice';
import PostModal from './PostModal';
import ReplyModal from './ReplyModal';
import RescratchModal from './RescratchModal';

const Modal = () => {
  const dispatch = useAppDispatch();
  const show = useAppSelector(selectModalShow);
  const type = useAppSelector(selectModalType);
  const location = useLocation();

  useEffect(() => {
    if (show) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
  }, [show]);

  useEffect(() => {
    return () => {
      dispatch(closeModal());
    };
  }, [location, dispatch]);

  if (!show || !type) {
    return null;
  }

  return (
    <div className="fixed inset-0 h-full w-full z-30 mx-auto flex justify-center items-start">
      {type && (
        <div
          className="fixed inset-0 cursor-auto bg-hover-2"
          onClick={() => {
            dispatch(closeModal());
          }}
        ></div>
      )}
      {type === 'post' && <PostModal />}
      {type === 'reply' && <ReplyModal />}
      {type === 'rescratch' && <RescratchModal />}
    </div>
  );
};

export default Modal;
