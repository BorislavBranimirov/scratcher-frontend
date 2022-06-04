import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { generateScratchPath, generateUserPath } from './routePaths';
import TimeAgo from './TimeAgo';
import { Scratch } from './types';
import avatar from '../images/avatarplaceholder.png';

interface EmbeddedRescratchProps {
  rescratchedId: number;
  selector: (state: RootState, id: number) => Scratch;
}

const EmbeddedRescratch = ({
  rescratchedId,
  selector,
}: EmbeddedRescratchProps) => {
  const rescratch = useAppSelector((state) => selector(state, rescratchedId));
  const navigate = useNavigate();

  if (!rescratch) {
    return (
      <div className="mt-2 mb-0.5 border border-primary rounded-xl py-2 px-2.5 cursor-pointer text-secondary text-sm transition-colors duration-200 hover:bg-primary/5">
        Scratch not found
      </div>
    );
  }

  const rescratchedUserPath = generateUserPath({
    username: rescratch.author.username,
  });
  const rescratchedScratchPath = generateScratchPath({
    username: rescratch.author.username,
    id: rescratch.id,
  });

  return (
    <div
      className="mt-2 mb-0.5 border border-primary rounded-xl pt-1 pb-2 px-2.5 cursor-pointer transition-colors duration-200 hover:bg-primary/5"
      onClick={(e) => {
        e.stopPropagation();
        const target = e.target as Element;
        if (!target.closest('a')) navigate(rescratchedScratchPath);
      }}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full overflow-hidden mt-1 flex-shrink-0">
          <Link to={rescratchedUserPath}>
            <img
              src={rescratch.author.profileImageUrl || avatar}
              alt="avatar"
            />
          </Link>
        </div>
        <div className="text-secondary flex items-baseline">
          <Link className="truncate" to={rescratchedUserPath}>
            <span className="font-bold text-primary hover:underline">
              {rescratch.author.name}
            </span>
            <span className="text-sm ml-1">@{rescratch.author.username}</span>
          </Link>
          <span className="text-sm px-1">·</span>
          <TimeAgo createdAt={rescratch.createdAt} />
        </div>
      </div>
      <p className="break-words">{rescratch.body}</p>
    </div>
  );
};

export default EmbeddedRescratch;
