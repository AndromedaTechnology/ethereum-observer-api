import Router from "koa-router";

import config from "../../config";
import controller from "./network.controller";
import jwtCheck from "../../middlewares/jwtCheck";

const ROUTES_PREFIX = "/network";

const router = new Router();
router.prefix(config.api_prefix + ROUTES_PREFIX);
router.post("/", jwtCheck, controller.create);
router.delete("/", jwtCheck, controller.delete);

export default router;
