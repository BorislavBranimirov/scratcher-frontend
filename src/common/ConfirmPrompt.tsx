import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '../app/hooks';
import {
  selectThemeAccent,
  selectThemeBackground,
} from '../features/theme/themeSlice';

const ConfirmPrompt = ({
  title,
  body,
  acceptText,
  declineText,
  acceptCallback = () => {},
  declineCallback = () => {},
}: {
  title: string;
  body: string;
  acceptText: string;
  declineText: string;
  acceptCallback: () => void;
  declineCallback: () => void;
}) => {
  const themeAccent = useAppSelector(selectThemeAccent);
  const themeBackground = useAppSelector(selectThemeBackground);
  const promptRoot = useRef(document.getElementById('confirmPrompt'));

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  if (!promptRoot.current) {
    return null;
  }

  return createPortal(
    <div
      className={`${themeAccent} ${themeBackground} fixed h-full w-full z-30 mx-auto text-main flex justify-center items-center`}
    >
      <div
        className="fixed inset-0 cursor-auto bg-hover-2"
        onClick={(e) => {
          e.stopPropagation();
          declineCallback();
        }}
      ></div>
      <div className="w-80 z-30 bg-primary flex flex-col rounded-2xl p-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="break-words whitespace-pre-wrap text-sm text-muted my-2">
          {body}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            acceptCallback();
          }}
          className="bg-danger rounded-full py-2 mt-4 font-bold text-accent-inverted transition-colors hover:bg-danger/80 active:bg-danger/60"
        >
          {acceptText}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            declineCallback();
          }}
          className="border border-primary rounded-full py-2 mt-3 font-bold transition-colors hover:bg-hover-1 active:bg-hover-2"
        >
          {declineText}
        </button>
      </div>
    </div>,
    promptRoot.current
  );
};

export default ConfirmPrompt;
