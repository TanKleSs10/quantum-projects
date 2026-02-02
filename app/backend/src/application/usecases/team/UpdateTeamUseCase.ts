import { UpdateTeamDTO } from "@src/domain/dtos/UpdateTeamDTO";
import { Team } from "@src/domain/entities/Team";
import { ITeamRepository } from "@src/domain/repositories/ITeamRepository";
import { ILogger } from "@src/interfaces/Logger";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";

export interface IUpdateTeamUseCase {
  execute(teamId: string, requesterId: string, dto: UpdateTeamDTO): Promise<Team>;
}

export class UpdateTeamUseCase implements IUpdateTeamUseCase {
  private readonly logger: ILogger;

  constructor(
    private readonly teamRepository: ITeamRepository,
    logger: ILogger,
  ) {
    this.logger = logger.child("UpdateTeamUseCase");
  }

  async execute(teamId: string, requesterId: string, dto: UpdateTeamDTO): Promise<Team> {
    try {
      this.logger.debug("Updating team", { teamId, requesterId });

      const team = await this.teamRepository.getTeamById(teamId);
      if (!team) {
        this.logger.warn("Team not found", { teamId });
        throw new DomainError("Team not found");
      }

      if (!this.isOwnerOrAdmin(team, requesterId)) {
        this.logger.warn("Unauthorized team update attempt", { teamId, requesterId });
        throw new DomainError("Insufficient permissions");
      }

      if (dto.name !== undefined) {
        team.name = dto.name;
      }
      if (dto.description !== undefined) {
        team.description = dto.description;
      }

      const updated = await this.teamRepository.saveTeam(team);
      this.logger.info("Team updated", { teamId: updated.id });
      return updated;
    } catch (error: any) {
      if (error instanceof DomainError) throw error;

      this.logger.error("Failed to update team", {
        teamId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ApplicationError("Could not update team", { cause: error });
    }
  }

  private isOwnerOrAdmin(team: Team, requesterId: string): boolean {
    if (team.ownerId === requesterId) return true;
    return team.getMember(requesterId)?.role === "admin";
  }
}
