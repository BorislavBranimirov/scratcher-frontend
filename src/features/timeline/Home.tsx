import HomePosts from './HomePosts';
import HomeScratchSubmit from './HomeScratchSubmit';
import SuggestedUsersWindow from '../suggestedUsers/SuggestedUsersWindow';

const Home = () => {
  return (
    <div>
      <p>Latest Scratches</p>
      <p>Create new post</p>
      <HomeScratchSubmit />
      <SuggestedUsersWindow />
      <HomePosts />
    </div>
  );
};

export default Home;
