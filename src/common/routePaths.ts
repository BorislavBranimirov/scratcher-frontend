import { generatePath } from 'react-router-dom';

export const scratchPath = `/user/:username/scratch/:id`;

export const userPagePath = `/user/:username`;

export const userPagePathWithTab = `/user/:username/:tab`;

export type userPageTabValue = 'media' | 'likes' | 'followers' | 'following';

export const searchPagePath = `/search/:tab`;

export type searchPagePathValue = 'scratches' | 'users';

export type settingsPageTabValue =
  | 'theme-picker'
  | 'edit-profile'
  | 'change-password'
  | 'delete-account';

export const generateScratchPath = ({
  username,
  id,
}: {
  username: string;
  id: number;
}) => {
  return generatePath(scratchPath, { username, id: id.toString() });
};

export const generateUserPath = ({ username }: { username: string }) => {
  return generatePath(userPagePath, { username });
};

export const generateUserPathWithTab = ({
  username,
  tab,
}: {
  username: string;
  tab: userPageTabValue;
}) => {
  return generatePath(userPagePathWithTab, { username, tab });
};

export const generateSearchPath = ({ tab }: { tab: searchPagePathValue }) => {
  return generatePath(searchPagePath, { tab });
};
