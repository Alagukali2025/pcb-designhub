# PCB Dashboard Developer Guidelines

This file contains the instructions for the AI coding assistant (Antigravity) to follow for this project.

1. **Git Branch Management**: 
   - Only work in the current git branch: `footprint-creation`.
   - Always wait for user instruction before merging any branches.

2. **Design System (SSOT)**: 
   - Follow the established design system in `src/index.css` and `src/App.css` to achieve a Single Source of Truth (SSOT).
   - Maintain visual consistency across all components.

3. **Research-Driven Development**: 
   - Do not make assumptions.
   - Perform thorough research using the available tools before making changes.
   - Always base implementations on facts and evidence found in the codebase.

4. **Professional Folder Structure**: 
   - Maintain a clean and organized folder hierarchy.
   - New components go in `src/components/`.
   - Content and data stay in `src/data/`.
   - Assets go in `src/assets/`.

## Project Learnings (Technical Reference)

- **Source of Truth**: All course content is central in `src/data/modules.js`.
- **Core Component Patterns**:
    - `ContentViewer.jsx`: Uses `IntersectionObserver` for Table of Contents and manual `scroll` events for the sticky reading progress bar.
    - `Dashboard.jsx`: Features a grid of module cards with staggered `slide-up` animations.
- **Design Tokens**: Standardized in `src/index.css` using Slate/Blue variables (e.g., `--bg-primary`, `--accent-primary`).
- **Layout Logic**:
    - Sidebar width is fixed at `280px`.
    - Content is displayed in a 2-column or 3-column setup (Navigation | Content | TOC).
    - Uses `sticky` positioning with background blur for headers and progress trackers.
- **Environment**: Development is strictly on the `footprint-creation` branch; shell is `zsh`.

---
*Note: This file is mirrored in `.agents/skills/pcb_dashboard_guidelines/SKILL.md` for internal system usage.*
