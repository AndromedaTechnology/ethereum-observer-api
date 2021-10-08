import Router from "koa-router";

import config from "../../config";
import controller from "./block.controller";
import jwtCheck from "../../middlewares/jwtCheck";

const ROUTES_PREFIX = "/blocks";

const router = new Router();
router.prefix(config.api_prefix + ROUTES_PREFIX);
router.get("/", controller.findAll);
router.get("/:id", controller.find);
router.delete("/", jwtCheck, controller.deleteAll);

export default router;
