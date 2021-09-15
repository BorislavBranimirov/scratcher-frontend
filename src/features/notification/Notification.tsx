import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { popNotification, selectNotification } from './notificationSlice';

const Notification = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector(selectNotification);

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        dispatch(popNotification());
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [message, dispatch]);

  if (!message) {
    return null;
  }

  return (
    <div>
      Notification:
      <p>{message}</p>
    </div>
  );
};

export default Notification;
