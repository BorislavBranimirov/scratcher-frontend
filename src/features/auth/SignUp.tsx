import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { login, selectAuthUser } from './authSlice';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await axios.post<{
      success: boolean;
      id: number;
      username: string;
    }>('/api/users', { username, password });

    if (res.data.success) {
      dispatch(login({ username, password }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  });

  return (
    <div className="col-span-full md:col-span-7 lg:col-span-6 xl:col-span-5 flex items-center">
      <div className="grow flex flex-col rounded-2xl border border-primary p-3 h-[80%]">
        <h2 className="text-center text-2xl font-bold leading-6 py-4">
          Create your account
        </h2>
        <form
          className="grow mx-auto mt-2 w-[80%] flex flex-col justify-between"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6">
            <div className="relative">
              <input
                className="peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none focus:outline-blue"
                type="text"
                name="username"
                id="username"
                pattern="[a-zA-Z0-9]{6,25}"
                title="Minimum of 6 characters, no spaces or special symbols"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label
                className="absolute left-0 top-0 px-2 pt-1 text-sm text-secondary transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm peer-focus:text-blue"
                htmlFor="username"
              >
                Username
              </label>
            </div>
            <div className="relative">
              <input
                className="peer w-full bg-transparent placeholder-transparent border border-primary rounded-md p-2 pt-6 outline-none focus:outline-blue"
                type="password"
                name="password"
                id="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}"
                title="Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                className="absolute left-0 top-0 px-2 pt-1 text-sm text-secondary transition-all peer-placeholder-shown:py-4 peer-placeholder-shown:text-base peer-focus:px-2 peer-focus:pt-1 peer-focus:text-sm peer-focus:text-blue"
                htmlFor="password"
              >
                Password
              </label>
            </div>
          </div>
          <button
            className="w-full bg-blue rounded-full py-3 font-bold transition-colors enabled:hover:bg-blue/80 enabled:active:bg-blue/60 disabled:opacity-75"
            type="submit"
            disabled={!username || !password}
          >
            Sign up
          </button>
        </form>
        <div className="my-4 flex gap-1 mx-auto w-[80%]">
          <span>Already have an account?</span>
          <Link className="text-blue hover:underline" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
