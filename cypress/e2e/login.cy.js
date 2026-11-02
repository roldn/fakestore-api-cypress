import { validarEsquema } from '../support/validaciones';

describe('Login', () => {
  let esquemas;

  before(() => {
    cy.fixture('esquemas').then((contenido) => {
      esquemas = contenido;
    });
  });

  it('devuelve un token con credenciales válidas', () => {
    cy.login().then(({ status, body }) => {
      expect(status).to.eq(200);
      validarEsquema(body, esquemas.respuestaLogin);
    });
  });

  it('rechaza credenciales incorrectas', () => {
    cy.env(['username']).then(({ username }) => {
      cy.login({ username, password: 'contrasena-invalida' }).then(({ status }) => {
        expect(status).to.eq(400);
      });
    });
  });

  it('rechaza un request sin contraseña', () => {
    cy.env(['username']).then(({ username }) => {
      cy.login({ username }).then(({ status }) => {
        expect(status).to.eq(400);
      });
    });
  });
});
