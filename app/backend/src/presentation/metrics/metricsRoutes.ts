import { Router } from "express";
import { authMiddleware } from "@src/application/middlewares/authmiddleware";
import { MetricsController } from "./metricsController";
import { logger } from "@src/infrastructure/logs";
import { asyncHandler } from "@src/presentation/middlewares/asyncHandler";
import { teamRepository } from "@src/infrastructure/factories/teamRepositoryFactory";
import { projectRepository } from "@src/infrastructure/factories/projectRepositoryFactory";
import { taskRepository } from "@src/infrastructure/factories/taskRepositoryFactory";

export class MetricsRoutes {
  static get routes() {
    const router = Router();
    const controller = new MetricsController(
      teamRepository,
      projectRepository,
      taskRepository,
      logger.child("MetricsController"),
    );

    router.use(authMiddleware);

    router.get("/overview", asyncHandler(controller.getOverview));

    router.get("/projects", asyncHandler(controller.getProjectMetrics));

    router.get("/tasks", asyncHandler(controller.getTaskMetrics));

    router.get("/teams", asyncHandler(controller.getTeamMetrics));

    return router;
  }
}
