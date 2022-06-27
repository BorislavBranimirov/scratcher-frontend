import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../auth/authSlice';
import { Link } from 'react-router-dom';
import { generateUserPath } from '../../common/routePaths';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { addScratch } from '../scratches/scratchesSlice';
import { postUploadMedia } from '../../axiosApi';
import {
  ScratchSubmitFileUploadButton,
  ScratchSubmitImagePreview,
} from '../../common/ScratchSubmitComponents';
import axios from 'axios';
import { pushNotification } from '../notification/notificationSlice';
import { apiError } from '../../common/types';
import { getProfileImageUrl } from '../../common/profileImageUrls';

const HomeScratchSubmit = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);

  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputFieldRef = useSyncTextareaHeight(body);

  if (!loggedUser) {
    return <div>User not found</div>;
  }

  const userPath = generateUserPath({ username: loggedUser.username });

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
          setBody('');
          setFile(null);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          dispatch(pushNotification((err.response.data as apiError).err));
        }
      }

      setIsSubmitting(false);
    }
  };

  const profileImageUrl = getProfileImageUrl(loggedUser.profileImageUrl);

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-primary">
      <div className="w-12 h-12 rounded-full overflow-hidden mt-1 shrink-0">
        <Link to={userPath}>
          <img src={profileImageUrl} alt="avatar" />
        </Link>
      </div>
      <div className="min-w-0 grow">
        <textarea
          className="my-2 w-full resize-none bg-transparent border-none outline-none"
          name="body"
          id="body"
          ref={inputFieldRef}
          placeholder="What's happening?"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
          disabled={isSubmitting}
        />
        <ScratchSubmitImagePreview
          file={file}
          handleRemoveFileInput={() => setFile(null)}
        />
        {!isSubmitting && (
          <div className="border-t border-primary pt-3 flex justify-between items-center">
            <div className="my-auto">
              <ScratchSubmitFileUploadButton
                handleFileInputChange={handleFileInputChange}
              />
            </div>
            <button
              className="bg-blue text-sm rounded-full py-1.5 px-4 font-bold transition-colors enabled:hover:bg-blue/80 enabled:active:bg-blue/60 disabled:opacity-75"
              onClick={handleSubmit}
              disabled={!body && !file}
            >
              Scratch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScratchSubmit;
