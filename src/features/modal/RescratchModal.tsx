import { useState } from 'react';
import { X } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import {
  addQuoteRescratch,
  closeModal,
  selectModal,
  selectModalScratchById,
} from './modalSlice';
import avatar from '../../images/avatarplaceholder.png';
import { selectAuthUser } from '../auth/authSlice';

const RescratchModal = () => {
  const dispatch = useAppDispatch();
  const { scratchId } = useAppSelector(selectModal);
  const user = useAppSelector(selectAuthUser);

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!isSubmitting && scratchId) {
      setIsSubmitting(true);
      dispatch(addQuoteRescratch({ body, rescratchedId: scratchId }));
    }
  };

  const handleCloseModal = () => {
    setBody('');
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  return (
    <div className="bg-neutral mt-10 flex flex-col z-30 rounded-2xl overflow-hidden lg:w-1/2">
      <div className="border-b border-primary p-3 flex justify-start">
        <button className="relative" onClick={handleCloseModal} title="Close">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-1.5 rounded-full transition-colors hover:bg-primary/5 active:bg-opacity-20"></div>
          <X />
        </button>
      </div>
      <div className="flex gap-3 p-3">
        <img
          src={user?.profileImageUrl || avatar}
          alt="avatar"
          className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
        />
        <div className="flex-grow flex flex-col min-w-0">
          <textarea
            name="body"
            id="body"
            value={body}
            placeholder="Add a comment"
            className="bg-transparent resize-none"
            onChange={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
          {scratchId ? (
            <EmbeddedRescratch
              rescratchedId={scratchId}
              selector={selectModalScratchById}
            />
          ) : (
            <div className="mt-2 mb-0.5 border border-primary rounded-xl py-2 px-2.5 cursor-pointer text-secondary text-sm transition-colors duration-200 hover:bg-primary/5">
              Scratch not found
            </div>
          )}
          {!isSubmitting && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue rounded-full py-1.5 px-4 mt-2 font-bold transition-colors hover:bg-opacity-80 active:bg-opacity-60"
              >
                Scratch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescratchModal;
