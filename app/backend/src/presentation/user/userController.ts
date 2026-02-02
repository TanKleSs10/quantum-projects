import { Request, Response } from "express";
import { ILogger } from "@src/interfaces/Logger";
import { ISecurityService } from "@src/domain/services/ISecurityService";
import { IUserRepository } from "@src/domain/repositories/IUserRepository";
import { UpdateUserSchema } from "@src/domain/dtos/UpdateUserDTO";
import { DeleteUserUseCase } from "@src/application/usecases/user/DeleteUserUseCase";
import { UpdateUserUseCase } from "@src/application/usecases/user/UpdateUserUseCase";
import { ChangePassSchema } from "@src/domain/dtos/ChangePassDTO";
import { ChangePassUseCase } from "@src/application/usecases/user/ChangePassUseCase";
import { ApplicationError } from "@src/shared/errors/ApplicationError";
import { DomainError } from "@src/shared/errors/DomainError";

export class UserController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly securityService: ISecurityService,
    private readonly logger: ILogger,
  ) { }

  updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.userId ? req.userId : null;
      if (!userId) {
        this.logger.error("Unauthorized: No user ID found in request");
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const updateData = UpdateUserSchema.safeParse(req.body);

      if (!updateData.success) {
        this.logger.error("Invalid update data");
        return res
          .status(400)
          .json({ success: false, message: "Invalid update data" });
      }

      const user = await new UpdateUserUseCase(
        this.userRepository,
        this.securityService,
        this.logger,
      ).execute(userId, updateData.data!);
      return res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;

      if (!userId) {
        this.logger.error("Unauthorized: No user ID found in request");
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;

      const parsed = ChangePassSchema.safeParse({
        userId,
        currentPassword,
        newPassword,
      });

      if (!parsed.success) {
        this.logger.error("Invalid change password data", {
          issues: parsed.error.message,
        });

        return res.status(400).json({
          success: false,
          message: "Invalid change password data",
          errors: parsed.error.message,
        });
      }

      await new ChangePassUseCase(
        this.userRepository,
        this.securityService,
        this.logger,
      ).execute(parsed.data);
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      await new DeleteUserUseCase(this.userRepository, this.logger).execute(
        userId,
      );
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
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

    this.logger.error("Unexpected user error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
