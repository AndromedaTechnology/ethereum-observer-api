import { Server } from "http";
import supertest from "supertest";
import mongoose, { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../index";
import { databaseSetup } from "../../database";

import service, { NetworkStatusMessage } from "./network.service";

// Server
let server: Server;
let request: supertest.SuperAgentTest;

// Database
let mongoMemoryServer: MongoMemoryServer;
let mongoConnection: Mongoose;

beforeAll(async () => {
  // Server
  server = app.listen();
  request = supertest.agent(server);

  // Database
  mongoMemoryServer = new MongoMemoryServer();
  mongoConnection = await databaseSetup(await mongoMemoryServer.getUri());

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

describe("network.service", () => {
  it("create", async () => {
    const response = await service.create(false);

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(response.message).toEqual(NetworkStatusMessage.CONNECTED);
  });
  it("delete", async () => {
    const response = await service.delete();

    expect(response).toBeDefined();
    expect(response.message).toBeDefined();
    expect(response.message).toEqual(NetworkStatusMessage.DISCONNECTED);
  });
});
