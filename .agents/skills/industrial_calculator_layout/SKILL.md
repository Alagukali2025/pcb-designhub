---
name: industrial_calculator_layout
description: Standards for the "Great" Industrial Calculator Layout approved by the user.
---

# Industrial Calculator Layout Guideline

This skill defines the structural and visual standards for all engineering calculators within the PCB Design Hub. Adherence to these guidelines ensures a consistent, professional, and industrial-grade user experience.

## 1. Core Structural Layout
Every calculator must follow the **Two-Column Layout Module**:

- **Header**:
    - `bg-primary` container with a clean icon (`Zap`, `Calculator`, etc.).
    - Title (e.g., "Zdiff Engine") and Subtitle (Engineering Protocol).
    - Top-level Switches (e.g., "Refined Math") and Topology Toggles (Microstrip/Stripline).
- **Body Section** (`display: grid` or flex-based 2-column):
    - **Left Column (Analysis)**:
        - **Interactive Diagram**: High-fidelity SVG cross-section inside a `zdiff-diagram-box`.
        - **Input Grid**: 2-column grid of numeric inputs with clear parameter labels (H, W, S, T, Dk).
    - **Right Column (Intelligence)**:
        - **Hero Result Card**: Large, monospaced primary value (e.g., 50.0Ω) followed by a 4-item sub-grid of secondary metrics (Prop Delay, Eff Dk, coupling).
        - **Design Verdict**: A high-contrast alert box (`zdiff-verdict`) providing technical feedback.
        - **Presets**: A quick-selection grid for industrial standards (USB, PCIe, HDMI).

## 2. Visual System
- **Contrast**: Use project-native CSS variables for themed backgrounds. Avoid utility classes that cause "white-background" regressions.
- **Color Palette**:
    - **Solder Mask Green**: `#1a6b3a` (Primary foundation/indicators).
    - **Copper Gold/Orange**: `#c87533` or `#f59e0b` (Active traces/primary results).
- **Typography**:
    - Monospaced fonts for all numeric values and formulas.
    - Bold, uppercase tracking for labels and technical badges.

## 3. UI/UX Principles
- **Immediate Feedback**: Results must update in real-time as inputs change.
- **Standards Driven**: Always provide an "Engineering Reference" or "IPC Docs" popover.
- **Cleanliness**: No neon glows, holographic console aesthetics, or over-engineered animations unless explicitly requested.

## 4. CSS Classes
Always utilize the optimized `zdiff-` class suite defined in `index.css`:
- `.zdiff-calc`, `.zdiff-header`, `.zdiff-body`
- `.zdiff-left`, `.zdiff-right`
- `.zdiff-input-grid`, `.zdiff-result-card`
- `.zdiff-presets-box`
