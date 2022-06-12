import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateUserPath } from '../../common/routePaths';
import useSyncTextareaHeight from '../../common/useSyncTextareaHeight';
import { selectAuthUser } from '../auth/authSlice';
import { addScratch, selectScratchById } from './scratchPageSlice';
import avatar from '../../images/avatarplaceholder.png';

const ScratchSubmit = ({ parentScratchId }: { parentScratchId: number }) => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);
  const parentScratch = useAppSelector((state) =>
    selectScratchById(state, parentScratchId)
  );

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputFieldRef = useSyncTextareaHeight(body);

  if (!loggedUser) {
    return null;
  }

  const parentUserPath = generateUserPath({
    username: parentScratch.author.username,
  });
  const userPath = generateUserPath({ username: loggedUser.username });

  const handleSubmit = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const res = await dispatch(addScratch({ body, parentId: parentScratchId }));
      if (addScratch.fulfilled.match(res)) {
        setBody('');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-primary">
      <div className="ml-12 pl-3 flex gap-1 text-sm text-secondary">
        <span>Replying to</span>
        <Link className="text-blue hover:underline" to={parentUserPath}>
          @{parentScratch.author.username}
        </Link>
      </div>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden mt-1 shrink-0">
          <Link to={userPath}>
            <img src={loggedUser.profileImageUrl || avatar} alt="avatar" />
          </Link>
        </div>
        <div className="min-w-0 grow">
          <textarea
            className="my-2 w-full resize-none bg-transparent border-none outline-none"
            name="body"
            id="body"
            ref={inputFieldRef}
            placeholder="Scratch your reply"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
            disabled={isSubmitting}
          />
          {!isSubmitting && (
            <div className="border-t border-primary pt-3 flex justify-end">
              <button
                className="bg-blue text-sm rounded-full py-1.5 px-4 font-bold transition-colors enabled:hover:bg-blue/80 enabled:active:bg-blue/60 disabled:opacity-75"
                onClick={handleSubmit}
                disabled={!body}
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScratchSubmit;
