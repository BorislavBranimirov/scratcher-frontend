import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { generateScratchPath, generateUserPath } from './routePaths';
import TimeAgo from './TimeAgo';
import avatar from '../images/avatarplaceholder.png';
import { selectScratchById } from '../features/scratches/scratchesSlice';
import useUserPreviewEvents from '../features/userPreview/useUserPreviewEvents';
import { ScratchImageAttachment } from '../features/scratches/PostComponents';

const EmbeddedRescratch = ({ rescratchedId }: { rescratchedId: number }) => {
  const rescratch = useAppSelector((state) =>
    selectScratchById(state, rescratchedId)
  );
  const navigate = useNavigate();
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(rescratch.author.username);

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
        <div className="w-4 h-4 rounded-full overflow-hidden mt-1 shrink-0">
          <Link
            to={rescratchedUserPath}
            onMouseEnter={userPreviewOnMouseEnter}
            onMouseLeave={userPreviewOnMouseLeave}
          >
            <img
              src={rescratch.author.profileImageUrl || avatar}
              alt="avatar"
            />
          </Link>
        </div>
        <div className="text-secondary flex items-baseline">
          <Link className="truncate" to={rescratchedUserPath}>
            <span
              className="font-bold text-primary hover:underline"
              onMouseEnter={userPreviewOnMouseEnter}
              onMouseLeave={userPreviewOnMouseLeave}
            >
              {rescratch.author.name}
            </span>
            <span
              className="text-sm ml-1"
              onMouseEnter={userPreviewOnMouseEnter}
              onMouseLeave={userPreviewOnMouseLeave}
            >
              @{rescratch.author.username}
            </span>
          </Link>
          <span className="text-sm px-1">·</span>
          <TimeAgo createdAt={rescratch.createdAt} />
        </div>
      </div>
      <p className="break-words whitespace-pre-wrap">{rescratch.body}</p>
      {rescratch.mediaUrl && (
        <ScratchImageAttachment url={rescratch.mediaUrl} cropImage />
      )}
    </div>
  );
};

export default EmbeddedRescratch;
