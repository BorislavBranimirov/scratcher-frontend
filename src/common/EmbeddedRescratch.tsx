import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { generateScratchPath, generateUserPath } from './routePaths';
import { Scratch } from './types';

interface EmbeddedRescratchProps {
  rescratchedId: number;
  selector: (state: RootState, id: number) => Scratch;
}

const EmbeddedRescratch = ({
  rescratchedId,
  selector,
}: EmbeddedRescratchProps) => {
  const rescratch = useAppSelector((state) => selector(state, rescratchedId));

  if (!rescratch) {
    return <div>Scratch not found</div>;
  }

  const rescratchedUserPath = generateUserPath({
    username: rescratch.author.username,
  });
  const rescratchedScratchPath = generateScratchPath({
    username: rescratch.author.username,
    id: rescratch.id,
  });

  return (
    <div>
      --- Rescratched Scratch:
      <p>
        <Link to={rescratchedUserPath}>{rescratch.author.name}</Link>@
        {rescratch.author.username}
        {rescratch.createdAt}
      </p>
      <p>{rescratch.body}</p>
      <Link to={rescratchedScratchPath}>Go to rescratch</Link>
      ---
    </div>
  );
};

export default EmbeddedRescratch;
