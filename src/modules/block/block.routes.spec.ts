import { Server } from "http";
import supertest from "supertest";
import { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import config from "../../config";
import { app } from "../../index";
import authService from "../auth/auth.service";
import { databaseSetup } from "../../database";

import blockSeed from "./block.seed";

// Server
let server: Server;
let request: supertest.SuperAgentTest;

// Database
let mongoMemoryServer: MongoMemoryServer;
let mongoConnection: Mongoose;

// Token
let token: string;

beforeAll(async () => {
  // Server
  server = app.listen();
  request = supertest.agent(server);

  // Database
  mongoMemoryServer = new MongoMemoryServer();
  mongoConnection = await databaseSetup(await mongoMemoryServer.getUri());

  token = authService.getToken(config.admin_password);

  await blockSeed.seed();

  return Promise.resolve();
});

afterAll(async () => {
  // Server
  server.close();

  // Database
  await mongoConnection.disconnect();
  await mongoMemoryServer.stop();

  return Promise.resolve();
});

let itemId: string;

const responseType = "application/json";

describe("block.routes", () => {
  it("findAll", async () => {
    const response = await request.get(config.api_prefix + "/blocks");

    expect(response.status).toEqual(200);
    expect(response.type).toEqual(responseType);
    expect(response.body).toBeDefined();
    expect(response.body.length).toEqual(blockSeed.blocks.length);

    itemId = response.body[0]._id;
  });

  it("find", async () => {
    const response = await request.get(config.api_prefix + `/blocks/${itemId}`);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual(responseType);
    expect(response.body).toBeDefined();
    expect(response.body._id).toEqual(itemId);
  });

  it("deleteAll", async () => {
    const response = await request
      .delete(config.api_prefix + `/blocks`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual(responseType);
    expect(response.body.ok).toEqual(1);
  });
});
