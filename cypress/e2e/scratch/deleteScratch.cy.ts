/// <reference types="cypress" />

import { loggedUser, timelineScratches } from '../../fixtures/data';

describe('delete scratch', () => {
  const scratchId = timelineScratches[0].id;

  const pressDelete = (id: number) => {
    cy.get(
      `[data-cy="scratch-post-${id}"] [data-cy="scratch-more-menu-btn"]`
    ).click();

    cy.get(
      `[data-cy="scratch-post-${id}"] [data-cy="scratch-delete-btn"]`
    ).click();

    cy.contains('[data-cy="confirm-prompt"] button', 'Delete').click();
  };

  beforeEach(() => {
    cy.login();

    cy.intercept('DELETE', `/api/scratches/${scratchId}`, {
      body: {
        success: true,
        userId: loggedUser.id,
        scratchId: scratchId,
      },
    }).as('deleteScratch');
  });

  context('home timeline', () => {
    it('deletes scratch and removes it from home timeline', () => {
      cy.intercept('GET', '/api/users/timeline', {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('homeTimeline');

      cy.visit('/home');
      pressDelete(scratchId);
      cy.get(`[data-cy="scratch-post-${scratchId}"]`).should('not.exist');
    });

    it('undoes direct rescratch and removes it from home timeline', () => {
      const timelineScratches = [
        {
          id: 2,
          authorId: loggedUser.id,
          parentId: null,
          rescratchedId: 1,
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
        },
        {
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
          likeCount: 0,
          isRescratched: true,
          isLiked: false,
          isBookmarked: false,
          rescratchType: 'none',
        },
      ];

      const timelineScratchesToDelete = timelineScratches[1];

      cy.intercept('GET', '/api/users/timeline', {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {
            [timelineScratchesToDelete.id]: timelineScratchesToDelete,
          },
        },
      }).as('homeTimelineWithDirectRescratch');

      cy.intercept(
        'DELETE',
        `/api/scratches/${timelineScratchesToDelete.id}/direct-rescratch`,
        {
          body: {
            success: true,
            id: timelineScratches[0].id,
            authorId: loggedUser.id,
          },
        }
      ).as('undoDirectRescratch');

      const pressUndoRescratch = () => {
        cy.contains(
          `[data-cy="scratch-post-${timelineScratchesToDelete.id}"]`,
          `${loggedUser.name} Rescratched`
        )
          .find('[data-cy="scratch-rescratch-menu-btn"]')
          .click();

        cy.contains(
          `[data-cy="scratch-post-${timelineScratchesToDelete.id}"]`,
          `${loggedUser.name} Rescratched`
        )
          .find('[data-cy="scratch-direct-rescratch-btn"]')
          .click();
      };

      cy.visit('/home');
      pressUndoRescratch();
      cy.contains(
        `[data-cy="scratch-post-${timelineScratchesToDelete.id}"]`,
        `${loggedUser.name} Rescratched`
      ).should('not.exist');
    });
  });

  context('scratch page', () => {
    const scratchPageScratches = [
      {
        id: 3,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: 'child reply',
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
      },
      {
        id: 2,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: 'child',
        mediaUrl: null,
        createdAt: '2021-06-30T23:32:05.395Z',
        author: {
          id: loggedUser.id,
          name: loggedUser.name,
          username: loggedUser.username,
          profileImageUrl: loggedUser.profileImageUrl,
        },
        replyCount: 1,
        rescratchCount: 0,
        likeCount: 0,
        isRescratched: false,
        isLiked: false,
        isBookmarked: false,
        rescratchType: 'none',
      },
      {
        id: 1,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: 'parent',
        mediaUrl: null,
        createdAt: '2021-06-30T23:32:05.395Z',
        author: {
          id: loggedUser.id,
          name: loggedUser.name,
          username: loggedUser.username,
          profileImageUrl: loggedUser.profileImageUrl,
        },
        replyCount: 1,
        rescratchCount: 0,
        likeCount: 0,
        isRescratched: false,
        isLiked: false,
        isBookmarked: false,
        rescratchType: 'none',
      },
    ];

    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api/scratches/${scratchPageScratches[0].id}/conversation`,
        {
          body: {
            parentChain: [scratchPageScratches[2], scratchPageScratches[1]],
            scratch: scratchPageScratches[0],
            replies: [],
            extraScratches: {},
          },
        }
      );
      cy.intercept(
        'GET',
        `/api/scratches/${scratchPageScratches[1].id}/conversation`,
        {
          body: {
            parentChain: [scratchPageScratches[2]],
            scratch: scratchPageScratches[1],
            replies: [scratchPageScratches[0]],
            extraScratches: {},
          },
        }
      );
      cy.intercept(
        'GET',
        `/api/scratches/${scratchPageScratches[2].id}/conversation`,
        {
          body: {
            parentChain: [],
            scratch: scratchPageScratches[2],
            replies: [scratchPageScratches[1]],
            extraScratches: {},
          },
        }
      );

      scratchPageScratches.forEach((scratchPageScratch) => {
        cy.intercept('DELETE', `/api/scratches/${scratchPageScratch.id}`, {
          body: {
            success: true,
            userId: loggedUser.id,
            scratchId: scratchPageScratch.id,
          },
        });
      });

      cy.intercept('GET', '/api/users/timeline', {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('homeTimeline');
    });

    it('deletes reply scratch and removes it from replies', () => {
      cy.visit(
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[1].id}`
      );
      pressDelete(scratchPageScratches[0].id);
      cy.get(`[data-cy="scratch-post-${scratchPageScratches[0].id}"]`).should(
        'not.exist'
      );
    });

    it('deletes main scratch and redirects to its parent scratch', () => {
      cy.intercept(
        'GET',
        `/api/scratches/${scratchPageScratches[2].id}/conversation`,
        {
          body: {
            parentChain: [],
            scratch: scratchPageScratches[2],
            replies: [],
            extraScratches: {},
          },
        }
      );

      cy.visit(
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[1].id}`
      );
      pressDelete(scratchPageScratches[1].id);
      cy.location('pathname').should(
        'eq',
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[2].id}`
      );
    });

    it('deletes main scratch and redirects to home page if no parent', () => {
      cy.visit(
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[2].id}`
      );
      pressDelete(scratchPageScratches[2].id);
      cy.location('pathname').should('eq', `/home`);
    });

    it('deletes parent scratch and redirects to its parent scratch', () => {
      cy.visit(
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[0].id}`
      );
      pressDelete(scratchPageScratches[1].id);
      cy.location('pathname').should(
        'eq',
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[2].id}`
      );
    });

    it('deletes parent scratch and redirects to home page if no parent', () => {
      cy.visit(
        `/user/${loggedUser.username}/scratch/${scratchPageScratches[1].id}`
      );
      pressDelete(scratchPageScratches[2].id);
      cy.location('pathname').should('eq', `/home`);
    });
  });

  context('search page', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/scratches/search*', {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('scratchesSearch');

      cy.visit('/search/scratches');
    });

    it('deletes scratch and removes it from search page', () => {
      pressDelete(scratchId);
      cy.get(`[data-cy="scratch-post-${scratchId}"]`).should('not.exist');
    });
  });

  context('bookmarks page', () => {
    const bookmarkedScratches = [
      {
        id: 2,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: 'bookmark 2',
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
        isBookmarked: true,
        rescratchType: 'none',
      },
      {
        id: 1,
        authorId: loggedUser.id,
        parentId: null,
        rescratchedId: null,
        body: 'bookmark 1',
        mediaUrl: null,
        createdAt: '2021-06-30T23:32:05.395Z',
        author: {
          id: loggedUser.id,
          name: loggedUser.name,
          username: loggedUser.username,
          profileImageUrl: loggedUser.profileImageUrl,
        },
        replyCount: 1,
        rescratchCount: 0,
        likeCount: 0,
        isRescratched: false,
        isLiked: false,
        isBookmarked: true,
        rescratchType: 'none',
      },
    ];

    const bookmarkIdToDelete = bookmarkedScratches[0].id;

    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/bookmarks`, {
        body: {
          scratches: bookmarkedScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('bookmarks');

      cy.intercept('DELETE', `/api/scratches/${bookmarkIdToDelete}`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: bookmarkIdToDelete,
        },
      });

      cy.visit('/bookmarks');
    });

    it('deletes scratch and removes it from bookmarks page', () => {
      pressDelete(bookmarkIdToDelete);
      cy.get(`[data-cy="scratch-post-${bookmarkIdToDelete}"]`).should(
        'not.exist'
      );
    });

    it('unbookmarks scratch and removes it from bookmarks page', () => {
      cy.intercept('DELETE', `/api/scratches/${bookmarkIdToDelete}/bookmark`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: bookmarkIdToDelete,
        },
      }).as('unbookmarkScratch');

      const pressUnbookmark = () => {
        cy.get(
          `[data-cy="scratch-post-${bookmarkIdToDelete}"] [data-cy="scratch-share-menu-btn"]`
        ).click();

        cy.get(
          `[data-cy="scratch-post-${bookmarkIdToDelete}"] [data-cy="scratch-bookmark-btn"]`
        ).click();
      };

      pressUnbookmark();
      cy.get(`[data-cy="scratch-post-${bookmarkIdToDelete}"]`).should(
        'not.exist'
      );
    });
  });
});
