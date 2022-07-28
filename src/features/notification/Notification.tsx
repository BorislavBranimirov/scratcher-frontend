import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { popNotification, selectNotifications } from './notificationSlice';

const Notification = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectNotifications);

  useEffect(() => {
    if (messages.length > 0) {
      const timeout = setTimeout(() => {
        dispatch(popNotification());
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [messages, dispatch]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 mx-auto mb-8 z-50 w-fit max-w-md flex justify-center">
      <div
        id="notification"
        className="bg-accent py-3 px-6 rounded text-accent-inverted overflow-hidden"
      >
        <p>{messages[0]}</p>
      </div>
    </div>
  );
};

export default Notification;
