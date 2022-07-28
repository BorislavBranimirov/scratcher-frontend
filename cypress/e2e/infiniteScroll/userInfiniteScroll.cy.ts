/// <reference types="cypress" />

import { CyHttpMessages } from 'cypress/types/net-stubbing';
import { loggedUser } from '../../fixtures/data';
import { User } from '../../support/types';

describe('users infinite scroll', () => {
  const createUserArray = () => {
    const arr: User[] = [];
    for (let i = 40; i > 0; i--) {
      arr.push({
        id: i,
        name: `test user ${i}`,
        username: `${i}`,
        createdAt: '2021-06-30T23:32:05.384Z',
        description: `description ${i}`,
        pinnedId: null,
        profileImageUrl: null,
        profileBannerUrl: null,
        followerCount: 0,
        followedCount: 0,
        isFollowing: false,
      });
    }
    return arr;
  };
  const usersList = createUserArray();
  const usersPerPage = 20;

  const scrollUsersIntercept = (req: CyHttpMessages.IncomingHttpRequest) => {
    let startIndex = 0;
    if (typeof req.query['after'] === 'string') {
      const after = parseInt(req.query['after'], 10);
      if (after >= 1) {
        startIndex = usersList.length - after + 1;
      }
    }
    const endIndex = startIndex + usersPerPage;

    req.reply({
      body: {
        users: usersList.slice(startIndex, endIndex),
        isFinished: endIndex === usersList.length ? true : false,
      },
    });
  };

  const scrollAndCheckForUsers = (requestAlias: string) => {
    for (let i = 0; i < usersList.length / usersPerPage; i++) {
      cy.wait(requestAlias).then((interception) => {
        const body = interception.response!.body as {
          users: User[];
          isFinished: boolean;
        };
        body.users.forEach((user) => {
          cy.get(`[data-cy="user-item-${user.id}"]`);
        });
      });
      cy.scrollTo('bottom');
    }
  };

  beforeEach(() => {
    cy.login();
  });

  context('user followers page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/followers*`, (req) => {
        scrollUsersIntercept(req);
      }).as('userFollowers');

      cy.visit('/user/' + loggedUser.username + '/followers');
    });

    it('loads more users when scrolled to the bottom of the page', () => {
      scrollAndCheckForUsers('@userFollowers');
    });
  });

  context('user following page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/followed*`, (req) => {
        scrollUsersIntercept(req);
      }).as('usersFollowed');

      cy.visit('/user/' + loggedUser.username + '/following');
    });

    it('loads more users when scrolled to the bottom of the page', () => {
      scrollAndCheckForUsers('@usersFollowed');
    });
  });

  context('scratch tabs', () => {
    const scratch = {
      id: 1,
      authorId: loggedUser.id,
      parentId: null,
      rescratchedId: null,
      body: 'scratch',
      mediaUrl: null,
      createdAt: '2021-06-30T23:32:05.395Z',
      author: {
        id: loggedUser.id,
        name: loggedUser.name,
        username: loggedUser.username,
        profileImageUrl: loggedUser.profileImageUrl,
      },
      replyCount: 0,
      rescratchCount: 1,
      likeCount: 1,
      isRescratched: true,
      isLiked: true,
      isBookmarked: false,
      rescratchType: 'none',
    };

    beforeEach(() => {
      cy.intercept('GET', '/api/scratches/' + scratch.id, {
        body: {
          scratch: scratch,
          extraScratches: {},
        },
      });
    });

    context('rescratched users page', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api/scratches/${scratch.id}/rescratches*`,
          (req) => {
            scrollUsersIntercept(req);
          }
        ).as('rescratchedUsers');

        cy.visit(
          `/user/${loggedUser.username}/scratch/${scratch.id}/rescratches`
        );
      });

      it('loads more users when scrolled to the bottom of the page', () => {
        scrollAndCheckForUsers('@rescratchedUsers');
      });
    });

    context('liked users page', () => {
      beforeEach(() => {
        cy.intercept('GET', `/api/scratches/${scratch.id}/likes*`, (req) => {
          scrollUsersIntercept(req);
        }).as('likedUsers');

        cy.visit(`/user/${loggedUser.username}/scratch/${scratch.id}/likes`);
      });

      it('loads more users when scrolled to the bottom of the page', () => {
        scrollAndCheckForUsers('@likedUsers');
      });
    });
  });

  context('users search page', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/users/search*', (req) => {
        scrollUsersIntercept(req);
      }).as('usersSearch');

      cy.visit('/search/users');
    });

    it('loads more users when scrolled to the bottom of the page', () => {
      scrollAndCheckForUsers('@usersSearch');
    });
  });
});
