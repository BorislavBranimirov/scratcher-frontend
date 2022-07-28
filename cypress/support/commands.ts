/// <reference types="cypress" />

import { tokenWithInvalidSignature } from '../fixtures/data';

Cypress.Commands.add('login', () => {
  localStorage.setItem('accessToken', tokenWithInvalidSignature);
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Adds an access token for authentication to the browser.
       */
      login(): Chainable<void>;
    }
  }
}
