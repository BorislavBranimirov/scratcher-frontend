import { generatePath } from 'react-router-dom';

export const scratchPath = `/user/:username/scratch/:id`;

export const userPagePath = `/user/:username/:tab?`;

export const generateScratchPath = ({
  username,
  id,
}: {
  username: string;
  id: number;
}) => {
  return generatePath(scratchPath, { username, id });
};

export const generateUserPath = ({
  username,
  tab,
}: {
  username: string;
  tab?: 'likes';
}) => {
  return generatePath(userPagePath, { username, tab });
};
