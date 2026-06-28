import { Router } from "express";
import adminRouter from "./admin.js";
import cmsRouter from "./cms.js";
import admissionsRouter from "./admissions.js";

const router = Router();

router.use("/admin", adminRouter);
router.use("/cms", cmsRouter);
router.use("/admissions", admissionsRouter);
router.get("/health", (_req, res) => res.json({ ok: true }));

export default router;
