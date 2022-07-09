import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { generateScratchPath, generateUserPath } from './routePaths';
import TimeAgo from './TimeAgo';
import { selectScratchById } from '../features/scratches/scratchesSlice';
import useUserPreviewEvents from '../features/userPreview/useUserPreviewEvents';
import { ScratchImageAttachment } from '../features/scratches/PostComponents';
import { getProfileImageUrl } from './profileImageUrls';

const EmbeddedRescratch = ({ rescratchedId }: { rescratchedId: number }) => {
  const rescratch = useAppSelector((state) =>
    selectScratchById(state, rescratchedId)
  );
  const navigate = useNavigate();
  const [userPreviewOnMouseEnter, userPreviewOnMouseLeave] =
    useUserPreviewEvents(rescratch.author.username);

  const rescratchedUserPath = generateUserPath({
    username: rescratch.author.username,
  });
  const rescratchedScratchPath = generateScratchPath({
    username: rescratch.author.username,
    id: rescratch.id,
  });

  const profileImageUrl = getProfileImageUrl(rescratch.author.profileImageUrl);

  return (
    <div
      className="mt-2 mb-1 border border-primary rounded-xl pt-1 pb-2 px-2.5 cursor-pointer transition-colors duration-200 hover:bg-hover-1"
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
            <img src={profileImageUrl} alt="avatar" />
          </Link>
        </div>
        <div className="text-muted flex items-baseline min-w-0">
          <Link className="truncate" to={rescratchedUserPath}>
            <span
              className="font-bold text-main hover:underline"
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
          <div className="whitespace-nowrap">
            <TimeAgo createdAt={rescratch.createdAt} />
          </div>
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
