import { authMiddleware } from "@src/application/middlewares/authmiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
import { meController } from "./meController";
import { userRepository } from "@src/infrastructure/factories/userRepositoryFactory";
import { projectRepository } from "@src/infrastructure/factories/projectRepositoryFactory";
import { taskRepository } from "@src/infrastructure/factories/taskRepositoryFactory";
import { teamRepository } from "@src/infrastructure/factories/teamRepositoryFactory";
import { logger } from "@src/infrastructure/logs";
import { Router } from "express";

export class MeRoutes {
  // This routes groups all endpoints related to the authenticated user's own profile management.

  static get routes() {
    const router = Router();
    const controller = new meController(
      userRepository,
      projectRepository,
      taskRepository,
      teamRepository,
      logger.child("MeController"),
    );

    router.use(authMiddleware);

    router.get("/", asyncHandler(controller.getMyProfile));
    router.get("/projects", asyncHandler(controller.getMyProjects));
    router.get("/tasks", asyncHandler(controller.getMyTasks));
    router.get("/teams", asyncHandler(controller.getMyTeams));

    return router;
  }
}
