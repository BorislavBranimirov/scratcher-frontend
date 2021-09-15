import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import {
  closeModal,
  replyToScratch,
  selectModal,
  selectModalScratchById,
} from './modalSlice';

const ReplyModal = () => {
  const dispatch = useAppDispatch();
  const { scratchId, scratches } = useAppSelector(selectModal);

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!isSubmitting && scratchId) {
      setIsSubmitting(true);
      dispatch(replyToScratch({ body, parentId: scratchId }));
    }
  };

  const handleCloseModal = () => {
    setBody('');
    setIsSubmitting(false);
    dispatch(closeModal());
  };

  if (!scratchId) {
    return <div>Scratch not found</div>;
  }

  const parentScratch = scratches[scratchId];

  return (
    <div>
      <hr />
      <hr />
      Reply form
      <button onClick={handleCloseModal}>X</button>
      <div>
        <p>
          {parentScratch.author.name}@{parentScratch.author.username}
          {parentScratch.createdAt}
        </p>
        <p>{parentScratch.body}</p>
        {parentScratch.rescratchType === 'quote' &&
          parentScratch.rescratchedId && (
            <EmbeddedRescratch
              rescratchedId={parentScratch.rescratchedId}
              selector={selectModalScratchById}
            />
          )}
      </div>
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
            Reply
          </button>
        </div>
      )}
      <hr />
      <hr />
    </div>
  );
};

export default ReplyModal;
