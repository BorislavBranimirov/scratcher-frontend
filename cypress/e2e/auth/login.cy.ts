/// <reference types="cypress" />

import { tokenWithInvalidSignature } from '../../fixtures/data';

describe('/login', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      if (
        req.body.username === 'testUser1' &&
        req.body.password === 'F8hTOnzbXRv'
      ) {
        req.reply({
          body: {
            accessToken: tokenWithInvalidSignature,
          },
        });
      } else {
        req.reply({
          body: { err: 'Wrong username or password' },
          statusCode: 400,
        });
      }
    }).as('login');

    cy.visit('/login');
  });

  it('fails to logs in and stays on the same page', () => {
    cy.get('#username').type('wrongUser');
    cy.get('#password').type('wrongPassword0');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/login');
    cy.contains('#notification', 'Wrong username or password').should(
      'be.visible'
    );
  });

  it('successfully logs in', () => {
    cy.get('#username').type('testUser1');
    cy.get('#password').type('F8hTOnzbXRv');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/home');
  });
});
