export const content = {
  intro: "Design for Manufacturing (DFM) and Design for Testing (DFT) ensure your board can be built reliably and repeatably at target cost while verifying every critical net. Grounded in IPC-A-610, IPC-2221B, and IPC-7351B, this module covers fabrication physics, assembly processes, and test strategies for production.",
  sections: [
    {
      heading: "The Business Case: Yield, DPMO & Cost of Quality",
      content: "In volume production, Yield and Defects Per Million Opportunities (DPMO) define profitability. Cost of Quality (CoQ) encompasses prevention, appraisal, internal failures (scrap), and external failures (field returns).",
      table: {
        headers: ["Metric", "Typical IPC Class 2", "Automotive 6-Sigma Target"],
        rows: [
          ["First-Pass Yield (FPY)", "92% - 95%", "> 99.7%"],
          ["DPMO", "500 - 1000", "< 3.4"],
          ["Rework Rate", "5% - 8%", "< 0.3%"]
        ]
      },
      alerts: [
        { type: 'info', text: "The Rule of 10s: It costs $10 to find a defect at board test, $100 at system integration, and $1000+ in the field. DFM/DFT shifts defect detection to the lowest cost stage." }
      ]
    },
    {
      heading: "IPC Classification Framework (Class 1 / 2 / 3)",
      content: "IPC classifications define the severity of inspection criteria and allowable manufacturing tolerances. Selecting the correct class impacts board cost by 20% to 50%.",
      table: {
        headers: ["Classification", "Description", "Tolerances", "Typical Application"],
        rows: [
          ["Class 1 (General)", "Function is main requirement. Cosmetic defects acceptable.", "Loose (breakout allowed)", "Consumer electronics, toys"],
          { type: 'highlight', data: ["Class 2 (Dedicated)", "Uninterrupted service desired. Extended life required.", "Moderate (90° breakout)", "Industrial, telecom, computers"] },
          ["Class 3 (High-Rel)", "Downtime unacceptable. Extreme environments.", "Strict (Zero breakout)", "Aerospace, medical, military"]
        ]
      }
    },
    {
      heading: "Fabrication Physics & Etch Factor Engineering",
      content: "PCB fabrication relies on photolithography and chemical etching. Layout geometry directly impacts etching consistency, plating integrity, and the risk of shorts or opens.",
      mistakeList: [
        { mistake: "Acid Traps (Acute Angles)", fix: "Use 45° or rounded corners. Acute angles (<90°) trap etchant, leading to over-etching." },
        { mistake: "Copper Slivers", fix: "Avoid thin wedges of copper (<8 mil) which can flake off during processing and cause intermittent shorts." },
        { mistake: "Copper Starving", fix: "Ensure adequate clearance around isolated pads in copper pours to prevent localized etching variations." },
        { mistake: "Tombstoning via Copper Imbalance", fix: "Ensure symmetric thermal mass on both pads of small passives (0402, 0201) to prevent unequal wetting forces." },
        { mistake: "Teardrops Missing", fix: "Apply teardrops to all via-to-trace junctions to improve mechanical strength and mitigate drill registration errors." }
      ]
    },
    {
      heading: "Drill & Via DFM (Aspect Ratio, Drill-to-Copper, Via-in-Pad)",
      standard: {
        title: "IPC-4761",
        note: "✅ Design Guide for Protection of Printed Board Via Structures."
      },
      content: "Drill registration tolerances and plating fluid dynamics dictate via reliability. Aspect ratios must align with fabricator capabilities.",
      table: {
        headers: ["Parameter", "Standard Fab", "Advanced Fab (HDI)", "IPC Class 3 Target"],
        rows: [
          ["Max Aspect Ratio", "8:1 to 10:1", "12:1 (Seq. Lam)", "≤ 8:1 (Preferred)"],
          ["Min Drill-to-Copper", "0.25mm (10 mil)", "0.15mm (6 mil)", "≥ 0.20mm (8 mil)"],
          ["Annular Ring Min", "0.10mm (4 mil)", "0.075mm (3 mil)", "0.05mm (Zero breakout)"]
        ]
      },
      ruleCards: [
        {
          number: "01",
          title: "Via-in-Pad Plated Over (VIPPO)",
          severity: "warning",
          body: "When placing vias in BGA pads, specify IPC-4761 Type VII (Filled and Capped). Unfilled vias will wick solder away from the joint, causing opens."
        }
      ]
    },
    {
      heading: "Solder Paste & Stencil Engineering (IPC-7525)",
      standard: {
        title: "IPC-7525B",
        note: "✅ Stencil Design Guidelines."
      },
      content: "The stencil controls 70% of SMT defects. The Area Ratio (AR) determines if solder paste will release cleanly from the stencil aperture.",
      alerts: [
        { type: 'danger', text: "Area Ratio = Area of Opening / Area of Aperture Walls. For successful paste release, Area Ratio MUST be ≥ 0.66." }
      ]
    },
    {
      heading: "Component Placement Rules",
      content: "Physical placement must account for automated assembly constraints, reflow shadowing, and rework access.",
      filletGrid: [
        {
          title: "Clearance Constraints",
          color: "blue",
          list: [
            { label: "Edge Clearance", text: "Min 5mm for breakaway tabs, 2mm for V-score." },
            { label: "Component-to-Component", text: "Min 0.5mm (20 mil) for standard pick-and-place access." },
            { label: "Connector Keepouts", text: "Leave tool access zones around mating connectors." }
          ]
        },
        {
          title: "Process Constraints",
          color: "cyan",
          list: [
            { label: "Reflow Shadowing", text: "Keep small passives away from tall components (e.g., electrolytic caps) to ensure even IR heating." },
            { label: "Wave Solder Orientation", text: "Align SOIC/QFP pins parallel to the wave direction to prevent bridging." }
          ]
        }
      ]
    },
    {
      heading: "Creepage vs. Clearance — Design Decision",
      content: "Clearance and creepage address different failure modes: Air breakdown vs. Surface tracking. This determines safe spacing between high-voltage nets.",
      filletGrid: [
        {
          title: "Clearance (Air)",
          color: "blue",
          list: [
            { label: "Definition", text: "Shortest distance through air." },
            { label: "Failure", text: "Arc discharge / flashover." },
            { label: "Standard", text: "IPC-2221B Table 6-1." }
          ]
        },
        {
          title: "Creepage (Surface)",
          color: "orange",
          list: [
            { label: "Definition", text: "Shortest distance along surface." },
            { label: "Failure", text: "Surface tracking." },
            { label: "Standard", text: "IEC 62368-1." }
          ]
        }
      ]
    },
    {
      heading: "Electrical Clearance & Creepage (IPC-2221B)",
      standard: {
        title: "IPC-2221B (2012)",
        note: "⚠️ Note: High-voltage creepage is also governed by IEC 62368-1."
      },
      content: "Minimum conductor spacing is determined by the working voltage difference between conductors and the operating environment. IPC-2221B Table 6-1 defines clearance (through air) while creepage (along surfaces) is governed by pollution degree per IEC 62368-1.",
      table: {
        headers: ["Voltage (DC/AC Peak)", "B1 — Internal (mil)", "B2 — Ext. Uncoated (mil)", "B3 — Coated (mil)", "B4 — >3050m Alt. (mil)"],
        rows: [
          ["0–15 V", "2.0", "4.0", "0.8", "4.0"],
          ["16–30 V", "2.0", "4.0", "0.8", "4.0"],
          ["31–50 V", "4.0", "8.0", "1.5", "8.0"],
          ["51–100 V", "4.0", "8.0", "2.0", "8.0"],
          { type: 'highlight', data: ["101–150 V", "8.0", "16.0", "4.0", "16.0"] },
          ["151–170 V", "8.0", "20.0", "4.0", "20.0"],
          ["171–250 V", "8.0", "30.0", "4.0", "30.0"],
          ["251–500 V", "16.0", "60.0", "8.0", "60.0"]
        ]
      },
      alerts: [
        { type: 'warning', text: "These values are for IPC-2221B. Safety-critical products (mains, medical, automotive) MUST also comply with IEC 62368-1/60950 requirements." },
        { type: 'info', text: "B1 = Internal. B2 = External (std). B3 = Coated. B4 = High-altitude derating (>3050m)." }
      ]
    },
    {
      heading: "Assembly & Thermal Profiles (J-STD-020 MSL)",
      standard: {
        title: "IPC/JEDEC J-STD-020F",
        note: "✅ Moisture/Reflow Sensitivity Classification."
      },
      content: "Moisture trapped in plastic packages expands rapidly during reflow, causing 'popcorning'. Components are assigned a Moisture Sensitivity Level (MSL) dictating their floor life out of the dry bag.",
      table: {
        headers: ["MSL Level", "Floor Life (at ≤30°C/60% RH)", "Action if Exceeded"],
        rows: [
          ["MSL 1", "Unlimited", "None"],
          ["MSL 3", "168 Hours", "Bake at 125°C before reflow"],
          ["MSL 5a", "24 Hours", "Bake and re-seal immediately if unused"]
        ]
      }
    },
    {
      heading: "Surface Finish Decision Matrix",
      standard: {
        title: "IPC-4552B / IPC-4553A",
        note: "✅ Performance specifications for PCB surface finishes."
      },
      content: "Surface finish selection determines shelf life, solderability, and flatness. Storage conditions significantly impact actual shelf life.",
      table: {
        headers: ["Finish", "Shelf Life", "Flatness", "Best For..."],
        rows: [
          ["ENIG (Gold)", "12+ Months", "Excellent", "Fine-pitch BGA, Lead-free"],
          ["Lead-Free HASL", "6-12 Months", "Fair", "General purpose RoHS"],
          { type: 'highlight', data: ["OSP (Organic)", "3-6 Months", "Excellent", "Consumer electronics, Copper-heavy designs"] },
          ["Immersion Silver", "3-6 Months (Sealed)", "Excellent", "High-speed links (>10 GHz)"],
          ["ENEPIG", "12+ Months", "Excellent", "Gold wire bonding, High-Rel"]
        ]
      },
      alerts: [
        { type: 'info', text: "Skin Effect Warning: At frequencies above 10 GHz, Immersion Silver or OSP are preferred over ENIG due to the magnetic properties of the Nickel layer, which increases insertion loss." }
      ]
    },
    {
      heading: "Panelization & Fiducial Strategy",
      content: "Individual boards are arrayed in panels for assembly. Depaneling introduces mechanical stress that must be mitigated.",
      table: {
        headers: ["Method", "Component Clearance", "Depanel Stress", "Board Shape"],
        rows: [
          ["V-Score", "2.0mm (80 mil)", "Moderate (Shear)", "Rectangular Only"],
          { type: 'highlight', data: ["Tab-Routing (Breakaway)", "5.0mm (Tab zone)", "Low (if routed)", "Irregular Shapes"] },
          ["Laser Depanel", "0.2mm", "Near Zero", "Any Shape / High Precision"]
        ]
      },
      alerts: [
        { type: 'danger', text: "Place 3 global fiducials (non-colinear) on the panel rails. Camera alignment fails if fiducials are in a single line." }
      ]
    },
    {
      heading: "Silkscreen & Legend Design",
      content: "Silkscreen provides critical assembly and debug information, but poor design can cause fab defects.",
      mistakeList: [
        { mistake: "Silkscreen on Pads", fix: "Ensure all silkscreen is clipped from exposed copper. Ink on a pad guarantees a solder defect." },
        { mistake: "Unreadable Text", fix: "Maintain min line width of 5 mil and character height of 32 mil (0.8mm)." },
        { mistake: "Missing Polarity", fix: "Clearly mark Pin 1, diode cathodes, and capacitor polarity visible AFTER component placement." }
      ]
    },
    {
      heading: "DFT Architecture: ICT, JTAG, Flying Probe, AOI",
      content: "A comprehensive DFT strategy combines multiple methods to maximize fault coverage.",
      filletGrid: [
        {
          title: "In-Circuit Testing (ICT)",
          color: "blue",
          list: [
            { label: "Target", text: "High volume, fast cycle time." },
            { label: "Requirement", text: "Min 0.75mm (30mil) test points on 100mil/50mil grid." },
            { label: "Coverage", text: "Finds shorts, opens, missing parts, wrong values." }
          ]
        },
        {
          title: "Boundary Scan (JTAG)",
          color: "cyan",
          list: [
            { label: "Target", text: "Complex digital ICs (BGAs)." },
            { label: "Requirement", text: "IEEE 1149.1 TAP interface (TMS, TCK, TDI, TDO) chained properly." },
            { label: "Coverage", text: "Probes nets under BGAs without physical access." }
          ]
        },
        {
          title: "Flying Probe",
          color: "amber",
          list: [
            { label: "Target", text: "Prototypes, low volume, high density." },
            { label: "Requirement", text: "Access to component pads or vias (no fixture needed)." },
            { label: "Coverage", text: "Slow execution, but requires minimal upfront tooling cost." }
          ]
        },
         {
          title: "AOI / AXI Inspection",
          color: "purple",
          list: [
            { label: "Target", text: "Optical (AOI) and X-Ray (AXI) verification." },
            { label: "Requirement", text: "Clear fiducials, thermal balance for low voiding under BGAs." },
            { label: "Coverage", text: "Catches placement errors, solder bridging, and BGA voids." }
          ]
        }
      ]
    },
    {
      heading: "Zero-Orientation, Centroid & Pick-and-Place Data",
      standard: {
        title: "EIA-481 & IPC-7351B",
        note: "✅ Standard for Tape and Reel / Component Zero Orientation."
      },
      content: "Automated assembly requires precise Pick-and-Place (PnP) or Centroid files. Standardizing the zero-degree orientation prevents components from being placed backward.",
      alerts: [
        { type: 'info', text: "Always define Pin 1 in the top-left for SOIC/QFP at 0° rotation (IPC-7351B Level B). The centroid file must list X, Y, Rotation, Layer, and Reference Designator." }
      ]
    },
    {
      heading: "Design for Inspection (AOI / AXI)",
      content: "Design choices dictate how effectively automated cameras and X-rays can find defects.",
      ruleCards: [
        {
          number: "01",
          title: "Fiducial Contrast",
          severity: "warning",
          body: "Ensure 2mm solder mask clearance around 1mm solid copper fiducials. AOI cameras rely on the high contrast between shiny copper/finish and dark mask."
        },
        {
          number: "02",
          title: "BGA Voiding Visibility",
          severity: "danger",
          body: "Avoid placing dense components or heavy copper pours on the bottom side directly under a BGA. This obscures AXI (X-Ray) inspection of the BGA solder balls."
        }
      ]
    },
    {
      heading: "Interactive: Real-Time DFM Rule Checker",
      standard: {
        title: "IPC-2221B / IPC-6012E / IPC-7525",
        note: "✅ Combined limits for Design, Qualification, and Stencil Engineering."
      },
      content: "Validate your design parameters against industrial limits. This engine provides instant feedback on aspect ratio, annular rings, solder mask dams, and stencil area ratios.",
      type: 'dfm-checker'
    }
  ],
  checklists: [
    {
      category: "Fabrication Sign-Off",
      items: [
        "Laminate selection (Tg/Td) verified for Lead-Free reflow.",
        "Min Annular Ring verified across all via layers (Class 2/3 limits).",
        "Aspect Ratio (Board Thickness / Smallest Drill) within fab limits.",
        "No acute acid traps (<90°) present in signal routing.",
        "Copper-to-board-edge clearance verified (≥ 0.5mm).",
        "Drill-to-copper clearance verified on internal layers (≥ 0.2mm).",
        "Minimum trace/space verified against fab capability matrix.",
        "Teardrop pads applied to all via-to-trace junctions.",
        "Negative/positive plane clearances verified (anti-pad sizing)."
      ]
    },
    {
      category: "Assembly & SMT Readiness",
      items: [
        "Global fiducials (3) placed non-colinearly on panel rails.",
        "Components ≥ 5mm from breakaway tab perforations.",
        "Solder mask dams verified for all fine-pitch ICs based on pitch.",
        "Via-in-Pad locations specified as IPC-4761 Type VII (Filled/Capped).",
        "Polarized components (Diodes, ICs) clearly silkscreened.",
        "Stencil aperture area ratio ≥ 0.66 for all fine-pitch pads.",
        "Component-to-component spacing ≥ 0.5mm (pick-and-place clearance).",
        "Reflow shadow analysis checked for tall components near small passives.",
        "MSL-rated components identified with floor-life tracking.",
        "All silkscreen clipped from exposed copper pads."
      ]
    },
    {
      category: "DFT & Test Readiness",
      items: [
        "Test points assigned to critical nets (PWR, GND, Reset, JTAG).",
        "Test point grid ≥ 1.27mm (50mil) for standard ICT fixture.",
        "IEEE 1149.1 (JTAG) chain logic verified (TDO -> TDI chain).",
        "Zero solder mask or silkscreen coverage on test point pads.",
        "Flying probe access verified (no test points under components).",
        "AOI fiducial contrast verified (bright copper on dark mask).",
        "BGA X-ray inspection access verified (no dense copper underneath).",
        "Functional test connector location defined on panel rails or edge."
      ]
    }
  ]
};
