import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addScratch } from './scratchPageSlice';

const ScratchSubmit = ({ scratchId }: { scratchId: number }) => {
  const dispatch = useAppDispatch();
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const res = await dispatch(addScratch({ body, parentId: scratchId }));
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

export default ScratchSubmit;
