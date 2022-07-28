/// <reference types="cypress" />

describe('/settings/theme-picker', () => {
  beforeEach(() => {
    cy.login();

    cy.visit('/settings/theme-picker');
  });

  it('theme picker changes accent theme', () => {
    // select a theme different from the first button initially
    // to prevent theme from already matching first button
    // and therefore not applying a change on clicking it
    cy.get('[data-cy="theme-accent-btn"]').eq(-1).click();

    cy.get('[data-cy="theme-accent-btn"]').each(($el) => {
      cy.wrap($el).click();

      const newColor = $el.css('background-color');
      cy.get('[data-cy="sidebar-scratch-btn"]').should(
        'have.css',
        'background-color',
        newColor
      );
    });

    cy.reload();

    // should keep new color after page refresh
    cy.get('[data-cy="theme-accent-btn"] > svg')
      .closest('[data-cy="theme-accent-btn"]')
      .then(($el) => {
        const newColor = $el.css('background-color');
        cy.get('[data-cy="sidebar-scratch-btn"]').should(
          'have.css',
          'background-color',
          newColor
        );
      });
  });

  it('theme picker changes background theme', () => {
    // select a theme different from the first button initially
    // to prevent theme from already matching first button
    // and therefore not applying a change on clicking it
    cy.get('[data-cy="theme-background-btn"]').eq(-1).click();

    cy.get('[data-cy="theme-background-btn"]').each(($el) => {
      cy.wrap($el).click();

      const newColor = $el.css('background-color');
      cy.get('#root > div').should('have.css', 'background-color', newColor);
    });

    cy.reload();

    // should keep new color after page refresh
    cy.get('.outline[data-cy="theme-background-btn"]').then(($el) => {
      const newColor = $el.css('background-color');
      cy.get('#root > div').should('have.css', 'background-color', newColor);
    });
  });
});
