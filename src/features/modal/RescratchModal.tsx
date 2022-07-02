import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import { closeModal, selectModalScratchId } from './modalSlice';
import { selectAuthUser } from '../auth/authSlice';
import { addQuoteRescratch } from '../scratches/scratchesSlice';
import { postUploadMedia } from '../../axiosApi';
import { ScratchSubmitImagePreview } from '../../common/ScratchSubmitComponents';
import axios from 'axios';
import { pushNotification } from '../notification/notificationSlice';
import { apiError } from '../../common/types';
import {
  ScratchModalLayout,
  ScratchModalProfileImage,
  ScratchModalControlButtons,
  ScratchModalTextArea,
} from './ModalComponents';
import { getProfileImageUrl } from '../../common/profileImageUrls';

const RescratchModal = () => {
  const dispatch = useAppDispatch();
  const rescratchedId = useAppSelector(selectModalScratchId);
  const user = useAppSelector(selectAuthUser);

  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!isSubmitting && rescratchedId) {
      setIsSubmitting(true);

      try {
        let mediaUrl: string | undefined;
        if (file) {
          let formData = new FormData();
          formData.append('file', file);
          const res = await postUploadMedia(formData);
          mediaUrl = res.data.name;
        }

        const res = await dispatch(
          addQuoteRescratch({ body, rescratchedId, mediaUrl })
        );
        if (addQuoteRescratch.fulfilled.match(res)) {
          dispatch(closeModal());
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          dispatch(pushNotification((err.response.data as apiError).err));
        }
      }

      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const profileImageUrl = getProfileImageUrl(user?.profileImageUrl);

  return (
    <ScratchModalLayout handleCloseModal={handleCloseModal}>
      <div className="flex gap-3">
        <ScratchModalProfileImage url={profileImageUrl} />
        <div className="min-w-0 grow">
          <ScratchModalTextArea
            body={body}
            placeholder="Add a comment"
            onChangeHandler={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
          <ScratchSubmitImagePreview
            file={file}
            handleRemoveFileInput={() => setFile(null)}
          />
          {rescratchedId ? (
            <EmbeddedRescratch rescratchedId={rescratchedId} />
          ) : (
            <div className="mt-2 mb-0.5 border border-primary rounded-xl py-2 px-2.5 cursor-pointer text-sm text-muted transition-colors duration-200 hover:bg-hover-1">
              Scratch not found
            </div>
          )}
          {!isSubmitting && (
            <ScratchModalControlButtons
              handleFileInputChange={handleFileInputChange}
              handleSubmit={handleSubmit}
              submitBtnText={'Scratch'}
            />
          )}
        </div>
      </div>
    </ScratchModalLayout>
  );
};

export default RescratchModal;
