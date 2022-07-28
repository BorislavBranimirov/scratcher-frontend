/// <reference types="cypress" />

describe('/settings base page', () => {
  beforeEach(() => {
    cy.login();

    cy.visit('/settings');
  });

  it('all links work', () => {
    cy.get('a[href="/settings/theme-picker"]').click();
    cy.location('pathname').should('eq', '/settings/theme-picker');
    cy.get('[data-cy="header-back-btn"]').click();
    cy.location('pathname').should('eq', '/settings');

    cy.get('a[href="/settings/edit-profile"]').click();
    cy.location('pathname').should('eq', '/settings/edit-profile');
    cy.get('[data-cy="header-back-btn"]').click();
    cy.location('pathname').should('eq', '/settings');

    cy.get('a[href="/settings/change-password"]').click();
    cy.location('pathname').should('eq', '/settings/change-password');
    cy.get('[data-cy="header-back-btn"]').click();
    cy.location('pathname').should('eq', '/settings');

    cy.get('a[href="/settings/delete-account"]').click();
    cy.location('pathname').should('eq', '/settings/delete-account');
    cy.get('[data-cy="header-back-btn"]').click();
    cy.location('pathname').should('eq', '/settings');
  });
});
