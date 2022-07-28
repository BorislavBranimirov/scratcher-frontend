import { loggedUser } from '../fixtures/data';
import './commands';

beforeEach(() => {
  // intercept all requests to the server
  cy.intercept(`${Cypress.env('apiUrl')}/**`, { statusCode: 404 }).as(
    'interruptServerCalls'
  );

  cy.intercept('POST', '/api/auth/logout', (req) => {
    req.reply({
      success: true,
    });
  }).as('logout');

  cy.intercept('GET', `/api/users/username/${loggedUser.username}`, {
    body: loggedUser,
  }).as('userDefault');

  cy.intercept('GET', '/api/users/timeline', {
    body: {
      scratches: [],
      isFinished: true,
      extraScratches: {},
    },
  }).as('homeTimelineDefault');

  cy.intercept('GET', '/api/users/*/timeline', {
    body: {
      scratches: [],
      isFinished: true,
      extraScratches: {},
    },
  }).as('userTimelineDefault');

  cy.intercept('GET', '/api/users/suggested-users?limit=3', {
    body: [],
  }).as('suggestedUsersDefault');
});
