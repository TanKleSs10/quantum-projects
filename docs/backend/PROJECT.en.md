## PHASE 1 - Domain contracts

### 1 Datasource (Domain)

Create interface:

- [x] `IProjectDatasource.ts`
  - `create(project: Project): Promise<Project>`
  - `findById(id: string): Promise<Project | null>`
  - `save(project: Project): Promise<Project>`
  - `delete(id: string): Promise<void>`

Rule:
**contracts only**, no Mongo, no logic.

---

### 2 Repository (Domain)

Create interface:

- [x] `IProjectRepository.ts`
  - `findById(projectId: string): Promise<Project | null>`
  - `create(project: Project): Promise<Project>`
  - `save(project: Project): Promise<Project>`
  - `delete(projectId: string): Promise<void>`

The repository represents the **Aggregate Root**.

---

## PHASE 2 - Infrastructure (Persistence)

### 3 Mapper

Done, just verify:

- [x] `ProjectMapper`
  - `toDomain(DocumentType<ProjectModel>)`
  - `toPersistence(Project)`

---

### 4 Datasource (Infra)

Implement:

- [x] `MongoProjectDatasource.ts`
  - uses `ProjectMongoModel`
  - converts with `ProjectMapper`
  - NO business rules
  - NO permissions validation
  - only technical CRUD

Methods:

- `create`
- `findById`
- `save`
- `delete`

---

### 5 Repository (Infra)

Implement:

- [x] `ProjectRepository.ts`
  - depends on `IProjectDatasource`
  - always returns `Project`
  - handles `null` correctly

---

### 6 Factory

Explicit initialization:

- [x] `projectRepositoryFactory.ts`
  - creates datasource
  - creates repository
  - exports instance

---

## PHASE 3 - Use Cases (Application)

### 7 Minimal use cases for MVP

#### Create

- [x] `CreateProjectUseCase`
  - validates:
    - team exists
    - user belongs to team
    - user is owner/admin

  - creates `Project`
  - saves via repository

---

#### Read

- [x] `GetProjectByIdUseCase`
  - validates access (team member)
  - returns project

---

#### Update

- [x] `UpdateProjectUseCase`
  - rename
  - update description
  - update tags
  - update deadline

---

#### Status (explicit actions)

- [x] `PauseProjectUseCase`
- [x] `ResumeProjectUseCase`
- [x] `CompleteProjectUseCase`
- [x] `ArchiveProjectUseCase`

Each one:

- loads project
- executes aggregate method
- saves

---

#### Delete

- [x] `DeleteProjectUseCase`
  - owner/admin only

---

## PHASE 4 - Tests (minimal)

- [x] `CreateProjectUseCase.test.ts`
- [x] `UpdateProjectUseCase.test.ts`
- [x] `ChangeProjectStatusUseCase.test.ts`

---

## Golden rule for the whole phase

- DTOs  Controller / UseCase
- Entities  Domain
- Mongo  Infra
- Permissions  UseCases
- Mapper  Infra

---

## Final result

At the end of this list you will have:

 Projects working
 Clean architecture
 Solid base for Tasks
 No technical debt

---

## MVP Extension - Task module

### Domain

- [x] `Task` entity with invariants (title required, valid status/priority)
- [x] Value objects `TaskStatus` and `TaskPriority`
- [x] Task DTOs (create, update, change status, assign, list filters)
- [x] Events `TaskCreated`, `TaskUpdated`, `TaskAssigned`
- [x] Contracts `ITaskRepository` and `ITaskDatasource`

### Application (Use Cases)

- [x] `CreateTaskUseCase`
- [x] `UpdateTaskUseCase`
- [x] `ChangeTaskStatusUseCase`
- [x] `AssignTaskUseCase`
- [x] `GetTaskByIdUseCase`
- [x] `ListTasksByProjectUseCase`

### Infrastructure

- [x] `TaskModel` (Mongoose) with indexes by project, status, and assignee
- [x] `TaskMapper` (entity <-> persistence)
- [x] `MongoTaskDatasource`
- [x] `TaskRepository`
- [x] Factory `taskRepositoryFactory`

### Presentation
