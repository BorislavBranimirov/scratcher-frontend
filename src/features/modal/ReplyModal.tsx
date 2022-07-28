import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModal, selectModalScratchId } from './modalSlice';
import { selectAuthUser } from '../auth/authSlice';
import { addReplyScratch } from '../scratches/scratchesSlice';
import { postUploadMedia } from '../../axiosApi';
import { ScratchSubmitImagePreview } from '../../common/ScratchSubmitComponents';
import axios from 'axios';
import { pushNotification } from '../notification/notificationSlice';
import { apiError } from '../../common/types';
import {
  ScratchModalLayout,
  ScratchModalParentScratch,
  ScratchModalProfileImage,
  ScratchModalControlButtons,
  ScratchModalTextArea,
} from './ModalComponents';
import { getProfileImageUrl } from '../../common/profileImageUrls';

const ReplyModal = () => {
  const dispatch = useAppDispatch();
  const parentScratchId = useAppSelector(selectModalScratchId);
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
    if (!isSubmitting && parentScratchId) {
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
          addReplyScratch({ body, parentId: parentScratchId, mediaUrl })
        );
        if (addReplyScratch.fulfilled.match(res)) {
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

  if (!parentScratchId) {
    return (
      <ScratchModalLayout handleCloseModal={handleCloseModal}>
        Scratch not found
      </ScratchModalLayout>
    );
  }
  
  const profileImageUrl = getProfileImageUrl(user?.profileImageUrl);

  return (
    <ScratchModalLayout handleCloseModal={handleCloseModal}>
      <ScratchModalParentScratch />
      <div className="flex gap-3">
        <ScratchModalProfileImage url={profileImageUrl} />
        <div className="min-w-0 grow" data-cy="modal-post-scratch">
          <ScratchModalTextArea
            body={body}
            placeholder="Scratch your reply"
            onChangeHandler={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
          <ScratchSubmitImagePreview
            file={file}
            handleRemoveFileInput={() => setFile(null)}
          />
          {!isSubmitting && (
            <ScratchModalControlButtons
              handleFileInputChange={handleFileInputChange}
              handleSubmit={handleSubmit}
              submitBtnText={'Reply'}
              disabledSubmitBtnCondition={!body && !file}
            />
          )}
        </div>
      </div>
    </ScratchModalLayout>
  );
};

export default ReplyModal;
