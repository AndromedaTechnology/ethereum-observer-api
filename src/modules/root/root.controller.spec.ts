import { Server } from 'http';
import supertest from "supertest";
import { Mongoose } from 'mongoose';

import { app } from "../../index";
import { databaseSetup } from '../../database';

let server: Server;
let mongoConnection: Mongoose;
let request: supertest.SuperAgentTest;

beforeAll(async () => {
  server = app.listen();
  request = supertest.agent(server);
  mongoConnection = await databaseSetup();
  return Promise.resolve();
});

afterAll(async () => {
  server.close();
  await mongoConnection.connection.close(true);
  return Promise.resolve();
});

describe("routes", () => {
  it("root", async () => {
    const response = await request.get("/");
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    expect(response.body.msg).toEqual("Hello");
  });
});