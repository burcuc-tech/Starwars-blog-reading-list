# Lista de Lectura del Blog de Star Wars

Aplicación React creada con Vite para explorar información de Star Wars usando SWAPI.tech. Permite consultar personajes, planetas y vehículos, abrir una vista detallada y guardar elementos en una lista de favoritos para leerlos después.

## Funcionalidades

- Listado de personajes, planetas y vehículos desde `https://www.swapi.tech/api`.
- Tarjetas con imágenes oficiales de StarWars.com Databank.
- Soporte para imágenes locales en `public/images/{people|planets|vehicles}/{uid}.jpg`.
- Vista detallada con la información disponible en SWAPI.
- Favoritos globales con Context API y `useReducer`.
- Persistencia de favoritos con `localStorage`.
- Diseño responsive con Bootstrap y CSS personalizado.

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
```

La aplicación se ejecuta por defecto en `http://localhost:3000/`.

## Imágenes

SWAPI.tech no incluye imágenes en sus respuestas. La aplicación busca imágenes en este orden:

1. Archivo local, por ejemplo `public/images/people/1.jpg`.
2. Imagen oficial mapeada desde StarWars.com Databank.
3. Star Wars Visual Guide como respaldo.
4. Fallback visual interno si ninguna imagen carga.
