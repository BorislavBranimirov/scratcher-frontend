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
    <div className="fixed right-0 bottom-0 left-0 mx-auto mb-8 z-50 w-fit max-w-md flex justify-center">
      <div className="bg-accent py-3 px-6 rounded overflow-hidden">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
