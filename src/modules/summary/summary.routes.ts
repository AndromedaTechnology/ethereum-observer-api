import Router from "koa-router";

import config from "../../config";
import controller from "./summary.controller";
import jwtCheck from "../../middlewares/jwtCheck";

const ROUTES_PREFIX = "/summary";

const router = new Router();
router.prefix(config.api_prefix + ROUTES_PREFIX);
router.get("/", controller.findAll);
router.get("/:dayTimestampStartMs", controller.find);

export default router;
