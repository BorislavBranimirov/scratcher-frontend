import { useLayoutEffect, useState } from 'react';
import { X } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import {
  closeModal,
  replyToScratch,
  selectModal,
  selectModalScratchById,
} from './modalSlice';
import avatar from '../../images/avatarplaceholder.png';
import TimeAgo from '../../common/TimeAgo';
import { selectAuthUser } from '../auth/authSlice';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';

const ReplyModal = () => {
  const dispatch = useAppDispatch();
  const { scratchId, scratches } = useAppSelector(selectModal);
  const user = useAppSelector(selectAuthUser);

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputFieldRef = useSyncTextareaHeight(body);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [inputFieldRef]);

  const handleSubmit = () => {
    if (!isSubmitting && scratchId) {
      setIsSubmitting(true);
      dispatch(replyToScratch({ body, parentId: scratchId }));
    }
  };

  const handleCloseModal = () => {
    setBody('');
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  if (!scratchId) {
    return (
      <div className="bg-neutral mt-10 flex flex-col z-30 rounded-2xl overflow-hidden p-5">
        Scratch not found
      </div>
    );
  }

  const parentScratch = scratches[scratchId];

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
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full overflow-hidden mt-1 shrink-0">
              <img
                src={parentScratch.author.profileImageUrl || avatar}
                alt="avatar"
              />
            </div>
            <div className="w-0.5 bg-reply-line grow"></div>
          </div>
          <div className="min-w-0 grow mb-4">
            <div className="text-secondary flex items-baseline">
              <span className="font-bold text-primary hover:underline">
                {parentScratch.author.name}
              </span>
              <span className="text-sm ml-1">
                @{parentScratch.author.username}
              </span>
              <span className="text-sm px-1">·</span>
              <div className="whitespace-nowrap">
                <TimeAgo createdAt={parentScratch.createdAt} />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="break-words whitespace-pre-wrap">
                {parentScratch.body}
              </p>
              {parentScratch.rescratchType === 'quote' &&
                parentScratch.rescratchedId && (
                  <EmbeddedRescratch
                    rescratchedId={parentScratch.rescratchedId}
                    selector={selectModalScratchById}
                  />
                )}
            </div>
          </div>
        </div>
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
            placeholder="Scratch your reply"
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
              Reply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyModal;
