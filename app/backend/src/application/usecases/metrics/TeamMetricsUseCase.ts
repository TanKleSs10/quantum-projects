import { IProjectRepository } from "@src/domain/repositories/IProjectRepository";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";

export type TeamMetrics = {
  teamId: string;
  name: string;
  membersCount: number;
  projects: {
    total: number;
    active: number;
  };
};

export interface ITeamMetricsUseCase {
  execute(userId: string): Promise<TeamMetrics[]>;
}

export class TeamMetricsUseCase implements ITeamMetricsUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly teamRepository: ITeamRepository,
    private readonly projectRepository: IProjectRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("TeamMetricsUseCase");
  }

  async execute(userId: string): Promise<TeamMetrics[]> {
    try {
      const teams = await this.teamRepository.listTeamsByUser(userId);
      if (!teams) {
        throw new ApplicationError("Could not retrieve teams for user");
      }

      const metrics = await Promise.all(
        teams.map(async (team) => {
          const projects = await this.projectRepository.getProjectsByTeamId(team.id);
          const activeCount = projects.filter(
            (project) => project.status === "active" && !project.archived,
          ).length;

          return {
            teamId: team.id,
            name: team.name,
            membersCount: team.getMembers().length,
            projects: {
              total: projects.length,
              active: activeCount,
            },
          };
        }),
      );

      return metrics;
    } catch (error: any) {
      this.logger.error("Failed to compute team metrics", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      if (error instanceof ApplicationError) throw error;
      throw new ApplicationError("Failed to compute team metrics", { cause: error });
    }
  }
}
