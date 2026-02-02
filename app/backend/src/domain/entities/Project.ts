import { ProjectStatus } from "@src/infrastructure/database/models/ProjectModel";

export class Project {
  constructor(
    public readonly id: string,
    public name: string,
    public readonly teamId: string,
    public readonly createdBy: string,
    public status: ProjectStatus = ProjectStatus.ACTIVE,
    public description?: string,
    public tags: string[] = [],
    public deadline?: Date,
    public archived: boolean = false,
  ) { }

  pause() {
    if (this.status !== ProjectStatus.ACTIVE) {
      throw new Error("Only active projects can be paused");
    }
    this.status = ProjectStatus.PAUSED;
  }

  resume() {
    if (this.status !== ProjectStatus.PAUSED) {
      throw new Error("Only paused projects can be resumed");
    }
    this.status = ProjectStatus.ACTIVE;
  }

  complete() {
    if (this.status === ProjectStatus.COMPLETED) {
      throw new Error("Project already completed");
    }
    this.status = ProjectStatus.COMPLETED;
  }

  reopen() {
    if (this.status !== ProjectStatus.COMPLETED) {
      throw new Error("Only completed projects can be reopened");
    }
    this.status = ProjectStatus.ACTIVE;
    this.archived = false;
  }

  toggleArchive() {
    this.archived = !this.archived;
  }

  rename(name: string) {
    if (!name.trim()) {
      throw new Error("Project name cannot be empty");
    }
    this.name = name;
  }
}
