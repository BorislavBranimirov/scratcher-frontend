import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteUser } from '../../axiosApi';
import { apiError } from '../../common/types';
import { logout, selectAuthUser } from '../auth/authSlice';
import { pushNotification } from '../notification/notificationSlice';

const DeleteAccountPage = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);

  const handleDelete = async () => {
    if (loggedUser) {
      try {
        await deleteUser(loggedUser.id);
        dispatch(logout());
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          dispatch(pushNotification((err.response.data as apiError).err));
        }
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-[90%] mx-auto my-6 text-center">
        <h2 className="text-lg font-bold">This will delete your account</h2>
        <p className="break-words whitespace-pre-wrap text-sm text-secondary mt-2">
          Your public profile and scratches will no longer be viewable on
          Scratcher. This action is permanent and cannot be reversed.
        </p>
      </div>
      <button
        className="w-[80%] lg:w-[50%] mx-auto bg-red rounded-full py-3 font-bold transition-colors hover:bg-red/80 active:bg-red/60"
        onClick={handleDelete}
      >
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccountPage;
