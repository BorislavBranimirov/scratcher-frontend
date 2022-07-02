import React, { ChangeEvent, useLayoutEffect } from 'react';
import { X } from 'react-feather';
import { useAppSelector } from '../../app/hooks';
import { ScratchSubmitFileUploadButton } from '../../common/ScratchSubmitComponents';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { selectModalScratch } from './modalSlice';
import TimeAgo from '../../common/TimeAgo';
import { ScratchImageAttachment } from '../scratches/PostComponents';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { getProfileImageUrl } from '../../common/profileImageUrls';

export const ScratchModalLayout = ({
  handleCloseModal,
  children,
}: {
  handleCloseModal: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-primary mt-10 max-h-[90vh] flex flex-col z-30 rounded-2xl overflow-hidden w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
      <div className="border-b border-primary p-3 flex justify-start">
        <button className="relative" onClick={handleCloseModal} title="Close">
          <div className="absolute inset-0 -m-1.5 rounded-full transition-colors hover:bg-hover-1 active:bg-hover-3"></div>
          <X />
        </button>
      </div>
      <div className="flex flex-col p-3 overflow-y-auto">{children}</div>
    </div>
  );
};

export const ScratchModalParentScratch = () => {
  const parentScratch = useAppSelector(selectModalScratch);

  if (!parentScratch) {
    return null;
  }

  const profileImageUrl = getProfileImageUrl(parentScratch.author.profileImageUrl);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-11 h-11 rounded-full overflow-hidden mt-1 shrink-0">
          <img
            src={profileImageUrl}
            alt="avatar"
          />
        </div>
        <div className="w-0.5 bg-reply-line grow"></div>
      </div>
      <div className="min-w-0 grow mb-4">
        <div className="text-muted flex items-baseline">
          <span className="font-bold text-main hover:underline">
            {parentScratch.author.name}
          </span>
          <span className="text-sm ml-1">@{parentScratch.author.username}</span>
          <span className="text-sm px-1">·</span>
          <div className="whitespace-nowrap">
            <TimeAgo createdAt={parentScratch.createdAt} />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="break-words whitespace-pre-wrap">
            {parentScratch.body}
          </p>
          {parentScratch.mediaUrl && (
            <ScratchImageAttachment url={parentScratch.mediaUrl} cropImage />
          )}
          {parentScratch.rescratchType === 'quote' &&
            parentScratch.rescratchedId && (
              <EmbeddedRescratch rescratchedId={parentScratch.rescratchedId} />
            )}
        </div>
      </div>
    </div>
  );
};

export const ScratchModalProfileImage = ({ url }: { url: string }) => {
  return (
    <img
      src={url}
      alt="avatar"
      className="w-11 h-11 rounded-full overflow-hidden shrink-0"
    />
  );
};

export const ScratchModalTextArea = ({
  body,
  placeholder,
  onChangeHandler,
  disabled,
}: {
  body: string;
  placeholder: string;
  onChangeHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) => {
  const inputFieldRef = useSyncTextareaHeight(body);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [inputFieldRef]);

  return (
    <textarea
      name="body"
      id="body"
      ref={inputFieldRef}
      value={body}
      placeholder={placeholder}
      className="my-2 bg-transparent border-none outline-none resize-none w-full"
      onChange={onChangeHandler}
      disabled={disabled}
    />
  );
};

export const ScratchModalControlButtons = ({
  handleFileInputChange,
  handleSubmit,
  submitBtnText,
  disabledSubmitBtnCondition = false,
}: {
  handleFileInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  submitBtnText: string;
  disabledSubmitBtnCondition?: boolean;
}) => {
  return (
    <div className="flex justify-between items-center pt-2">
      <div className="my-auto">
        <ScratchSubmitFileUploadButton
          handleFileInputChange={handleFileInputChange}
          id="modal-file-input"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-accent text-sm rounded-full py-1.5 px-4 font-bold transition-colors enabled:hover:bg-accent/80 enabled:active:bg-accent/60 disabled:opacity-75"
        disabled={disabledSubmitBtnCondition}
      >
        {submitBtnText}
      </button>
    </div>
  );
};
