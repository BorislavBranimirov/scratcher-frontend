/// <reference types="cypress" />

import { loggedUser, timelineScratches } from '../../fixtures/data';

describe('create scratch', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '/api/users/timeline', {
      body: {
        scratches: timelineScratches,
        isFinished: true,
        extraScratches: {},
      },
    }).as('homeTimeline');

    cy.intercept('GET', `/api/users/${loggedUser.id}/timeline`, {
      body: {
        scratches: timelineScratches,
        isFinished: true,
        extraScratches: {},
      },
    }).as('userTimeline');

    timelineScratches.forEach((timelineScratch) => {
      cy.intercept('GET', '/api/scratches/' + timelineScratch.id, {
        body: {
          scratch: timelineScratch,
          extraScratches: {},
        },
      });
    });
  });

  context('default scratch', () => {
    const newScratch = {
      id: 9999,
      authorId: loggedUser.id,
      parentId: null,
      rescratchedId: null,
      body: 'testing creating scratches',
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
    };

    beforeEach(() => {
      cy.intercept('POST', '/api/scratches', {
        body: {
          success: true,
          id: newScratch.id,
          authorId: newScratch.authorId,
        },
      }).as('postScratch');

      cy.intercept('GET', '/api/scratches/' + newScratch.id, {
        body: {
          scratch: newScratch,
          extraScratches: {},
        },
      }).as('getNewScratch');
    });

    context('home page', () => {
      beforeEach(() => {
        cy.visit('/home');
      });

      it('submits scratch from home page and appends it to home timeline', () => {
        cy.get('[data-cy="home-post-scratch"] #body').type(newScratch.body);
        cy.contains('[data-cy="home-post-scratch"] button', 'Scratch').click();
        cy.contains(
          `[data-cy="scratch-post-${newScratch.id}"]`,
          newScratch.body
        ).should('be.visible');
      });

      it('submits scratch from post modal and appends it to home timeline', () => {
        cy.get('[data-cy="sidebar-scratch-btn"]').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(newScratch.body);
        cy.contains('[data-cy="modal-post-scratch"] button', 'Scratch').click();
        cy.contains(
          `[data-cy="scratch-post-${newScratch.id}"]`,
          newScratch.body
        ).should('be.visible');
      });
    });

    context('user page', () => {
      beforeEach(() => {
        cy.visit('/user/' + loggedUser.username);
      });

      it('submits scratch from post modal and appends it to user timeline', () => {
        cy.get('[data-cy="sidebar-scratch-btn"]').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(newScratch.body);
        cy.contains('[data-cy="modal-post-scratch"] button', 'Scratch').click();
        cy.contains(
          `[data-cy="scratch-post-${newScratch.id}"]`,
          newScratch.body
        ).should('be.visible');
      });
    });
  });

  context('reply scratch', () => {
    const newReplyScratch = {
      id: 9999,
      authorId: loggedUser.id,
      parentId: 2,
      rescratchedId: null,
      body: 'testing creating reply scratches',
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
    };

    beforeEach(() => {
      cy.intercept('POST', '/api/scratches', {
        body: {
          success: true,
          id: newReplyScratch.id,
          authorId: newReplyScratch.authorId,
        },
      }).as('postScratch');

      cy.intercept('GET', '/api/scratches/' + newReplyScratch.id, {
        body: {
          scratch: newReplyScratch,
          extraScratches: {},
        },
      }).as('getNewReplyScratch');
    });

    context('home page', () => {
      beforeEach(() => {
        cy.visit('/home');

        cy.get(
          `[data-cy="scratch-post-${newReplyScratch.parentId}"] [data-cy="scratch-reply-btn"]`
        ).as('parentScratchReplyBtn');
      });

      it('submits reply scratch from reply modal and appends it to home timeline', () => {
        cy.get('@parentScratchReplyBtn').contains('0');

        cy.get('@parentScratchReplyBtn').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(
          newReplyScratch.body
        );
        cy.contains('[data-cy="modal-post-scratch"] button', 'Reply').click();
        cy.contains(
          `[data-cy="scratch-post-${newReplyScratch.id}"]`,
          newReplyScratch.body
        ).should('be.visible');

        cy.get('@parentScratchReplyBtn').contains('1');
      });
    });

    context('user page', () => {
      beforeEach(() => {
        cy.visit('/user/' + loggedUser.username);

        cy.get(
          `[data-cy="scratch-post-${newReplyScratch.parentId}"] [data-cy="scratch-reply-btn"]`
        ).as('parentScratchReplyBtn');
      });

      it('submits reply scratch from reply modal and appends it to user timeline', () => {
        cy.get('@parentScratchReplyBtn').contains('0');

        cy.get('@parentScratchReplyBtn').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(
          newReplyScratch.body
        );
        cy.contains('[data-cy="modal-post-scratch"] button', 'Reply').click();
        cy.contains(
          `[data-cy="scratch-post-${newReplyScratch.id}"]`,
          newReplyScratch.body
        ).should('be.visible');

        cy.get('@parentScratchReplyBtn').contains('1');
      });
    });

    context('scratch page', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api/scratches/${timelineScratches[0].id}/conversation`,
          {
            body: {
              parentChain: [timelineScratches[1]],
              scratch: timelineScratches[0],
              replies: [],
              extraScratches: {},
            },
          }
        );

        cy.visit(
          `/user/${loggedUser.username}/scratch/${timelineScratches[0].id}`
        );
      });

      it('submits reply scratch from scratch page and appends it to replies', () => {
        cy.get('[data-cy="scratch-page-post-scratch"] #body').type(
          newReplyScratch.body
        );
        cy.contains(
          '[data-cy="scratch-page-post-scratch"] button',
          'Reply'
        ).click();
        cy.contains(
          `[data-cy="scratch-post-${newReplyScratch.id}"]`,
          newReplyScratch.body
        ).should('be.visible');
      });

      it('submits reply scratch from reply modal and appends it to replies', () => {
        cy.get(
          `[data-cy="scratch-post-${newReplyScratch.parentId}"] [data-cy="scratch-reply-btn"]`
        ).as('parentScratchReplyBtn');

        cy.get('@parentScratchReplyBtn').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(
          newReplyScratch.body
        );
        cy.contains('[data-cy="modal-post-scratch"] button', 'Reply').click();
        cy.contains(
          `[data-cy="scratch-post-${newReplyScratch.id}"]`,
          newReplyScratch.body
        ).should('be.visible');
      });
    });
  });

  context('direct rescratch', () => {
    const newDirectRescratch = {
      id: 9999,
      authorId: loggedUser.id,
      parentId: null,
      rescratchedId: 2,
      body: null,
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
      rescratchType: 'direct',
    };

    beforeEach(() => {
      cy.intercept('POST', '/api/scratches', {
        body: {
          success: true,
          id: newDirectRescratch.id,
          authorId: newDirectRescratch.authorId,
        },
      }).as('postScratch');

      const rescratchedPost = {
        ...timelineScratches[0],
        author: { ...timelineScratches[0].author },
      };
      rescratchedPost.rescratchCount++;
      rescratchedPost.isRescratched = true;

      cy.intercept('GET', '/api/scratches/' + newDirectRescratch.id, {
        body: {
          scratch: newDirectRescratch,
          extraScratches: {
            [rescratchedPost.id]: rescratchedPost,
          },
        },
      }).as('getNewDirectRescratch');
    });

    context('home page', () => {
      beforeEach(() => {
        cy.visit('/home');

        cy.get(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"] [data-cy="scratch-rescratch-menu-btn"]`
        ).as('rescratchMenuBtn');

        cy.get(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"] [data-cy="scratch-direct-rescratch-btn"]`
        ).as('directRescratchBtn');
      });

      it('direct rescratches post and appends it to home timeline', () => {
        cy.get('@rescratchMenuBtn').click();
        cy.get('@directRescratchBtn').click();
        cy.contains(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"]`,
          `${loggedUser.name} Rescratched`
        ).should('be.visible');
      });
    });

    context('user page', () => {
      beforeEach(() => {
        cy.visit('/user/' + loggedUser.username);

        cy.get(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"] [data-cy="scratch-rescratch-menu-btn"]`
        ).as('rescratchMenuBtn');

        cy.get(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"] [data-cy="scratch-direct-rescratch-btn"]`
        ).as('directRescratchBtn');
      });

      it('direct rescratches post and appends it to user timeline', () => {
        cy.get('@rescratchMenuBtn').click();
        cy.get('@directRescratchBtn').click();
        cy.contains(
          `[data-cy="scratch-post-${newDirectRescratch.rescratchedId}"]`,
          `${loggedUser.name} Rescratched`
        ).should('be.visible');
      });
    });
  });

  context('quote rescratch', () => {
    const newQuoteRescratch = {
      id: 9999,
      authorId: loggedUser.id,
      parentId: null,
      rescratchedId: 2,
      body: 'testing creating quote rescratches',
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
      rescratchType: 'quote',
    };

    beforeEach(() => {
      cy.intercept('POST', '/api/scratches', {
        body: {
          success: true,
          id: newQuoteRescratch.id,
          authorId: newQuoteRescratch.authorId,
        },
      }).as('postScratch');

      const rescratchedPost = {
        ...timelineScratches[0],
        author: { ...timelineScratches[0].author },
      };
      rescratchedPost.rescratchCount++;

      cy.intercept('GET', '/api/scratches/' + newQuoteRescratch.id, {
        body: {
          scratch: newQuoteRescratch,
          extraScratches: {
            [rescratchedPost.id]: rescratchedPost,
          },
        },
      }).as('getNewQuoteRescratch');
    });

    context('home page', () => {
      beforeEach(() => {
        cy.visit('/home');

        cy.get(
          `[data-cy="scratch-post-${newQuoteRescratch.rescratchedId}"] [data-cy="scratch-rescratch-menu-btn"]`
        ).as('rescratchMenuBtn');

        cy.get(
          `[data-cy="scratch-post-${newQuoteRescratch.rescratchedId}"] [data-cy="scratch-quote-rescratch-btn"]`
        ).as('quoteRescratchBtn');
      });

      it('submits quote rescratch from rescratch modal and appends it to home timeline', () => {
        cy.get('@rescratchMenuBtn').click();
        cy.get('@quoteRescratchBtn').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(
          newQuoteRescratch.body
        );
        cy.contains('[data-cy="modal-post-scratch"] button', 'Scratch').click();
        cy.contains(
          `[data-cy="scratch-post-${newQuoteRescratch.id}"]`,
          newQuoteRescratch.body
        ).should('be.visible');
      });
    });

    context('user page', () => {
      beforeEach(() => {
        cy.visit('/user/' + loggedUser.username);

        cy.get(
          `[data-cy="scratch-post-${newQuoteRescratch.rescratchedId}"] [data-cy="scratch-rescratch-menu-btn"]`
        ).as('rescratchMenuBtn');

        cy.get(
          `[data-cy="scratch-post-${newQuoteRescratch.rescratchedId}"] [data-cy="scratch-quote-rescratch-btn"]`
        ).as('quoteRescratchBtn');
      });

      it('submits quote rescratch from rescratch modal and appends it to user timeline', () => {
        cy.get('@rescratchMenuBtn').click();
        cy.get('@quoteRescratchBtn').click();
        cy.get('[data-cy="modal-post-scratch"] #body').type(
          newQuoteRescratch.body
        );
        cy.contains('[data-cy="modal-post-scratch"] button', 'Scratch').click();
        cy.contains(
          `[data-cy="scratch-post-${newQuoteRescratch.id}"]`,
          newQuoteRescratch.body
        ).should('be.visible');
      });
    });
  });
});
