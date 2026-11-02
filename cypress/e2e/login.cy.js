import { RESPUESTA_LOGIN, validarEsquema } from '../support/esquemas';

describe('Login', () => {
  it('devuelve un token con credenciales válidas', () => {
    cy.login().then(({ status, body }) => {
      expect(status).to.eq(201);
      validarEsquema(body, RESPUESTA_LOGIN);
      expect(body.token).to.not.be.empty;
      expect(body.token.split('.')).to.have.length(3);
    });
  });

  it('rechaza una contraseña incorrecta', () => {
    cy.env(['username']).then(({ username }) => {
      cy.login({ username, password: 'contrasena-invalida' }).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body).to.be.a('string').and.contain('incorrect');
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
