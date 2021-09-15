import { useAppSelector } from '../../app/hooks';
import { selectModal } from './modalSlice';
import ReplyModal from './ReplyModal';
import RescratchModal from './RescratchModal';

const Modal = () => {
  const { show, type } = useAppSelector(selectModal);

  if (!show || !type) {
    return null;
  }

  return (
    <div>
      {type === 'reply' && <ReplyModal />}
      {type === 'rescratch' && <RescratchModal />}
    </div>
  );
};

export default Modal;
