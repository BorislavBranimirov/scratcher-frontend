/// <reference types="cypress" />

import { loggedUser } from '../../fixtures/data';

describe('/settings/change-password', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('POST', `/api/users/${loggedUser.id}/change-password`, {
      body: {
        success: 'true',
        id: loggedUser.id,
        username: loggedUser.username,
      },
    }).as('changePassword');

    cy.visit('/settings/change-password');
  });

  it('should display validation errors', () => {
    cy.get('[name="current-password"]').type('F8hTOnzbXRv');
    cy.get('[name="password"]').type('F8hTOnzbXRv');
    cy.get('[name="confirm-password"]').type('F8hTOnzbXRv');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/settings/change-password');
    cy.get('[name="password"] ~ [data-cy="form-error"]').contains(
      'New password cannot be the same as your current one'
    );

    cy.get('[name="current-password"]').clear().type('F8hTOnzbXRv');
    cy.get('[name="password"]').clear().type('F8hTOnzbXRv0');
    cy.get('[name="confirm-password"]').clear().type('F8hTOnzbXRv1');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/settings/change-password');
    cy.get('[name="confirm-password"] ~ [data-cy="form-error"]').contains(
      'Passwords do not match'
    );
  });

  it('logs out on password change', () => {
    cy.get('[name="current-password"]').type('F8hTOnzbXRv');
    cy.get('[name="password"]').type('F8hTOnzbXRv0');
    cy.get('[name="confirm-password"]').type('F8hTOnzbXRv0');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/login');
  });
});
