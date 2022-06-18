import { useLayoutEffect, useState } from 'react';
import { X } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModal } from './modalSlice';
import avatar from '../../images/avatarplaceholder.png';
import { selectAuthUser } from '../auth/authSlice';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { addScratch } from '../scratches/scratchesSlice';

const PostModal = () => {
  const dispatch = useAppDispatch();
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
    if (!isSubmitting) {
      setIsSubmitting(true);
      const res = await dispatch(addScratch({ body }));
      if (addScratch.fulfilled.match(res)) {
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
      <div className="flex flex-col p-3">
        <div className="flex gap-3">
          <img
            src={user?.profileImageUrl || avatar}
            alt="avatar"
            className="w-11 h-11 rounded-full overflow-hidden shrink-0"
          />
          <textarea
            name="body"
            id="body"
            ref={inputFieldRef}
            value={body}
            placeholder="What's happening?"
            className="my-2 bg-transparent border-none outline-none resize-none grow"
            onChange={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
        </div>
        {!isSubmitting && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue text-sm rounded-full py-1.5 px-4 mt-2 font-bold transition-colors enabled:hover:bg-blue/80 enabled:active:bg-blue/60 disabled:opacity-75"
              disabled={!body}
            >
              Scratch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
