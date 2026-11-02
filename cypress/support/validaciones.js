export const validarEsquema = (objeto, esquema) => {
  expect(objeto).to.be.an('object');

  Object.entries(esquema).forEach(([campo, tipo]) => {
    expect(objeto, campo).to.have.property(campo);
    expect(objeto[campo], campo).to.be.a(tipo);
  });
};
