# fakestore-api-cypress

Pruebas automatizadas de la API de [Fake Store API](https://fakestoreapi.com/) con Cypress.
El contrato de referencia es el OpenAPI publicado en https://fakestoreapi.com/docs.

Cubre el login con manejo de token y el flujo completo de carrito: creación, actualización y
eliminación.

## Instalación

Requiere Node 18 o superior.

```bash
npm install
```

## Variables de entorno

Las credenciales no viajan en el repo. Hay que crear un cypress.env.json en la raíz a partir
del ejemplo y completarlo con cualquiera de los usuarios que devuelve GET /users:

```bash
cp cypress.env.example.json cypress.env.json
```

```json
{
  "username": "mor_2314",
  "password": "83r5^_"
}
```

El archivo está ignorado por git.

## Ejecución

```bash
npm test
```

Con npm run cy:open se abre la interfaz de Cypress.

La corrida termina con cuatro tests en rojo. No es un problema de instalación ni de
configuración: las aserciones validan el contrato documentado y esos cuatro tests señalan los
defectos listados en Hallazgos.

## Organización

Los specs van en cypress/e2e, uno por funcionalidad. En cypress/support están commands.js, con
los comandos reutilizables, y validaciones.js, con la validación de estructura y tipos. Los
esquemas de la documentación están en cypress/fixtures/esquemas.json.

## Decisiones

- Las aserciones se escriben contra la documentación. Cuando la API no la cumple, el test falla
  y el defecto se reporta en Hallazgos.
- El token se pide una vez por spec y se reutiliza en los requests siguientes. Se envía como
  Authorization: Bearer por convención, porque la documentación no define ningún esquema de
  autenticación.
- El carrito no envía el campo date porque la documentación no lo define en el esquema Cart.
- Los productos del carrito se toman de /products en tiempo de ejecución, no de valores fijos.
- La actualización y la eliminación trabajan sobre el carrito creado, por eso los tests de
  carrito corren en orden.
- La eliminación valida solo el código HTTP porque la documentación no define cuerpo de
  respuesta para el DELETE.

## Hallazgos

### General

- La documentación no define ningún esquema de autenticación: ningún endpoint declara seguridad
  ni el formato en el que se envía el token.

### Login

- El login con credenciales válidas responde 201 y la documentación define 200.
- El login con credenciales incorrectas responde 401, y la documentación solo define 400 para
  los errores.

### Carrito

#### Creación

- Los productos del carrito son objetos con productId y quantity, mientras que la documentación
  define Cart.products como un array de Product.

#### Actualización

- La respuesta repite la estructura de productId y quantity, igual que en la creación.

#### Consulta previa a la eliminación

- El carrito creado no se puede consultar: el GET por id responde 200 con null en lugar del
  carrito, así que la creación no queda registrada.

#### Eliminación

- Responde 200 para cualquier id numérico, incluso uno que nunca existió. Solo responde 400
  cuando el id no es un número.
- El GET posterior devuelve el mismo null que el DELETE, así que la baja no es verificable
  contra la API.
