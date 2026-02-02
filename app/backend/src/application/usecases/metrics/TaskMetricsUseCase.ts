import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { TaskStatusValue } from "@src/domain/value-objects/TaskStatus";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";

export type TaskMetrics = {
  total: number;
  byStatus: Record<TaskStatusValue, number>;
  overdue: number;
};

export interface ITaskMetricsUseCase {
  execute(userId: string): Promise<TaskMetrics>;
}

export class TaskMetricsUseCase implements ITaskMetricsUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly taskRepository: ITaskRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("TaskMetricsUseCase");
  }

  async execute(userId: string): Promise<TaskMetrics> {
    try {
      const tasks = await this.taskRepository.listTasksByUserId(userId);
      if (!tasks) {
        throw new ApplicationError("Could not retrieve tasks for user");
      }

      const byStatus: Record<TaskStatusValue, number> = {
        todo: 0,
        in_progress: 0,
        blocked: 0,
        done: 0,
      };

      for (const task of tasks) {
        byStatus[task.status as TaskStatusValue] += 1;
      }

      const now = new Date();
      const overdue = tasks.filter((task) => task.dueDate && task.dueDate < now).length;

      return {
        total: tasks.length,
        byStatus,
        overdue,
      };
    } catch (error: any) {
      this.logger.error("Failed to compute task metrics", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Failed to compute task metrics", { cause: error });
    }
  }
}
