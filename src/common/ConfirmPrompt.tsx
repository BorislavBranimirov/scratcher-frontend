import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

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
    <div className="fixed h-full w-full z-30 mx-auto text-primary flex justify-center items-center">
      <div
        className="fixed top-0 right-0 bottom-0 left-0 cursor-auto bg-primary/10"
        onClick={(e) => {
          e.stopPropagation();
          declineCallback();
        }}
      ></div>
      <div className="w-80 z-30 bg-neutral flex flex-col rounded-2xl p-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="break-words whitespace-pre-wrap text-sm text-secondary my-2">
          {body}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            acceptCallback();
          }}
          className="bg-red rounded-full py-2 mt-4 font-bold transition-colors hover:bg-red/80 active:bg-red/60"
        >
          {acceptText}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            declineCallback();
          }}
          className="bg-neutral border border-primary rounded-full py-2 mt-3 font-bold transition-colors hover:bg-primary/5 active:bg-primary/10"
        >
          {declineText}
        </button>
      </div>
    </div>,
    promptRoot.current
  );
};

export default ConfirmPrompt;
