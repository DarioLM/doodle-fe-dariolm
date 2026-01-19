This is a [Next.js](https://nextjs.org) project which serves the FE for the Doodle Challenge.

The BE is defined in the [Doodle repository](https://github.com/DoodleScheduling/frontend-challenge-chat-api/tree/main#)

### First steps

`Node >= 24.13.0`

`npm >= 11.7.0`

The server needs (and will validate) the env vars, please create a `.env.local` file with the following values:

```
BE_API_URL=http://localhost:3000
AUTH_TOKEN=super-secret-doodle-token
```
>Env vars are filled for easiness as this is for demo purposes, on a real scenario the env vars should be securely stored

### Running the server

```bash
npm run dev
```

The server will open in [http://localhost:3003](http://localhost:3003)


### Tech stack at a glance
- NextJS
- Typescript
- Tailwind
- Biome
- Zod
- Vitest

### Tech stack details

NextJS is using the app router, using the latest version with react-compiler enabled.

A server side approach is prefered, limiting the usage of 'client-side' directive to only components that need user iteraction or browser data to optimise performace. 

### Standars, structure and developer guide

The main structure is as follows:

- `app`: Main folder that holds the routing + components of the application.
  - `components`: All the components belongs here.
    - `ChatFeed`: Component folder, in CamelCase.
      - `ChatFeed.types.ts`: Types definiton
      - `ChatFeed.test.ts`: Tests definiton
      - `index.tsx`: Component TSX


------
       Created by Darío López
