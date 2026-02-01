import { Team } from "@src/domain/entities/Team";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";

export interface IDeleteTeamUseCase {
  execute(teamId: string, requesterId: string): Promise<void>;
}

export class DeleteTeamUseCase implements IDeleteTeamUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly teamRepository: ITeamRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("DeleteTeamUseCase");
  }

  async execute(teamId: string, requesterId: string): Promise<void> {
    try {
      this.logger.debug("Deleting team", { teamId, requesterId });

      const team = await this.teamRepository.getTeamById(teamId);
      if (!team) {
        this.logger.warn("Team not found", { teamId });
        throw new DomainError("Team not found");
      }

      if (!this.isOwner(team, requesterId)) {
        this.logger.warn("Unauthorized team delete attempt", { teamId, requesterId });
        throw new DomainError("Insufficient permissions");
      }

      await this.teamRepository.deleteTeam(teamId);
      this.logger.info("Team deleted", { teamId });
    } catch (error: any) {
      if (error instanceof DomainError) throw error;

      this.logger.error("Failed to delete team", {
        teamId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ApplicationError("Could not delete team", { cause: error });
    }
  }

  private isOwner(team: Team, requesterId: string): boolean {
    return team.ownerId === requesterId;
  }
}
