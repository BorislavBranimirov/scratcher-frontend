/// <reference types="cypress" />

describe('sidebar', () => {
  context('desktop view', () => {
    beforeEach(() => {
      cy.login();

      cy.viewport(1280, 720);

      cy.visit('/home');
    });

    it('displays default sidebar', () => {
      cy.get('[data-cy="desktop-sidebar"]').should('be.visible');
      cy.get('[data-cy="mobile-sidebar-btn"]').should('not.be.visible');
      cy.get('[data-cy="mobile-sidebar"]').should('not.exist');
    });

    it('logs user out', () => {
      cy.get(
        '[data-cy="desktop-sidebar"] [data-cy="sidebar-more-menu-btn"]'
      ).click();
      cy.get(
        '[data-cy="desktop-sidebar"] [data-cy="sidebar-log-out-btn"]'
      ).click();

      cy.location('pathname')
        .should('eq', '/login')
        .and(() => {
          expect(
            localStorage.getItem('accessToken'),
            'should remove access token'
          ).to.be.null;
        });
    });
  });

  context('mobile view', () => {
    beforeEach(() => {
      cy.login();

      cy.viewport(320, 570);

      cy.visit('/home');
    });

    it('displays mobile sidebar', () => {
      cy.get('[data-cy="mobile-sidebar-btn"]').should('be.visible');
      cy.get('[data-cy="mobile-sidebar"]').should('not.exist');
      cy.get('[data-cy="desktop-sidebar"]').should('not.be.visible');

      cy.get('[data-cy="mobile-sidebar-btn"]').click();
      cy.get('[data-cy="mobile-sidebar-btn"]').should('not.exist');
      cy.get('[data-cy="mobile-sidebar"]').should('be.visible');
    });

    it('logs user out', () => {
      cy.get('[data-cy="mobile-sidebar-btn"]').click();
      cy.get(
        '[data-cy="mobile-sidebar"] [data-cy="sidebar-log-out-btn"]'
      ).click();

      cy.location('pathname')
        .should('eq', '/login')
        .and(() => {
          expect(
            localStorage.getItem('accessToken'),
            'should remove access token'
          ).to.be.null;
        });
    });
  });
});
