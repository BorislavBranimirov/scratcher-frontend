/// <reference types="cypress" />

import { loggedUser } from '../../fixtures/data';

describe('/settings/delete-account', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('DELETE', `/api/users/${loggedUser.id}`, {
      body: {
        success: 'true',
        id: loggedUser.id,
        username: loggedUser.username,
      },
    }).as('deleteAccount');

    cy.visit('/settings/delete-account');
  });

  it('logs out on account deletion', () => {
    cy.get('[data-cy="delete-account-btn"]').click();
    cy.location('pathname').should('eq', '/login');
  });
});
