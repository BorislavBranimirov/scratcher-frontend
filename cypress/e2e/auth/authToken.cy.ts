/// <reference types="cypress" />

import { tokenWithInvalidSignature } from '../../fixtures/data';

const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0VXNlcjEiLCJpYXQiOjAsImV4cCI6MH0.Ngo6LfH7GahidqeA47exxmyuHcm8-jZf9MLGBR2zAj8';

describe('auth token', () => {
  context('successfully refresh token', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/refresh-token', (req) => {
        req.reply({
          body: {
            accessToken: tokenWithInvalidSignature,
          },
        });
      }).as('refreshTokenSuccess');
    });

    it('should refresh expired token', () => {
      localStorage.setItem('accessToken', expiredToken);
      cy.visit('/home');
      cy.wait('@refreshTokenSuccess');
      cy.window()
        .its('localStorage')
        .invoke('getItem', 'accessToken')
        .should('not.eq', expiredToken);
      cy.location('pathname').should('not.eq', '/login');
    });
  });

  context('fail to refresh token', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/refresh-token', (req) => {
        req.reply({
          body: { err: 'Unauthorized' },
          statusCode: 401,
        });
      }).as('refreshTokenFail');
    });

    it('should log out when token cannot be refreshed', () => {
      localStorage.setItem('accessToken', expiredToken);
      cy.visit('/home');
      cy.wait('@refreshTokenFail');
      cy.window()
        .its('localStorage')
        .invoke('getItem', 'accessToken')
        .should('be.null');
      cy.location('pathname').should('eq', '/login');
    });
  });
});
