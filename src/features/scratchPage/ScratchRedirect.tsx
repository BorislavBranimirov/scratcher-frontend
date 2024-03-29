import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { generateScratchPath } from '../../common/routePaths';
import { selectScratchById } from '../scratches/scratchesSlice';

const ScratchRedirect = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const { username, id } = useParams() as { username: string; id: string };

  if (parseInt(id, 10) === scratch.id && username !== scratch.author.username) {
    // if the username URL parameter does not match the scratch author, redirect to the correct URL
    const correctScratchPath = generateScratchPath({
      username: scratch.author.username,
      id: scratchId,
    });

    return <Navigate to={correctScratchPath} replace />;
  } else {
    return null;
  }
};

export default ScratchRedirect;
