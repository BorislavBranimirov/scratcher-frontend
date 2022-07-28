/// <reference types="cypress" />

import { loggedUser, timelineScratches } from '../../fixtures/data';

describe('scratch actions', () => {
  const scratchId = timelineScratches[0].id;

  beforeEach(() => {
    cy.login();
  });

  context('pin scratch', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api/users/${loggedUser.id}/timeline`, {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('userTimeline');

      cy.intercept('POST', `/api/scratches/${scratchId}/pin`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: scratchId,
        },
      }).as('pinScratch');

      cy.intercept('POST', `/api/scratches/${scratchId}/unpin`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: scratchId,
        },
      }).as('unpinScratch');

      cy.visit('/user/' + loggedUser.username);

      cy.get(
        `[data-cy="scratch-post-${scratchId}"] [data-cy="scratch-more-menu-btn"]`
      ).as('scratchMoreMenuBtn');

      cy.get(
        `[data-cy="scratch-post-${scratchId}"] [data-cy="scratch-pin-btn"]`
      ).as('scratchPinBtn');
    });

    it('adds and removes pinned scratch', () => {
      cy.get('@scratchMoreMenuBtn').click();
      cy.get('@scratchPinBtn').click();
      cy.contains(
        `[data-cy="scratch-post-${scratchId}"]`,
        'Pinned Scratch'
      ).should('be.visible');

      cy.contains(`[data-cy="scratch-post-${scratchId}"]`, 'Pinned Scratch')
        .find('[data-cy="scratch-more-menu-btn"]')
        .click();
      cy.contains(`[data-cy="scratch-post-${scratchId}"]`, 'Pinned Scratch')
        .find('[data-cy="scratch-pin-btn"]')
        .click();
      cy.contains(
        `[data-cy="scratch-post-${scratchId}"]`,
        'Pinned Scratch'
      ).should('not.exist');
    });
  });

  context('like scratch', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/users/timeline', {
        body: {
          scratches: timelineScratches,
          isFinished: true,
          extraScratches: {},
        },
      }).as('homeTimeline');

      cy.intercept('POST', `/api/scratches/${scratchId}/likes`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: scratchId,
        },
      }).as('likeScratch');

      cy.intercept('DELETE', `/api/scratches/${scratchId}/likes`, {
        body: {
          success: true,
          userId: loggedUser.id,
          scratchId: scratchId,
        },
      }).as('unlikeScratch');

      cy.visit('/home');

      cy.get(
        `[data-cy="scratch-post-${scratchId}"] [data-cy="scratch-like-btn"]`
      ).as('scratchLikeBtn');
    });

    it('increments and decrements like counter', () => {
      cy.get('@scratchLikeBtn').contains('0');

      cy.get('@scratchLikeBtn').click();

      cy.get('@scratchLikeBtn').contains('1');

      cy.get('@scratchLikeBtn').click();

      cy.get('@scratchLikeBtn').contains('0');
    });
  });
});
