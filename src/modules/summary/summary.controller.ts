import { RouterContext } from "koa-router";

import service from "./summary.service";

class SummaryController {
  async findAll(ctx: RouterContext) {
    try {
      const item = await service.findAll();
      ctx.body = item;
    } catch (e) {
      ctx.throw(404);
      // ctx.throw(403);
    }
    return ctx;
  }
  async find(ctx: RouterContext) {
    try {
      const item = await service.find(
        Number.parseInt(ctx.params.dayTimestampStartMs)
      );
      ctx.body = item;
    } catch (e) {
      ctx.throw(404);
      // ctx.throw(403);
    }
    return ctx;
  }
}

export default new SummaryController();
