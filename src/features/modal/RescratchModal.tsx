import { useLayoutEffect, useState } from 'react';
import { X } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { closeModal, selectModalScratchId } from './modalSlice';
import avatar from '../../images/avatarplaceholder.png';
import { selectAuthUser } from '../auth/authSlice';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { addQuoteRescratch } from '../scratches/scratchesSlice';

const RescratchModal = () => {
  const dispatch = useAppDispatch();
  const rescratchedId = useAppSelector(selectModalScratchId);
  const user = useAppSelector(selectAuthUser);

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputFieldRef = useSyncTextareaHeight(body);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [inputFieldRef]);

  const handleSubmit = async () => {
    if (!isSubmitting && rescratchedId) {
      setIsSubmitting(true);
      const res = await dispatch(addQuoteRescratch({ body, rescratchedId }));
      if (addQuoteRescratch.fulfilled.match(res)) {
        dispatch(closeModal());
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseModal = () => {
    setBody('');
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  return (
    <div className="bg-neutral mt-10 flex flex-col z-30 rounded-2xl overflow-hidden w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
      <div className="border-b border-primary p-3 flex justify-start">
        <button className="relative" onClick={handleCloseModal} title="Close">
          <div className="absolute top-0 left-0 right-0 bottom-0 -m-1.5 rounded-full transition-colors hover:bg-primary/5 active:bg-primary/20"></div>
          <X />
        </button>
      </div>
      <div className="flex gap-3 p-3">
        <img
          src={user?.profileImageUrl || avatar}
          alt="avatar"
          className="w-11 h-11 rounded-full overflow-hidden shrink-0"
        />
        <div className="grow flex flex-col min-w-0">
          <textarea
            name="body"
            id="body"
            ref={inputFieldRef}
            value={body}
            placeholder="Add a comment"
            className="my-2 bg-transparent border-none outline-none resize-none"
            onChange={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
          {rescratchedId ? (
            <EmbeddedRescratch rescratchedId={rescratchedId} />
          ) : (
            <div className="mt-2 mb-0.5 border border-primary rounded-xl py-2 px-2.5 cursor-pointer text-secondary text-sm transition-colors duration-200 hover:bg-primary/5">
              Scratch not found
            </div>
          )}
          {!isSubmitting && (
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue text-sm rounded-full py-1.5 px-4 mt-2 font-bold transition-colors hover:bg-blue/80 active:bg-blue/60"
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
