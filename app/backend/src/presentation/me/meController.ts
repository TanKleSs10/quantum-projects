import { Request, Response } from "express";
import { GetUserByIdUseCase } from "@src/application/usecases/user/GetUserByIdUseCase";
import { ListProjectsByUserUseCase } from "@src/application/usecases/project/ListProjectsByUserUseCase";
import { ListTasksByUserUseCase } from "@src/application/usecases/task/ListTasksByUserUseCase";
import { ListTeamsByUserUseCase } from "@src/application/usecases/team/ListTeamsByUserUseCase";
import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { IUserRepository } from "@src/domain/repositories/IUserRepository";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";

export class meController {
  private readonly logger: ILogger;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly teamRepository: ITeamRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("MeController");
  }

  getMyProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ?? null;

      if (!userId) {
        this.logger.warn("getMe called without authenticated user");
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user = await new GetUserByIdUseCase(
        this.userRepository,
        this.logger,
      ).execute(userId);

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMyProjects = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const projects = await new ListProjectsByUserUseCase(
        this.projectRepository,
        this.teamRepository,
        this.logger,
      ).execute(userId);

      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMyTasks = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const tasks = await new ListTasksByUserUseCase(
        this.taskRepository,
        this.projectRepository,
        this.teamRepository,
        this.logger,
      ).execute(userId);

      return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMyTeams = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const teams = await new ListTeamsByUserUseCase(
        this.teamRepository,
        this.logger,
      ).execute(userId);

      return res.status(200).json({ success: true, data: teams });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: unknown) {
    if (error instanceof DomainError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error instanceof ApplicationError) {
      return res.status(500).json({ success: false, message: error.message });
    }

    this.logger.error("Unexpected me error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
