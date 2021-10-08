import { RouterContext } from "koa-router";

import service from "./network.service";

class NetworkController {
  async create(ctx: RouterContext) {
    try {
      const item = await service.create();
      ctx.body = item;
    } catch (e) {
      ctx.throw(422);
    }
    return ctx;
  }
  async delete(ctx: RouterContext) {
    try {
      const item = await service.delete();
      ctx.body = item;
    } catch (e) {
      ctx.throw(404);
      // ctx.throw(403);
    }
    return ctx;
  }
}

export default new NetworkController();
