export const RESPUESTA_LOGIN = {
  token: 'string',
};

export const PRODUCTO = {
  id: 'number',
  title: 'string',
  price: 'number',
  description: 'string',
  category: 'string',
  image: 'string',
};

export const CARRITO = {
  id: 'number',
  userId: 'number',
  products: 'array',
};

export const validarEsquema = (objeto, esquema) => {
  expect(objeto).to.be.an('object');

  Object.entries(esquema).forEach(([campo, tipo]) => {
    expect(objeto, campo).to.have.property(campo);
    expect(objeto[campo], campo).to.be.a(tipo);
  });
};
