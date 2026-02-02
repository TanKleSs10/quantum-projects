import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";
import { HttpError } from "@src/shared/errors/HttpError";

export interface IDeleteTaskUseCase {
  execute(taskId: string, requesterId: string): Promise<void>;
}

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly teamRepository: ITeamRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("DeleteTaskUseCase");
  }

  async execute(taskId: string, requesterId: string): Promise<void> {
    try {
      this.logger.debug("Deleting task", { taskId, requesterId });

      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) {
        this.logger.warn("Task not found", { taskId });
        throw new HttpError("Task not found", 404);
      }

      const project = await this.projectRepository.getProjectById(task.projectId);
      if (!project) {
        this.logger.warn("Project not found for task", { taskId });
        throw new HttpError("Project not found", 404);
      }

      const team = await this.teamRepository.getTeamById(project.teamId);
      if (!team) {
        this.logger.warn("Team not found for task", { taskId });
        throw new HttpError("Team not found", 404);
      }

      if (!this.canDelete(team, requesterId, task.createdBy)) {
        this.logger.warn("Requester cannot delete task", { taskId, requesterId });
        throw new HttpError("Insufficient permissions", 409);
      }

      await this.taskRepository.deleteTask(taskId);

      this.logger.info("Task deleted successfully", { taskId });
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof HttpError) throw error;

      this.logger.error("Failed to delete task", {
        taskId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ApplicationError("Failed to delete task", { cause: error });
    }
  }

  private canDelete(
    team: { ownerId: string; getMember(userId: string): { role: string } | undefined },
    requesterId: string,
    createdBy: string,
  ): boolean {
    if (createdBy === requesterId) return true;
    if (team.ownerId === requesterId) return true;
    return team.getMember(requesterId)?.role === "admin";
  }
}
