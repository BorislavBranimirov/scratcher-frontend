import { useLayoutEffect, useRef } from 'react';

function useSyncTextareaHeight(body: string) {
  const inputFieldRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.style.height = '0';
      inputFieldRef.current.style.height =
        inputFieldRef.current.scrollHeight + 'px';
    }
  }, [body, inputFieldRef]);

  return inputFieldRef;
}

export default useSyncTextareaHeight;
