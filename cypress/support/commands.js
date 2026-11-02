const solicitarLogin = (credenciales) =>
  cy.request({
    method: 'POST',
    url: '/auth/login',
    body: credenciales,
    failOnStatusCode: false,
  });

Cypress.Commands.add('login', (credenciales) =>
  credenciales
    ? solicitarLogin(credenciales)
    : cy.env(['username', 'password']).then(solicitarLogin)
);
