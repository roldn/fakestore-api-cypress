let token;

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

Cypress.Commands.add('obtenerToken', () => {
  if (token) {
    return cy.wrap(token, { log: false });
  }

  return cy.login().then(({ body }) => {
    token = body.token;

    return token;
  });
});

Cypress.Commands.add('requestConToken', (opciones) =>
  cy.obtenerToken().then((valor) =>
    cy.request({
      ...opciones,
      headers: { Authorization: `Bearer ${valor}`, ...opciones.headers },
      failOnStatusCode: false,
    })
  )
);
