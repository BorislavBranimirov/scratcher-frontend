import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { closeModal } from './modalSlice';
import { selectAuthUser } from '../auth/authSlice';
import { addScratch } from '../scratches/scratchesSlice';
import { postUploadMedia } from '../../axiosApi';
import { ScratchSubmitImagePreview } from '../../common/ScratchSubmitComponents';
import axios from 'axios';
import { apiError } from '../../common/types';
import { pushNotification } from '../notification/notificationSlice';
import {
  ScratchModalLayout,
  ScratchModalProfileImage,
  ScratchModalControlButtons,
  ScratchModalTextArea,
} from './ModalComponents';
import { getProfileImageUrl } from '../../common/profileImageUrls';

const PostModal = () => {
  const dispatch = useAppDispatch();
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
    if (!isSubmitting) {
      setIsSubmitting(true);

      try {
        let mediaUrl: string | undefined;
        if (file) {
          let formData = new FormData();
          formData.append('file', file);
          const res = await postUploadMedia(formData);
          mediaUrl = res.data.name;
        }

        const res = await dispatch(addScratch({ body, mediaUrl }));
        if (addScratch.fulfilled.match(res)) {
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
            placeholder="What's happening?"
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
              submitBtnText={'Scratch'}
              disabledSubmitBtnCondition={!body && !file}
            />
          )}
        </div>
      </div>
    </ScratchModalLayout>
  );
};

export default PostModal;
