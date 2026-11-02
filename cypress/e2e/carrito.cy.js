import { validarEsquema } from '../support/validaciones';

const USUARIO_ID = 2;

describe('Carrito', () => {
  let esquemas;
  let productos;
  let carrito;
  let respuestaEliminacion;

  before(() => {
    cy.fixture('esquemas').then((contenido) => {
      esquemas = contenido;
    });

    cy.requestConToken({ method: 'GET', url: '/products' }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.be.an('array').and.not.be.empty;

      productos = body.slice(0, 4);
    });
  });

  it('crea un carrito con tres productos existentes', () => {
    const productosDelCarrito = productos.slice(0, 3).map((producto, indice) => ({
      productId: producto.id,
      quantity: indice + 1,
    }));

    cy.requestConToken({
      method: 'POST',
      url: '/carts',
      body: { userId: USUARIO_ID, products: productosDelCarrito },
    }).then(({ status, body }) => {
      carrito = body;

      expect(status).to.eq(201);
      validarEsquema(body, esquemas.carrito);
      expect(body.userId).to.eq(USUARIO_ID);
      expect(body.products).to.have.length(3);
      body.products.forEach((producto) => validarEsquema(producto, esquemas.producto));
    });
  });

  it('agrega un producto al carrito creado', () => {
    const agregado = { productId: productos[3].id, quantity: 1 };
    const productosDelCarrito = [...carrito.products, agregado];

    cy.requestConToken({
      method: 'PUT',
      url: `/carts/${carrito.id}`,
      body: { userId: carrito.userId, products: productosDelCarrito },
    }).then(({ status, body }) => {
      const anterior = carrito;
      carrito = body;

      expect(status).to.eq(200);
      validarEsquema(body, esquemas.carrito);
      expect(body.id).to.eq(anterior.id);
      expect(body.products).to.have.length(4);
      body.products.forEach((producto) => validarEsquema(producto, esquemas.producto));
    });
  });

  it('consulta el carrito creado antes de eliminarlo', () => {
    cy.requestConToken({ method: 'GET', url: `/carts/${carrito.id}` }).then(({ status, body }) => {
      expect(status).to.eq(200);
      validarEsquema(body, esquemas.carrito);
      expect(body.id).to.eq(carrito.id);
    });
  });

  it('elimina el carrito creado', () => {
    cy.requestConToken({ method: 'DELETE', url: `/carts/${carrito.id}` }).then(({ status, body }) => {
      respuestaEliminacion = body;

      expect(status).to.eq(200);
    });
  });

  it('el carrito eliminado deja de estar disponible', () => {
    cy.requestConToken({ method: 'GET', url: `/carts/${carrito.id}` }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.deep.equal(respuestaEliminacion);
    });
  });
});
