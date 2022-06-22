import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  openUserPreview,
  selectUserPreviewUserId,
  setUserPreviewMouseLeft,
} from './userPreviewSlice';

const useUserPreviewEvents = (username: string) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserPreviewUserId);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };

    timeout.current = setTimeout(() => {
      dispatch(
        openUserPreview({
          username: username,
          pos,
        })
      );
    }, 500);
  };

  const onMouseLeave = () => {
    if (userId) {
      dispatch(setUserPreviewMouseLeft(true));
    }
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  return [onMouseEnter, onMouseLeave];
};

export default useUserPreviewEvents;
