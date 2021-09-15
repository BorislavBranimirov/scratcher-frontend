import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import EmbeddedRescratch from '../../common/EmbeddedRescratch';
import {
  addQuoteRescratch,
  closeModal,
  selectModal,
  selectModalScratchById,
} from './modalSlice';

const RescratchModal = () => {
  const dispatch = useAppDispatch();
  const { scratchId } = useAppSelector(selectModal);

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!isSubmitting && scratchId) {
      setIsSubmitting(true);
      dispatch(addQuoteRescratch({ body, rescratchedId: scratchId }));
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

  return (
    <div>
      <hr />
      <hr />
      Quote rescratch form
      <button onClick={handleCloseModal}>X</button>
      <textarea
        name="body"
        id="body"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        disabled={isSubmitting}
      />
      <EmbeddedRescratch
        rescratchedId={scratchId}
        selector={selectModalScratchById}
      />
      {!isSubmitting && (
        <div>
          <button onClick={handleSubmit}>Scratch</button>
        </div>
      )}
      <hr />
      <hr />
    </div>
  );
};

export default RescratchModal;
