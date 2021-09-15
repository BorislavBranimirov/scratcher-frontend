import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addScratch } from '../../features/timeline/timelineSlice';

const HomeScratchSubmit = () => {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const res = await dispatch(addScratch({ body }));
      if (addScratch.fulfilled.match(res)) {
        setBody('');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <textarea
        name="body"
        id="body"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        disabled={isSubmitting}
      />
      {!isSubmitting && (
        <div>
          <button onClick={handleSubmit} disabled={!body}>
            Scratch
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeScratchSubmit;
