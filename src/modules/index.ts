import combineRouters from "koa-combine-routers";

import routerRoot from "./root/root.module";
import routerAuth from "./auth/auth.module";
import routerBlock from "./block/block.module";
import routerNetwork from "./network/network.module";
import routerSummary from "./summary/summary.module";

const router = combineRouters(
  routerRoot,
  routerAuth,
  routerBlock,
  routerNetwork,
  routerSummary
);

export default router;
