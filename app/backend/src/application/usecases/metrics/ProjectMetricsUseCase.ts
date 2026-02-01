import { ListProjectsByUserUseCase } from "@src/application/usecases/project/ListProjectsByUserUseCase";
import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { TaskStatusValue } from "@src/domain/value-objects/TaskStatus";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";

type ProjectTaskMetrics = {
  total: number;
  todo: number;
  in_progress: number;
  blocked: number;
  done: number;
};

export type ProjectMetrics = {
  projectId: string;
  name: string;
  status: string;
  tasks: ProjectTaskMetrics;
  progress: number;
};

export interface IProjectMetricsUseCase {
  execute(userId: string): Promise<ProjectMetrics[]>;
}

export class ProjectMetricsUseCase implements IProjectMetricsUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly teamRepository: ITeamRepository,
    private readonly taskRepository: ITaskRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("ProjectMetricsUseCase");
  }

  async execute(userId: string): Promise<ProjectMetrics[]> {
    try {
      const projects = await new ListProjectsByUserUseCase(
        this.projectRepository,
        this.teamRepository,
        this.logger,
      ).execute(userId);

      const metrics = await Promise.all(
        projects.map(async (project) => {
          const tasks = await this.taskRepository.listTasksByProject(project.id);
          const statusCounts = tasks.reduce<ProjectTaskMetrics>(
            (acc, task) => {
              acc.total += 1;
              acc[task.status as TaskStatusValue] += 1;
              return acc;
            },
            { total: 0, todo: 0, in_progress: 0, blocked: 0, done: 0 },
          );

          const progress = statusCounts.total
            ? statusCounts.done / statusCounts.total
            : 0;

          return {
            projectId: project.id,
            name: project.name,
            status: project.status,
            tasks: statusCounts,
            progress,
          };
        }),
      );

      return metrics;
    } catch (error: any) {
      this.logger.error("Failed to compute project metrics", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ApplicationError("Failed to compute project metrics", { cause: error });
    }
  }
}
