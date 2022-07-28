/// <reference types="cypress" />

import { timelineScratches } from '../../fixtures/data';

describe('redirect on wrong scratch url', () => {
  const scratch = timelineScratches[0];
  const authorUsername = scratch.author.username;

  beforeEach(() => {
    cy.login();
  });

  context('scratch page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/scratches/${scratch.id}/conversation`, {
        body: {
          parentChain: [timelineScratches[1]],
          scratch: scratch,
          replies: [],
          extraScratches: {},
        },
      }).as('scratchConversation');
    });

    it('redirect if scratch page url has wrong author username', () => {
      cy.visit(`/user/${authorUsername + 'wrong'}/scratch/${scratch.id}`);
      cy.wait('@scratchConversation');

      cy.location('pathname').should(
        'eq',
        `/user/${authorUsername}/scratch/${scratch.id}`
      );
    });
  });

  context('scratch page tabs', () => {
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
        cy.intercept('GET', `/api/scratches/${scratch.id}/rescratches*`, {
          body: {
            users: [],
            isFinished: true,
          },
        }).as('rescratchedUsers');
      });

      it('redirect if url has wrong author username', () => {
        cy.visit(
          `/user/${authorUsername + 'wrong'}/scratch/${scratch.id}/rescratches`
        );
        cy.wait('@rescratchedUsers');

        cy.location('pathname').should(
          'eq',
          `/user/${authorUsername}/scratch/${scratch.id}/rescratches`
        );
        cy.wait('@rescratchedUsers');
      });
    });

    context('liked users page', () => {
      beforeEach(() => {
        cy.intercept('GET', `/api/scratches/${scratch.id}/likes*`, {
          body: {
            users: [],
            isFinished: true,
          },
        }).as('likedUsers');
      });

      it('redirect if url has wrong author username', () => {
        cy.visit(
          `/user/${authorUsername + 'wrong'}/scratch/${scratch.id}/likes`
        );
        cy.wait('@likedUsers');

        cy.location('pathname').should(
          'eq',
          `/user/${authorUsername}/scratch/${scratch.id}/likes`
        );
        cy.wait('@likedUsers');
      });
    });
  });
});
