import { generatePath } from 'react-router-dom';

export const scratchPath = `/user/:username/scratch/:id`;

export const scratchPathWithTab = `/user/:username/scratch/:id/:scratchTab`;

export type scratchPageTabValue = 'rescratches' | 'likes';

export const userPagePath = `/user/:username`;

export const userPagePathWithTab = `/user/:username/:userTab`;

export type userPageTabValue = 'media' | 'likes' | 'followers' | 'following';

export const searchPagePath = `/search/:searchTab`;

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

export const generateScratchPathWithTab = ({
  username,
  id,
  scratchTab,
}: {
  username: string;
  id: number;
  scratchTab: scratchPageTabValue;
}) => {
  return generatePath(scratchPathWithTab, {
    username,
    id: id.toString(),
    scratchTab,
  });
};

export const generateUserPath = ({ username }: { username: string }) => {
  return generatePath(userPagePath, { username });
};

export const generateUserPathWithTab = ({
  username,
  userTab,
}: {
  username: string;
  userTab: userPageTabValue;
}) => {
  return generatePath(userPagePathWithTab, { username, userTab });
};

export const generateSearchPath = ({
  searchTab,
}: {
  searchTab: searchPagePathValue;
}) => {
  return generatePath(searchPagePath, { searchTab });
};
