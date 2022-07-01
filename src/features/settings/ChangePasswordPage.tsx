import axios from 'axios';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { postChangePassword } from '../../axiosApi';
import { apiError } from '../../common/types';
import { logout, selectAuthUser } from '../auth/authSlice';
import { pushNotification } from '../notification/notificationSlice';
import ChangePasswordInputField from './ChangePasswordInputField';

const ChangePasswordPage = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError(null);
    setConfirmPasswordError(null);

    if (loggedUser) {
      try {
        if (confirmPassword !== password) {
          setConfirmPasswordError('Passwords do not match');
          return;
        }

        if (password === currentPassword) {
          setPasswordError(
            'New password cannot be the same as your current one'
          );
          return;
        }

        await postChangePassword({
          id: loggedUser.id,
          currentPassword,
          password,
          confirmPassword,
        });

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
      <form
        className="mt-6 w-[90%] mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <ChangePasswordInputField
          name="current-password"
          placeholder="Current password"
          password={currentPassword}
          passwordError={null}
          handleChange={(e) => setCurrentPassword(e.target.value)}
        />
        <ChangePasswordInputField
          name="password"
          placeholder="New password"
          password={password}
          passwordError={passwordError}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <ChangePasswordInputField
          name="confirm-password"
          placeholder="Confirm password"
          password={confirmPassword}
          passwordError={confirmPasswordError}
          handleChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className={`bg-blue rounded-full py-1.5 px-8 font-bold transition-colors enabled:hover:bg-blue/80 enabled:active:bg-blue/60 disabled:opacity-75`}
            type="submit"
            disabled={!currentPassword || !password || !confirmPassword}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
