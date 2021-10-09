<h1 align="center">Ethereum Observer API</h1>
<p align="center">
  <a href="https://ethereum-observer-api.andromeda.technology"><img src="./storage/static/hero.jpg"  alt="Ethereum Observer API" /></a>
  <br />
  <br />
  <a href="https://ethereum-observer-api.andromeda.technology">Simple tracker for Ethereum Network</a>
  <br />
  <a href="https://ethereum-observer-api.andromeda.technology">https://ethereum-observer-api.andromeda.technology</a>
</p>

Simple `block and transaction tracker` for [Ethereum network](https://ethereum.org).

Uses a `Smart Contract` to save short summary for each day.

## 1. Technology

- [TypeScript](https://www.typescriptlang.org/),
- [Koa.js](https://koajs.com/),
- Database: [MongoDB](https://www.mongodb.com/): [Mongoose](https://mongoosejs.com/),
- Config: [Dotenv](https://www.npmjs.com/package/dotenv), [Joi](https://joi.dev/),
- Testing: [Jest](https://jestjs.io/): SuperTest, MongoDBMemoryServer,
- [Docker](https://www.docker.com/): MongoDB.

**Blockchain**

- Ethereum,
- Smart Contract: [Solidity](https://docs.soliditylang.org/),
  - only this app can write to the Contract,
  - anyone can read it's state.

**Communication with the Ethereum Network**

- Using [ethers.js](https://docs.ethers.io/v5/) for calls to Ethereum network,
- Subscribing to [events](https://docs.ethers.io/v5/api/providers/provider/#Provider--events),
  - Event: `block`: new block is mined.

## 2. Usage

1. Clone the repo,
2. Duplicate `.env.example` files in [`./`,`/docker/`] to `.env`; modify as needed,
3. Have `Docker` [installed](https://www.docker.com/get-started), run the containers and your app (check the instructions below),
4. Add modules (routes, controllers, services, tests) to `/src`,
5. List newly added modules (features) here (Readme.md) and in your POSTMAN collection.

### 2.1. Starting/stopping the observer

Observed data will be saved to the local database, and later - to a Smart Contract, as a daily summary.

- Start: `POST [API_PREFIX]/network`
- Stop: `DELETE [API_PREFIX]/network`

`[API_PREFIX]` is defined in `.env`; defaults to `/api` .

_Note: Use the Postman Collection linked below._

## 3. Features

1. Watches for [block](https://ethereum.org/en/developers/docs/blocks/) creation, stores it in the local DB,
2. For every created block: pulls all [transactions](https://ethereum.org/en/developers/docs/transactions/) and stores them in the local DB,
3. For every day that passes: storing [`totalBlockAmount`,`totalGasAmount`] in a simple Smart Contract, using [Solidity](https://docs.soliditylang.org/).

Modules

1. Network: start/stop network observation,
2. Block,

All API routes are prefixed by `API_PREFIX` (defined in`.env`) (default: `/api`).

## 4. Setup

**Docker**

Docker provides isolated `MongoDB` for your project.

```
cd ./docker

# Duplicate example env file, modify as needed
cp .env.example .env

docker-compose up -d
```

**Application**

```
# Return from `docker` to root dir
# cd ..

# Duplicate example env file, modify if needed
cp .env.example .env

# Install packages
npm i

# Run
npm run dev
```

## 5. Tests

Using `Jest` Testing Framework.

Jest uses `SuperTest` and `MongoDBMemoryServer`.

```
npm run test
```

## 6. Postman

[Postman Documentation](https://documenter.getpostman.com/view/97483/UUy7aPBG)

Pre-set environment variables:

- `host`
- `admin_password`

Dynamic environment variables,
automatically set in tests:

- `access_token`

## 7. Admin Routes

Routes can be protected with `jwtCheck` middleware,
requiring admin rights.

Requests going to these routes require `Authorization: Bearer {access_token}` header.

**List of protected, i.e. Admin Routes**

1. Message[Create,Update,Delete],
2. [Add your protected routes here]

**Getting access_token for the Admin user**

- Request endpoint: `POST /auth/token`,
- Pass your password in the request body: `{ password: ADMIN_PASSWORD }`,
- Response will return created `token`.

Note: Postman collection will automatically set `access_token` environment variable,
so you can immediately call admin routes, without copy-pasting it or setting the env variable manually.

**Getting the ADMIN_PASSWORD**

- Your `ADMIN_PASSWORD` is defined in `.env` file.
- It defaults to `secret`.

## 8. Deployment

If you use MongoDB Atlas: Uncomment and fill `DB_URI` in `.env`.

## 9. Social

Andromeda

- [Medium](https://medium.com/andromeda-technology)
- [Twitter](https://twitter.com/andromeda_node)

## 10. Rest

Hero image source: [EthereumPrice.org](https://ethereumprice.org).

## 11. Related

[🚀 FireStarter API - Progressive Startup API Boilerplate](https://github.com/moltouni/firestarter-api)

- Easy to extend, Progressive and Scalable API boilerplate to power your startup,
- TypeScript,
- Koa.js,
- MongoDB,
- Jest,
- Docker.

[🏄 Habitus - Journal, Habit, Emotion tracker](https://github.com/AndromedaTechnology/habitus)

- State-of-the-art tracker for emotions, habits and thoughts,
- Healthiest version of you,
- Gamified,
- Anonymous and open source.

## 12. Contribute

Check [Self-Aware Software Artisan](http://selfawaresoftwareartisan.com) before contributing.

<br/>
<h3 align="center">
  Crafted with ❤️ <br />
  by contributors around the 🌍 World and <a href="https://andromeda.technology/">🌌 Andromeda</a>.
</h3>
