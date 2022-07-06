import { useLayoutEffect, useRef } from 'react';

function useSyncTextareaHeight(body: string) {
  const inputFieldRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      const totalBorderHeight =
        inputFieldRef.current.offsetHeight - inputFieldRef.current.clientHeight;

      const parentEl = inputFieldRef.current.parentElement;
      if (parentEl) {
        // preserve height of parent before setting textarea height to 0
        // prevents scroll jumping in some cases where an ancestor overflows
        parentEl.style.height = `${parentEl.scrollHeight}px`;
      }
      inputFieldRef.current.style.height = '0';

      inputFieldRef.current.style.height =
        inputFieldRef.current.scrollHeight + totalBorderHeight + 'px';
      if (parentEl) {
        // remove the manually set parent height
        parentEl.style.height = '';
      }
    }
  }, [body, inputFieldRef]);

  return inputFieldRef;
}

export default useSyncTextareaHeight;
