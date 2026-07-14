# PC-Builder Project: AI Agent Instruction Guide

Welcome to the PC-Builder project! This file serves as the main entry point to instruct AI agents on the system architecture, coding conventions, project structure, and data mapping conventions.

> [!IMPORTANT]
>
> - You MUST read the respective documentation files in this directory before starting work on the frontend, backend, or mapping layers.
> - You MUST verify code correctness by running compilation, linting, and formatting checks (e.g., build verification, linting, and prettier formatting) before completing any task.

---

## 1. Project Overview & Architecture

For an understanding of the full-stack architecture, runtimes, database connections, and Docker configuration:

- **Read**: [project_overview.md](file:///home/ubuntu/Documents/PC-Builder/.agents/project_overview.md)

## 2. Directory & Project Structure

To locate files, modules, controllers, assets, and components in the monorepo:

- **Read**: [project_structure.md](file:///home/ubuntu/Documents/PC-Builder/.agents/project_structure.md)

## 3. General Coding Conventions

For guidelines on TypeScript formatting, design aesthetics, API integration, styling rules (Vanilla CSS), and error boundaries:

- **Read**: [coding_conventions.md](file:///home/ubuntu/Documents/PC-Builder/.agents/coding_conventions.md)

## 4. Part Naming & Database Mapping Conventions

For conventions on unique identifiers (`code_name`), slug generation (`generateSlug`), and discrete key mappings:

- **Read**: [naming_mapping.md](file:///home/ubuntu/Documents/PC-Builder/.agents/naming_mapping.md)

---

## 5. Sub-Folder Domain Instructions

### Backend (NestJS & Sequelize)

For NestJS module organization, guards, custom middlewares, database migrations, and Sequelize option templates:

- **Browse**: [.agents/backend/](file:///home/ubuntu/Documents/PC-Builder/.agents/backend/)

### Frontend (Next.js & Tailwind)

For route page layout design, reusable UI components, and state management hooks:

- **Browse**: [.agents/frontend/](file:///home/ubuntu/Documents/PC-Builder/.agents/frontend/)
