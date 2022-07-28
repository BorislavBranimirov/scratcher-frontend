/// <reference types="cypress" />

import { CyHttpMessages } from 'cypress/types/net-stubbing';
import { loggedUser } from '../../fixtures/data';
import { Scratch } from '../../support/types';

describe('scratches infinite scroll', () => {
  const createScratchArray = () => {
    const arr: Scratch[] = [];
    for (let i = 40; i > 0; i--) {
      arr.push({
        id: i,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: `scratch ${i}`,
        mediaUrl: null,
        createdAt: '2021-06-30T23:32:05.395Z',
        author: {
          id: loggedUser.id,
          name: loggedUser.name,
          username: loggedUser.username,
          profileImageUrl: loggedUser.profileImageUrl,
        },
        replyCount: 0,
        rescratchCount: 0,
        likeCount: 0,
        isRescratched: false,
        isLiked: false,
        isBookmarked: false,
        rescratchType: 'none',
      });
    }
    return arr;
  };
  const scratchesList = createScratchArray();
  const scratchesPerPage = 20;

  const scrollTimelineIntercept = (req: CyHttpMessages.IncomingHttpRequest) => {
    let startIndex = 0;
    if (typeof req.query['after'] === 'string') {
      const after = parseInt(req.query['after'], 10);
      if (after >= 1) {
        startIndex = scratchesList.length - after + 1;
      }
    }
    const endIndex = startIndex + scratchesPerPage;

    req.reply({
      body: {
        scratches: scratchesList.slice(startIndex, endIndex),
        isFinished: endIndex === scratchesList.length ? true : false,
        extraScratches: {},
      },
    });
  };

  const scrollAndCheckForScratches = (requestAlias: string) => {
    for (let i = 0; i < scratchesList.length / scratchesPerPage; i++) {
      cy.wait(requestAlias).then((interception) => {
        const body = interception.response!.body as {
          scratches: Scratch[];
          isFinished: boolean;
          extraScratches: { [key: string]: Scratch };
        };
        body.scratches.forEach((scratch) => {
          cy.get(`[data-cy="scratch-post-${scratch.id}"]`);
        });
      });
      cy.scrollTo('bottom');
    }
  };

  beforeEach(() => {
    cy.login();
  });

  context('home page', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/users/timeline*', (req) => {
        scrollTimelineIntercept(req);
      }).as('homeTimeline');

      cy.visit('/home');
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@homeTimeline');
    });
  });

  context('user page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/timeline*`, (req) => {
        scrollTimelineIntercept(req);
      }).as('userTimeline');

      cy.visit('/user/' + loggedUser.username);
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@userTimeline');
    });
  });

  context('user media page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/media*`, (req) => {
        scrollTimelineIntercept(req);
      }).as('userMediaTimeline');

      cy.visit('/user/' + loggedUser.username + '/media');
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@userMediaTimeline');
    });
  });

  context('user likes page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/likes*`, (req) => {
        scrollTimelineIntercept(req);
      }).as('userLikesTimeline');

      cy.visit('/user/' + loggedUser.username + '/likes');
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@userLikesTimeline');
    });
  });

  context('scratch search page', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/scratches/search*', (req) => {
        scrollTimelineIntercept(req);
      }).as('scratchesSearch');

      cy.visit('/search/scratches');
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@scratchesSearch');
    });
  });

  context('scratch bookmarks page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/bookmarks*`, (req) => {
        scrollTimelineIntercept(req);
      }).as('bookmarks');

      cy.visit('/bookmarks');
    });

    it('loads more scratches when scrolled to the bottom of the page', () => {
      scrollAndCheckForScratches('@bookmarks');
    });
  });
});
