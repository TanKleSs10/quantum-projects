import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITaskRepository } from "@src/domain/repositories/ITaskRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { ListProjectsByUserUseCase } from "@src/application/usecases/project/ListProjectsByUserUseCase";

type OverviewMetrics = {
  project: {
    desc: string;
    totalCount: number;
      status: {
        active: number;
        paused: number;
        completed: number;
        archived: number;
      },
    overdue: number;
  };
  task: {
    desc: string;
    totalCount: number;
    status: {
      todo: number;
      inProgress: number;
      blocked: number;
      done: number;
    }
    priority: {
      low: number;
      medium: number;
      high: number;
      urgent: number;
    };
    overdue: number;
  };
  team: {
    desc: string;
    totalCount: number;
  };
}

interface IOverviewUseCase {
  execute(userId: string): Promise<OverviewMetrics>;
}

export class OverviewUseCase implements IOverviewUseCase {
  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly projectRepository: IProjectRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly logger: ILogger,
  ) { }

  async execute(userId: string): Promise<OverviewMetrics> {
    try {
      // teams
      const teams = await this.teamRepository.listTeamsByUser(userId);
      if (!teams) {
        this.logger.error("Team repository returned null for user teams", { userId });
        throw new ApplicationError("Could not retrieve teams for user");
      }
      const teamCount = teams.length;
      const teamDesc = "Total number of teams the user is a member of";
      // projects
      const projects = await new ListProjectsByUserUseCase(
        this.projectRepository,
        this.teamRepository,
        this.logger,
      ).execute(userId);
      const projectCount = projects.length;
      const projectStatusCounts = {
        active: projects.filter(p => p.status === "active" && !p.archived).length,
        paused: projects.filter(p => p.status === "paused" && !p.archived).length,
        completed: projects.filter(p => p.status === "completed" && !p.archived).length,
        archived: projects.filter(p => p.archived).length,
      };
      const overdueProjects = projects.filter(p => p.deadline && p.deadline < new Date()).length;
      const projectDesc = "Total number of projects the user is involved in";

      // tasks
      const tasks = await this.taskRepository.listTasksByUserId(userId);
      if (!tasks) {
        this.logger.error("Task repository returned null for user tasks", { userId });
        throw new ApplicationError("Could not retrieve tasks for user");
      }
      const taskCount = tasks.length;
      const taskStatusCounts = {
        todo: tasks.filter(t => t.status === "todo").length,
        inProgress: tasks.filter(t => t.status === "in_progress").length,
        blocked: tasks.filter(t => t.status === "blocked").length,
        done: tasks.filter(t => t.status === "done").length,
      };
      const taskPriorityCounts = {
        low: tasks.filter(t => t.priority === "low").length,
        medium: tasks.filter(t => t.priority === "medium").length,
        high: tasks.filter(t => t.priority === "high").length,
        urgent: tasks.filter(t => t.priority === "urgent").length,
      };
      const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < new Date()).length;
      const taskDesc = "Total number of tasks created or assigned to the user";

      return {
        team: {
          desc: teamDesc,
          totalCount: teamCount,
        },
        project: {
          desc: projectDesc,
          totalCount: projectCount,
          status: projectStatusCounts,
          overdue: overdueProjects,
        },
        task: {
          desc: taskDesc,
          totalCount: taskCount,
          status: taskStatusCounts,
          priority: taskPriorityCounts,
          overdue: overdueTasks,
        },
      };

    } catch (error) {
      this.logger.error("Error generating overview metrics", {
        error: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Failed to generate overview metrics", { cause: error });
    }
  }
}
