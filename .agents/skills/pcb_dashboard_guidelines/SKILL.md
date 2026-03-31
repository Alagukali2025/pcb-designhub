---
name: pcb_dashboard_guidelines
description: Core guidelines and project standards for the PCB Masterclass Dashboard
---

# PCB Dashboard Professional Guidelines

This document outlines the core principles and standards that MUST be followed when working on the PCB Masterclass Dashboard project.

## 1. Git Workflow & Branch Management
- **Branch Restriction**: ALWAYS work only in the current git branch.
- **No Merging**: Never attempt to merge branches (including merging into main/master) without explicit instructions from the USER.
- **Current Branch**: `footprint-creation`

## 2. Design System & SSOT
- **Single Source of Truth**: All UI components and styles must follow the established design system to maintain a Single Source of Truth (SSOT).
- **Styling**: Use the existing design tokens in `src/index.css` and `src/App.css`.
- **Consistency**: Ensure all new components mirror the aesthetic of the existing `ContentViewer`, `Dashboard`, and `Header`.

## 3. Fact-Based Development (No Assumptions)
- **Research First**: Before implementing a feature or fixing a bug, perform thorough research.
- **Evidence-Based**: All changes must be backed by facts and evidence from the codebase or project documentation.
- **Querying**: If the intent of a piece of code is unclear, research its usage across the project before making changes.

## 4. Professional Folder Structure
- **Organization**: Maintain a clean and organized folder structure.
- **Component Placement**: All new UI components should be placed in `src/components/`.
- **Data Management**: Any static data or content should be managed in `src/data/`.
- **Assets**: Keep images and static assets in `src/assets/`.
- **Naming Conventions**: Use PascalCase for React components and camelCase for logic/utility files.

## Project Context
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Global and Component-based)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

## Project Learnings & Discoveries

### Architecture & Data
- **Centralized Content**: The `src/data/modules.js` file is the Single Source of Truth for all module content. Any updates to course material should happen here.
- **Content Component (`ContentViewer.jsx`)**:
    - **Progress Tracking**: Uses a sticky `.reading-progress-bar` at the top of the page-content.
    - **TOC Navigation**: Implements an `IntersectionObserver` to highlight the active section in the right-hand Table of Contents.
    - **Interactive Elements**: Includes a "Milestone Checklist" with session-based local state tracking.
- **Dashboard Component (`Dashboard.jsx`)**: Uses a grid layout with dynamic animation delays based on module index for a smooth entrance effect.

### Design System (Vanilla CSS)
- **Color Palette**: Dark mode foundation using Slate (`#0f172a`) and Blue/Sky accents.
- **Tokens**: Extensive use of CSS variables (e.g., `--bg-primary`, `--accent-primary`) in `src/index.css`.
- **Layout Integrity**:
    - Fixed Sidebar width: `280px`.
    - Main scroll container: `.page-content`.
    - Content Layout: Uses CSS Grid with `minmax(0, 1fr) 280px` (Reading column + TOC) on desktop.
    - Sticky Elements: Back button and progress bar have `sticky` positioning with blur backgrounds.

### Development Environment
- **Shell**: The user prefers `zsh` with `Oh My Zsh`.
- **Branch**: Currently on `footprint-creation`.
- **Dependencies**: React 19, Vite, Lucide-React for icons.

### Source Materials
- **Footprint Guides**: `pcb_footprint_guide.html` and `IPC_PCB_Footprint_Design_Guide.pdf` in the root directory serve as the primary reference for technical data and standards used in the modules.
