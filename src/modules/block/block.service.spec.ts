import { Server } from "http";
import supertest from "supertest";
import mongoose, { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { app } from "../../index";
import { databaseSetup } from "../../database";

import seed from "./block.seed";
import service from "./block.service";

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

let itemId: mongoose.Types.ObjectId | undefined;
const blockToBeSeeded = seed.blocks[0];
const gasUsedUpdated = "22222222";

describe("block.service", () => {
  it("create", async () => {
    const response = await service.create(blockToBeSeeded);

    expect(response).toBeDefined();
    expect(response._id).toBeDefined();
    expect(response.gasUsed).toEqual(blockToBeSeeded.gasUsed);

    itemId = response._id;
  });

  it("findAll", async () => {
    const response = await service.findAll();

    expect(response).toBeDefined();
    expect(response[0].gasUsed).toEqual(blockToBeSeeded.gasUsed);
  });

  it("find", async () => {
    const response = await service.find(itemId!);

    expect(response).toBeDefined();
    expect(response._id).toEqual(itemId);
  });

  it("update", async () => {
    const response = await service.update(itemId!, {
      gasUsed: gasUsedUpdated,
    });

    expect(response).toBeDefined();
    expect(response._id).toEqual(itemId);
    expect(response.gasUsed).toEqual(gasUsedUpdated);
  });

  it("delete", async () => {
    const response = await service.delete(itemId!);

    expect(response).toBeDefined();
    expect(response._id).toEqual(itemId);
    expect(response.gasUsed).toEqual(gasUsedUpdated);
  });

  it("deleteAll", async () => {
    const response = await service.deleteAll();

    expect(response).toBeDefined();
    expect(response.ok).toEqual(1);
  });
});
