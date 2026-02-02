import { Router } from "express";
import { ProjectController } from "./projectController";
import { logger } from "@src/infrastructure/logs";
import { projectRepository } from "@src/infrastructure/factories/projectRepositoryFactory";
import { teamRepository } from "@src/infrastructure/factories/teamRepositoryFactory";
import { authMiddleware } from "@src/application/middlewares/authmiddleware";
import { validateObjectIdParam } from "@src/application/middlewares/validateObjectId";
import { asyncHandler } from "@src/presentation/middlewares/asyncHandler";
import { TaskRoutes } from "@src/presentation/task/taskRoutes";

export class ProjectRoutes {
  static get routes() {
    const router = Router();
    const controller = new ProjectController(
      projectRepository,
      teamRepository,
      logger.child("ProjectController"),
    );

    router.use(authMiddleware);


    router.get(
      "/:id",
      validateObjectIdParam("id"),
      asyncHandler(controller.getProjectById),
    );
    router.patch(
      "/:id",
      validateObjectIdParam("id"),
      asyncHandler(controller.patchProject),
    );
    router.delete(
      "/:id",
      validateObjectIdParam("id"),
      asyncHandler(controller.deleteProject),
    );

    // State management    

    router.patch(
      "/:id/complete",
      validateObjectIdParam("id"),
      asyncHandler(controller.completeProject),
    );
    router.patch(
      "/:id/pause",
      validateObjectIdParam("id"),
      asyncHandler(controller.pauseProject),
    );
    router.patch(
      "/:id/archive",
      validateObjectIdParam("id"),
      asyncHandler(controller.archiveProject),
    );
    router.patch(
      "/:id/reopen",
      validateObjectIdParam("id"),
      asyncHandler(controller.reopenProject),
    );

    router.use(
      "/:projectId/tasks",
      validateObjectIdParam("projectId"),
      TaskRoutes.projectRoutes,
    );

    return router;
  }

  static get teamRoutes() {
    const router = Router({ mergeParams: true });
    const controller = new ProjectController(
      projectRepository,
      teamRepository,
      logger.child("ProjectController"),
    );

    router.use(authMiddleware);
    router.use((req, _res, next) => {
      if (!req.params.teamId && req.params.id) {
        req.params.teamId = req.params.id;
      }
      next();
    });
    router.use(validateObjectIdParam("teamId"));
    router.post("/", asyncHandler(controller.createProject));
    router.get("/", asyncHandler(controller.listProjectsByTeam));

    return router;
  }
}
