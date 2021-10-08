import mongoose from "mongoose";
import { RouterContext } from "koa-router";

import service from "./block.service";

class BlockController {
  async findAll(ctx: RouterContext) {
    ctx.body = await service.findAll();
    return ctx;
  }

  async find(ctx: RouterContext) {
    try {
      const item = await service.find(mongoose.Types.ObjectId(ctx.params.id));
      ctx.body = item;
    } catch (e) {
      ctx.throw(404);
    }
    return ctx;
  }

  async deleteAll(ctx: RouterContext) {
    try {
      ctx.body = await service.deleteAll();
    } catch (e) {
      ctx.throw(404);
      // ctx.throw(403);
    }
    return ctx;
  }
}

export default new BlockController();
