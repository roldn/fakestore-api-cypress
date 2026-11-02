import { CARRITO, PRODUCTO, PRODUCTO_DEL_CARRITO, validarEsquema } from '../support/esquemas';

const USUARIO_ID = 2;

describe('Carrito', () => {
  let productos;
  let carrito;

  before(() => {
    cy.requestConToken({ method: 'GET', url: '/products?limit=4' }).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body).to.be.an('array').and.have.length(4);
      body.forEach((producto) => validarEsquema(producto, PRODUCTO));

      productos = body;
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
      expect(status).to.eq(201);
      validarEsquema(body, CARRITO);
      expect(body.userId).to.eq(USUARIO_ID);
      expect(body.products).to.have.length(3);
      body.products.forEach((item) => validarEsquema(item, PRODUCTO_DEL_CARRITO));
      expect(body.products).to.deep.equal(productosDelCarrito);

      carrito = body;
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
      expect(status).to.eq(200);
      validarEsquema(body, CARRITO);
      expect(body.id).to.eq(carrito.id);
      expect(body.products).to.have.length(4);
      body.products.forEach((item) => validarEsquema(item, PRODUCTO_DEL_CARRITO));
      expect(body.products).to.deep.include(agregado);

      carrito = body;
    });
  });

  it('elimina el carrito creado', () => {
    cy.requestConToken({ method: 'DELETE', url: `/carts/${carrito.id}` }).then(({ status }) => {
      expect(status).to.eq(200);
    });
  });
});
