import { Request, Response } from "express";
import { ILogger } from "@src/interfaces/Logger";

export class MetricsController {
  constructor(
    private readonly logger: ILogger,
  ) {}

  getOverview = async (_req: Request, res: Response) => {
    return res.status(501).json({ success: false, message: "Not implemented" });
  };

  getProjectMetrics = async (_req: Request, res: Response) => {
    return res.status(501).json({ success: false, message: "Not implemented" });
  };

  getTaskMetrics = async (_req: Request, res: Response) => {
    return res.status(501).json({ success: false, message: "Not implemented" });
  };

  getTeamMetrics = async (_req: Request, res: Response) => {
    return res.status(501).json({ success: false, message: "Not implemented" });
  };
}
