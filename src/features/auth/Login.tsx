import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { login, selectAuthUser } from './authSlice';

const Login = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (user) {
      history.replace('/');
    }
  });

  return (
    <div>
      <p>Log in to Scratcher</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          pattern="[a-zA-Z0-9]{6,25}"
          title="Minimum of 6 characters, no spaces or special symbols"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}"
          title="Minimum of 8 characters, one lowercase letter, one uppercase letter and a digit"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Log in" />
      </form>
    </div>
  );
};

export default Login;
