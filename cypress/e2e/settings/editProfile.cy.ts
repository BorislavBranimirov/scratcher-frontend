/// <reference types="cypress" />

import { loggedUser } from '../../fixtures/data';

describe('/settings/edit-profile', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', `/api/users/${loggedUser.id}`, {
      body: {
        success: 'true',
        id: loggedUser.id,
        username: loggedUser.username,
      },
    }).as('patchUser');

    cy.visit('/settings/edit-profile');
  });

  it('should display validation errors', () => {
    cy.contains('button', 'Save').click();
    cy.location('pathname').should('eq', '/settings/edit-profile');
    cy.contains(
      '#notification',
      'Profile information is already up to date'
    ).should('be.visible');

    cy.get('#name').clear();
    cy.contains('button', 'Save').click();
    cy.location('pathname').should('eq', '/settings/edit-profile');
    cy.get('#name ~ [data-cy="form-error"]').should('be.visible');
  });

  it('redirects to user page on successful profile edit', () => {
    cy.get('#name').type('new');
    cy.contains('button', 'Save').click();
    cy.location('pathname').should('eq', `/user/${loggedUser.username}`);
  });
});
