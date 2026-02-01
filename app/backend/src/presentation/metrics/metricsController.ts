import { Request, Response } from "express";
import { ILogger } from "@src/interfaces/Logger";
import { OverviewUseCase } from "@src/application/usecases/metrics/OverviewUseCase";
import { ProjectMetricsUseCase } from "@src/application/usecases/metrics/ProjectMetricsUseCase";
import { TaskMetricsUseCase } from "@src/application/usecases/metrics/TaskMetricsUseCase";
import { TeamMetricsUseCase } from "@src/application/usecases/metrics/TeamMetricsUseCase";
import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";

export class MetricsController {
  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly logger: ILogger,
  ) { }

  getOverview = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const metrics = new OverviewUseCase(this.teamRepository, this.projectRepository, this.taskRepository, this.logger);
      const overview = await metrics.execute(userId);
      return res.status(200).json({ success: true, data: overview, message: "Overview metrics retrieved successfully" });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  getProjectMetrics = async (_req: Request, res: Response) => {
    try {
      const userId = _req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const metrics = new ProjectMetricsUseCase(
        this.projectRepository,
        this.teamRepository,
        this.taskRepository,
        this.logger,
      );
      const data = await metrics.execute(userId);
      return res.status(200).json({ success: true, data, message: "Project metrics retrieved successfully" });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getTaskMetrics = async (_req: Request, res: Response) => {
    try {
      const userId = _req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const metrics = new TaskMetricsUseCase(
        this.taskRepository,
        this.logger,
      );
      const data = await metrics.execute(userId);
      return res.status(200).json({ success: true, data, message: "Task metrics retrieved successfully" });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getTeamMetrics = async (_req: Request, res: Response) => {
    try {
      const userId = _req.userId ?? null;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const metrics = new TeamMetricsUseCase(
        this.teamRepository,
        this.projectRepository,
        this.logger,
      );
      const data = await metrics.execute(userId);
      return res.status(200).json({ success: true, data, message: "Team metrics retrieved successfully" });
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

    this.logger.error("Unexpected metrics error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
