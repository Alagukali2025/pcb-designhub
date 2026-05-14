export const content = {
  intro: "A professional PCB design is only as good as its release package. This system provides a Single Source of Truth for manufacturing outputs, bridging the gap between CAD design intent and physical production reality. From legacy Gerber RS-274X to modern IPC-2581 digital twins, this module ensures zero-defect handoffs to fab and assembly houses.",
  sections: [
    {
      heading: "Fabrication Output Files (Gerber & Drill)",
      content: "Fabrication files define the copper, mask, and drill coordinates. While Gerbers are the standard, the version and metadata you choose can determine the speed and accuracy of your CAM setup.",
      table: {
        headers: ["Layer Type", "Standard Ext.", "Critical Expert Note", "Risk Level"],
        rows: [
          ["Top/Bottom Copper", ".GTL / .GBL", "Ensure no unconnected copper ('dead copper').", "High"],
          ["Inner Copper (L2-Ln)", ".G1, .G2...", "Verify layer ordering (e.g., L2=G1, L3=G2). #1 source of fab errors.", "Critical"],
          ["Solder Mask", ".GTS / .GBS", "Check mask dams for fine-pitch parts (min 3 mil NSMD).", "Critical"],
          ["Paste Mask", ".GTP / .GBP", "Must be included for all SMT boards. Usually a 1:1 pad ratio by default.", "High"],
          ["Silkscreen", ".GTO / .GBO", "Clip silk from pads to prevent solderability failure.", "Med"],
          ["Board Outline", ".GKO/.GM1/.Edge_Cuts", "Must be a continuous, closed 0-width polygon. Use %TO.FileFunction,Profile*% in X2.", "High"],
          ["Fabrication Drawing", ".GD1/.GM2", "Must contain drill table, material specs, and tolerances. Vital for DFM.", "Critical"]
        ]
      },
      alerts: [
        { type: "warning", text: "Annular Ring Standards: Never assume a standard 'minimum' without checking IPC classes. IPC-6012 Class 2 minimum finished annular ring is 2.0 mil (0.05mm). Class 3 is 3.0 mil minimum. Designing to 5 mil provides a good DFM yield margin, but it is not the standard minimum." },
        { type: "info", text: "Expert Tip: Use Gerber X2 or X3. They embed layer function and polarity metadata in the header, eliminating the 'Negative Plane' inversion errors common in legacy RS-274D/X flows." }
      ]
    },
    {
      heading: "NC Drill Precision (CNC Instructions)",
      content: "The Excellon drill file is a set of CNC coordinates. A single mismatch in units or zero suppression can ruin an entire production batch.",
      cards: [
        {
          title: "Zero Suppression (Metric)",
          text: "Always use Leading Zero Suppression (LZ) for metric drill files. 'Trailing' zero suppression is a legacy US-inch practice and can cause massive coordinate scaling errors if misinterpreted."
        },
        {
          title: "PTH vs. NPTH",
          text: "Separate Plated-Through Holes from Non-Plated Holes. Plated holes are drilled BEFORE lamination/plating and are oversized to account for copper thickness. NPTH are drilled AFTER."
        },
        {
          title: "HDI & Sequential Lamination",
          text: "Blind and Buried vias require separate drill files for each lamination cycle (e.g., L1-L2, L2-L3). Failing to export these separately makes the board impossible to build."
        }
      ],
      codeBlock: "M48\nMETRIC,LZ\nT01C0.300\nT02C1.000\n%\nG05\nT01\nX025400Y018300\nX026500Y019200\nM30\nIPC-NC-349 / EXCELLON FORMAT 2 HEADER"
    },
    {
      heading: "Assembly & Placement Engineering",
      content: "Beyond the BOM, the Pick-and-Place (Centroid) and Solder Paste (Stencil) files determine the quality of your SMT process.",
      list: [
        "<strong>PnP Origin & Rotation:</strong> Centroids must use the geometric centroid (component origin per IPC-7351B). Orientation (0°) should follow the LP standard for tape-and-reel compatibility.",
        "<strong>Stencil Area Ratio:</strong> For small pads (0201 or BGA), ensure Area Ratio ≥ 0.66 and Transfer Efficiency ≥ 75% (IPC-7525) to ensure consistent solder release.",
        "<strong>Global Fiducials:</strong> Include 3 global fiducials (1.0mm pad, 2.0mm mask opening) in a non-collinear arrangement for robotic alignment.",
        "<strong>Local Fiducials:</strong> Place 2 local fiducials diagonally across large, fine-pitch components (e.g., 0.4mm pitch BGAs or QFPs) to correct for local PCB stretch."
      ]
    },
    {
      heading: "Advanced Formats: ODB++ & IPC-2581",
      content: "Intelligent data formats eliminate the mess of dozens of loose files by packaging everything—stackup, netlist, and components—into a single database.",
      table: {
        headers: ["Format", "Owner", "Advantage", "Expert Verdict"],
        rows: [
          ["Gerber RS-274X", "Open", "Universal compatibility", "Lacks metadata; prone to errors"],
          ["Gerber X2", "Ucamco", "Embedded layer metadata", "Modern Standard; widely adopted"],
          ["ODB++", "Siemens EDA", "Comprehensive DB; widely used", "Proprietary but solid industry standard"],
          ["IPC-2581", "IPC (Consortium)", "Open standard; netlist intelligence", "Powerful, but fab adoption is still growing (~30%)"],
          ["Genesis 2000", "Frontline PCB", "Native format for many Asian fabs", "Crucial to understand for high-volume Asia mfg"]
        ]
      }
    },
    {
      heading: "Intelligent Handover: The IPC-2581 'Digital Twin'",
      content: "IPC-2581 (DPMX) is more than a file format; it is a standardized XML data model that represents the board's 'Digital Twin'. It bridges the gap between design CAD and factory CAM systems.",
      filletGrid: [
        {
          title: "What's Inside IPC-2581?",
          color: "blue",
          list: [
            { label: "Layer Stackup", text: "Material names, Dk/Df, and copper weights are explicitly defined." },
            { label: "Netlist", text: "Full intelligent netlist for automated optical and electrical testing." },
            { label: "BOM & PnP", text: "Component part numbers and XY coordinates for placement." }
          ]
        },
        {
          title: "Why it Beats Gerbers",
          color: "green",
          list: [
            { label: "Ambiguity", text: "Zero. Gerbers are 'dumb' images; IPC-2581 is 'smart' data." },
            { label: "Automation", text: "Streamlines CAM setup for fabs that fully support the standard." },
            { label: "Yield", text: "Eliminates human error in layer ordering and polarity assignment." }
          ]
        }
      ],
      alerts: [
        { type: 'info', text: "Adoption Reality Check: While IPC-2581 Revision C is a comprehensive standard, universal fab adoption is still a work in progress. Always verify with your CM if their CAM systems (like Valor or Genesis) fully support your IPC-2581 export before abandoning Gerbers." }
      ]
    },
    {
      heading: "CAD-Specific Export Workflows",
      content: "Follow these tool-specific steps to ensure a compliant release package.",
      twoColumnGrid: [
        {
          badge: "Altium Designer",
          badgeClass: "tool-badge-altium",
          title: "OutJob File Method",
          items: [
            "Use an .OutJob file for synchronized, repeatable exports.",
            "Export → Fabrication Outputs → Gerber X2.",
            "Export → Assembly Outputs → Generates Pick and Place File.",
            "Verify 'Advanced' tab: 2:4 or 2:5 resolution for high precision."
          ]
        },
        {
          badge: "KiCad",
          badgeClass: "tool-badge-kicad",
          title: "Plot & Drill Generation",
          items: [
            "File → Fabrication Outputs → Gerbers (.gbr).",
            "Ensure 'Use extended X2 format' is checked.",
            "Generate Drill Files: Use 'Map File' and 'Excellon' formats.",
            "Check 'PTFE/NPTH in single file' only if your fab requests it."
          ]
        },
        {
          badge: "Cadence Allegro",
          badgeClass: "tool-badge-cadence",
          title: "Artwork Control Flow",
          items: [
            "Run 'DB Doctor' before export to fix net shorts/dangling traces.",
            "Manufacture → Artwork: Define Film Records.",
            "Manufacture → NC → NC Drill: Set Header & Units.",
            "Ensure 'Undefined Line Width' is NOT zero to avoid missing traces."
          ]
        }
      ]
    },
    {
      heading: "Common Manufacturing Risks",
      content: "Seasoned engineers design to avoid these common 'gotchas' that cause yield drops.",
      mistakeList: [
        { mistake: "Acid Traps (Acute Angles)", fix: "Ensure trace-to-trace entry angles are ≥90°. While modern CAM auto-corrects signal traces, acute angles on internal planes can still trap etchant." },
        { mistake: "Copper Slivers", fix: "Perform a 'Sliver Check' in CAM. Slivers < 3 mil (IPC-A-600) can peel off during fab and short nearby nets." },
        { mistake: "Missing Netlist (IPC-D-356)", fix: "Always include the netlist! Without it, the fab cannot perform electrical test (ET) against your design intent." },
        { mistake: "Stencil Thermal Bridging", fix: "Apply 40-60% 'Windowpane' reduction to large thermal pads. For mixed-pitch boards, consider step stencils or electroformed stencils." },
        { mistake: "Bow and Twist", fix: "Uneven copper distribution causes warping during reflow. Balance copper pours. Ensure Bow & Twist ≤ 0.75% for SMT boards per IPC-6012." }
      ]
    },
    {
      heading: "Standard Release Package (Directory Structure)",
      content: "A professional release should be structured to allow automated CAM scripts to parse the data without manual intervention.",
      codeBlock: "PROJECT_NAME_REV_A/\n├── Fabrication/          ; Gerbers, Drill, Rout/Slot, Fab Drawing\n├── Assembly/             ; PnP, BOM, Asm Drawing, Paste Mask\n├── Test/                 ; IPC-D-356, ICT/Flying Probe, BSDL\n└── Documentation/        ; Schematics, Stackup Confirm, Notes",
      list: [
        "<strong>Revision Control:</strong> Always append the revision (e.g., _REV_A or _ECO_001). Sending un-versioned files is a catastrophic risk in production.",
        "<strong>Naming:</strong> PROJECT_LAYER_v1.0_YYYYMMDD. Use underscores; avoid spaces which break CAM scripts.",
        "<strong>Integrity:</strong> Include an MD5 or SHA-256 checksum for the ZIP archive to verify transmission integrity.",
        "<strong>Fab DFM Loop:</strong> The release doesn't end at sending the ZIP. Allocate 24-48 hours for the fab's CAM engineers (EQs/Engineering Queries) to review and request clarifications."
      ]
    },
    {
      heading: "Technical Appendix: Test & PnP Metadata",
      content: "For engineers integrating with automated factories (Lights-out manufacturing).",
      table: {
        headers: ["Metadata Type", "Format/Record", "Precision Requirement"],
        rows: [
          ["Bare Board Netlist", "IPC-D-356A", "Through-hole/SMT pad coordinates (Superseded by IPC-2581 for new designs)"],
          ["Centroid (PnP)", "CSV/Text", "X, Y, Rotation (Degrees), Side (Top/Bot)"],
          ["In-Circuit Test (ICT)", "Various", "Fixture netlist format for bed-of-nails testing"],
          ["Flying Probe", ".fp / vendor specific", "Coordinate program for fixtureless bare-board testing"],
          ["AOI Reference", "CAD Import / ODB++", "Component bounding boxes and polarity for optical inspection"],
          ["BSDL", "IEEE 1149.1", "JTAG chain description (Provided by the IC Manufacturer)"]
        ]
      }
    },
    {
      heading: "Interactive: Manufacturing Release Simulator",
      content: "Execute a virtual production release flow that performs professional-grade DFM and metadata checks on your export package.",
      type: "output-simulator"
    }
  ],
  checklists: [
    {
      category: "1. Baseline Verification (Industrial Standards)",
      items: [
        "All inner copper layers exported and layer order explicitly documented.",
        "Paste mask files included for SMT boards.",
        "NC Drill file uses metric units and Leading Zero (LZ) suppression.",
        "Board outline (profile) is included and sized correctly.",
        "BOM exported with MPNs and Correct Quantities."
      ]
    },
    {
      category: "2. Engineering Integrity (Physics & Simulation)",
      items: [
        "Gerber X2/X3 used; metadata and polarity (positive/negative) verified in CAM viewer.",
        "IPC-D-356 Netlist matches the Gerber artwork 100%.",
        "PnP rotation verified against IPC-7351B tape-and-reel standards.",
        "Mask dams verified for fine-pitch BGAs (≥ 3 mil NSMD)."
      ]
    },
    {
      category: "3. High-Yield Manufacturing & Reliability",
      items: [
        "Board bow and twist verified to be ≤ 0.75% (IPC-6012 limit).",
        "Acute angle acid traps eliminated via teardrops/chamfers.",
        "Sliver check performed; min copper feature > 3 mil.",
        "Thermal pad stencil reduction (40-60%) applied to all QFNs.",
        "Fab Drawing specifies drill tolerance, material, Tg rating, impedance targets, and finish."
      ]
    }
  ]
};
