import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  generateScratchPathWithTab,
  scratchPageTabValue,
} from '../../common/routePaths';
import { selectScratchById } from '../scratches/scratchesSlice';

const ScratchTabRedirect = ({ scratchId }: { scratchId: number }) => {
  const scratch = useAppSelector((state) =>
    selectScratchById(state, scratchId)
  );
  const { username, id, scratchTab } = useParams() as {
    username: string;
    id: string;
    scratchTab: scratchPageTabValue;
  };

  if (parseInt(id, 10) === scratch.id && username !== scratch.author.username) {
    // if the username URL parameter does not match the scratch author, redirect to the correct URL
    const correctScratchTabPath = generateScratchPathWithTab({
      username: scratch.author.username,
      id: scratchId,
      scratchTab: scratchTab,
    });

    return <Navigate to={correctScratchTabPath} replace />;
  } else {
    return null;
  }
};

export default ScratchTabRedirect;
