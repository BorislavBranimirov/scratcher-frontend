import { useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addScratch } from '../../features/timeline/timelineSlice';
import { selectAuthUser } from '../auth/authSlice';
import avatar from '../../images/avatarplaceholder.png';
import { Link } from 'react-router-dom';
import { generateUserPath } from '../../common/routePaths';

const HomeScratchSubmit = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector(selectAuthUser);

  const inputFieldRef = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    if (inputFieldRef.current) {
      inputFieldRef.current.style.height = '0';
      inputFieldRef.current.style.height =
        inputFieldRef.current.scrollHeight + 'px';
    }
  });

  if (!loggedUser) {
    return <div>User not found</div>;
  }

  const userPath = generateUserPath({ username: loggedUser.username });

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
    <div className="flex flex-row gap-3 px-4 py-3 border-b border-primary">
      <div className="w-12 h-12 rounded-full overflow-hidden mt-1 flex-shrink-0">
        <Link to={userPath}>
          <img src={loggedUser.profileImageUrl || avatar} alt="avatar" />
        </Link>
      </div>
      <div className="min-w-0 flex-grow">
        <textarea
          className="my-2 w-full resize-none bg-transparent border-none outline-none"
          name="body"
          id="body"
          ref={inputFieldRef}
          placeholder="What's happening?"
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
              Scratch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScratchSubmit;
