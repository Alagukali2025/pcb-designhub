export const content = {
  intro: "Advanced routing for Flex, Rigid-Flex, and HDI designs is governed by strict mechanical physics and microvia fabrication limits. This module provides authoritative engineering guidelines anchored in IPC-2223D (Flex/Rigid-Flex) and IPC-2226 (HDI). Master these CAD-level layout strategies to prevent flex circuit fracturing under dynamic bending and to successfully escape ultra-fine-pitch BGA packages using sequential lamination architectures.",
  sections: [
    {
      heading: "Flex Routing Fundamentals",
      type: "cross-ref",
      refModuleId: "stackup",
      refTargetHeading: "Flex PCB Fundamentals (IPC-2223D)",
      refLabel: "Review Flex Stackup & Materials →",
      refDesc: "A robust flex layout starts with the correct material selection. Review polyimide substrates, coverlay rules, and flex stackup construction in the Stackup module."
    },
    {
      heading: "Material Science: RA vs. ED Copper",
      content: "The choice of copper foil is the single most critical material decision for any flex circuit. Using standard rigid copper on a dynamic flex board guarantees field failure.",
      table: {
        headers: ["Copper Type", "Structure", "Flexibility", "Required Application"],
        rows: [
          ["Electrodeposited (ED)", "Vertical grain (brittle)", "Poor (fractures easily)", "Static flex only (bend-to-install)"],
          { type: 'highlight', data: ["Rolled Annealed (RA)", "Horizontal grain (elongated)", "Excellent (handles cycling)", "Dynamic flex (continuous bending)"] }
        ]
      },
      alerts: [
        { type: 'danger', text: "For RA copper, the bending axis MUST be perpendicular to the grain direction of the foil. The fabricator aligns this based on your fabrication notes—ensure you specify the bend direction." }
      ]
    },
    {
      heading: "Bending Radius Rules",
      standard: {
        title: "IPC-2223D",
        note: "✅ Standard for Flexible/Rigid-Flex PWBs."
      },
      content: "The physical mechanics of bending dictate specific routing rules to prevent copper fracturing.",
      table: {
        headers: ["Application", "Minimum Bend Radius", "Max Layer Count in Bend", "Copper Requirement"],
        rows: [
          ["Static (Bend to Install)", "6× total flex thickness", "1 to 2", "ED or RA Copper"],
          { type: 'highlight', data: ["Dynamic (Continuous Flexing)", "10× total flex thickness", "1 (preferred), 2 max", "RA Copper ONLY"] },
          ["Multi-layer Flex", "24× total flex thickness", "3+", "Not recommended for dynamic"]
        ]
      }
    },
    {
      heading: "Interactive Bend Radius Calculator",
      content: "Ensure your flex design can mechanically survive the required installation or dynamic movement without fracturing.",
      list: [
        { label: "Thickness", text: "Total thickness of the flexible section (PI + adhesive + copper + coverlay)." },
        { label: "Application", text: "Static (install once) vs. Dynamic (continuous movement)." }
      ],
      type: 'bend-radius-calc'
    },
    {
      heading: "Coverlay vs. Solder Mask",
      content: "Flex boards do not use standard Liquid Photoimageable (LPI) solder mask. LPI is brittle and will crack upon bending, destroying the underlying copper.",
      list: [
        { label: "Polyimide Coverlay", text: "A solid film of polyimide (Kapton) pre-coated with acrylic or epoxy adhesive. It is laminated onto the flex board under heat and pressure." },
        { label: "Pad Openings", text: "Because coverlay is a solid film that must be drilled/routed before lamination, pad openings cannot be as precise as LPI. Specify a minimum 10 mil (0.25mm) web between openings." },
        { label: "SMD Pads", text: "Use \"SMD (Solder Mask Defined)\" pad logic where the coverlay overlaps the copper pad edge to anchor it down and prevent pad lifting during soldering." }
      ]
    },
    {
      heading: "Flex Routing: The 'No 90°' Rule",
      content: "Sharp corners are the enemy of flexible circuits. Bending a flex board concentrates mechanical stress at any sharp 90° or 45° angle, leading to rapid copper fracturing.",
      list: [
        { label: "Arc Routing Requirement", text: "All traces in a flex zone must use smooth, curved arcs. No sharp corners are permitted." },
        { label: "Perpendicular Crossing", text: "Traces must cross the bend line at a perfect 90-degree angle to distribute stress evenly across the copper." },
        { label: "Trace Width Consistency", text: "Do not change trace widths within the bend area. Width transitions create stress concentration points." }
      ],
      alerts: [
        { type: 'danger', text: "Never place vias, pads, or trace width transitions within the dynamic bend zone. These are guaranteed failure points during mechanical cycling." }
      ]
    },
    {
      heading: "Teardrops: Preventing Pad Fractures",
      content: "Where a thin trace connects to a large via or component pad, a severe stress point is created. While teardrops are recommended for standard rigid boards (to protect against drill wander), they serve a mechanical function in flex circuits.",
      list: [
        { label: "The Teardrop Solution", text: "Adding 'teardrops' (fillets) smooths the transition from pad to trace, adding structural reinforcement." },
        { label: "Mandatory for Flex", text: "Teardrops are absolutely mandatory for all pad connections in a flex circuit to prevent snapping at the junction during bending." }
      ]
    },
    {
      heading: "Cross-Hatched Planes vs. Solid Copper",
      content: "Solid copper pours destroy the flexibility of a circuit. However, high-speed signals still require a continuous ground reference for impedance control.",
      table: {
        headers: ["Plane Type", "Flexibility", "Impedance Control", "Application"],
        rows: [
          ["Solid Copper", "Very Poor", "Excellent", "Rigid boards only"],
          { type: 'highlight', data: ["Cross-Hatched (Mesh)", "Excellent", "Good", "Dynamic flex zones"] }
        ]
      },
      alerts: [
        { type: 'info', text: "When calculating impedance over a cross-hatched plane, the effective dielectric constant changes because the signal \"sees\" a mix of copper and empty space." }
      ]
    },
    {
      heading: "The 'I-Beam' Avoidance Strategy",
      content: "If you route a trace on the top flex layer directly above a trace on the bottom flex layer, you create an 'I-Beam' structure. This structure violently resists bending.",
      list: [
        { label: "The I-Beam Effect", text: "When bent, the outer trace is stretched while the inner trace is compressed. The combined stiffness forces the outer trace to snap." },
        { label: "Staggered Routing", text: "Traces on opposite layers MUST be staggered (offset) so they never sit directly on top of one another." }
      ],
      alerts: [
        { type: 'warning', text: "Beware of \"dummy traces\". While some legacy guides recommend adding dummy traces for mechanical balance, they complicate DFM. Prioritize staggered routing of active signals." }
      ]
    },
    {
      heading: "Rigid-Flex Zone Transitions",
      content: "Rigid-Flex designs integrate standard rigid zones with flexible zones in a single monolithic board. The transition zone is the most critical failure point in the assembly.",
      list: [
        { label: "The Stub-Out Architecture", text: "A rigid-flex board might have 8 layers in the rigid zone, but only layers 4 and 5 extend across the flex zone." },
        { label: "Coverlay Boundary Rule", text: "The flexible Coverlay MUST extend at least 1mm (40 mil) inside the rigid zone. It cannot end exactly at the rigid boundary, or the transition will fracture." },
        { label: "Transition Zone", text: "The area where rigid materials end and flex begins. Absolutely no vias, component pads, or solid copper planes are permitted within 2mm (80 mil) of this zone." }
      ]
    },
    {
      heading: "Copper Balancing for Flex Lamination",
      content: "Resin starvation occurs during the lamination press cycle if one side of the board has significantly higher copper density than the other, leading to board warpage and delamination.",
      list: [
        { label: "The Resin Starvation Risk", text: "Prepreg and adhesive resin flows toward empty copper areas. If one layer is 'starved,' the board becomes mechanically unstable." },
        { label: "Lamination Balance", text: "Maintain a symmetric copper density (±10%) about the board's vertical center plane. Use cross-hatched copper thieving in flex zones to equalize density without adding stiffness." }
      ]
    },
    {
      heading: "HDI & BGA Escape",
      type: "cross-ref",
      refModuleId: "si_pi",
      refTargetHeading: "BGA Escape & Fanout Design (IPC-7095C)",
      refLabel: "Review BGA Escape Strategies →",
      refDesc: "HDI routing is driven by BGA pin density. Review Dog-bone vs. VIPPO escape strategies in the SI/PI module."
    },
    {
      heading: "HDI: Sequential Lamination Architecture",
      standard: {
        title: "IPC-2226",
        note: "✅ Standard for High-Density Interconnect (HDI) PWBs."
      },
      content: "HDI is fundamentally about sequential lamination—pressing the board multiple times to build up layers of microvias. Each lamination cycle adds yield risk and 15-20% cost.",
      table: {
        headers: ["IPC-2226 Type", "Structure", "Sequential Lam Cycles", "Cost Impact", "Application"],
        rows: [
          ["Type I (1+N+1)", "1 blind via layer + N through + 1", "1", "Low", "Standard BGA escape"],
          ["Type II (1+N+1 w/ buried)", "Type I + buried vias in core", "2", "Medium", "Dense routing / mobile"],
          { type: 'highlight', data: ["Type III (2+N+2)", "2 blind via layers each side", "2", "High", "Fine-pitch BGA / tight pitch"] },
          ["Type IV (ELIC)", "Every Layer Interconnect", "N-1", "Extreme", "Advanced packaging, smartphones"]
        ]
      }
    },
    {
      heading: "HDI Material Selection",
      content: "HDI requires specialized laminates. Cores must be laser-drillable without thick glass weave blocking the laser, and Prepreg must be dimensionally stable.",
      table: {
        headers: ["Material", "Key Property", "HDI Application"],
        rows: [
          ["Panasonic R-1566W", "Laser-drillable, halogen-free", "Standard HDI build-up"],
          ["Shengyi S1000-2M", "Cost-effective, drillable", "Consumer electronics HDI"],
          { type: 'highlight', data: ["Isola I-Tera MT40", "Ultra-low loss, laser-drillable", "HDI high-speed networking"] },
          { type: 'highlight', data: ["Panasonic Megtron 6/7", "Extreme SI, laser drillable", "Server/AI ELIC architecture"] }
        ]
      }
    },
    {
      heading: "HDI Microvia Design Rules",
      content: "Microvia design is governed by laser physics. Mechanical through-hole rules do not apply.",
      list: [
        { label: "Aspect Ratio Limit (1:1)", text: "Laser-drilled microvias cannot exceed a 1:1 depth-to-diameter ratio. A 100µm (4 mil) microvia can only penetrate 100µm deep (typically 1 dielectric layer)." },
        { label: "Via-in-Pad (VIP)", text: "Mandatory for BGA pitches ≤ 0.5 mm. The via is placed directly inside the BGA pad, then copper-filled and planarized flat so solder paste does not wick down the hole (IPC-4761 Type VII)." }
      ]
    },
    {
      heading: "Stacked vs. Staggered Microvias",
      content: "When traversing multiple layers in a 2+N+2 build, you must choose how microvias connect between the build-up layers.",
      twoColumnGrid: [
        {
          badge: "Staggered",
          badgeClass: "tool-badge-altium",
          title: "High Reliability",
          items: [
            "Microvias are offset layer-to-layer.",
            "Higher fabrication yield.",
            "Requires more routing space.",
            "Does not require solid copper filling (can be resin filled)."
          ]
        },
        {
          badge: "Stacked",
          badgeClass: "tool-badge-cadence",
          title: "High Density",
          items: [
            "Microvias are aligned vertically.",
            "Saves maximum routing space.",
            "MUST be solid copper-filled to prevent failure during reflow.",
            "Higher thermal stress risk (Z-axis expansion)."
          ]
        }
      ]
    },
    {
      heading: "Trace Neck-Downs",
      content: "When escaping the inner rows of a BGA, traces must often pass between the outer pads. A 'neck-down' is a temporary reduction in trace width to meet clearance rules.",
      list: [
        { label: "The Neck-Down Rule", text: "Drop the trace width only for the short segment passing between the BGA pads, then return to the standard width." },
        { label: "Impedance Impact", text: "A neck-down causes an impedance discontinuity. Keep the narrowed segment as short as possible (< 50 mils / 1.27mm) to avoid major signal reflections." },
        { label: "Current Density", text: "Ensure the narrowed trace width can still carry the required current without overheating." }
      ],
      alerts: [
        { type: 'warning', text: "Always verify with your fabricator what their absolute minimum trace width is (e.g., 3 mil / 75µm) before designing aggressive neck-downs." }
      ]
    },
    {
      heading: "Plane Voiding & Return Paths",
      content: "In dense HDI designs, thousands of microvias punch through the inner ground and power planes. This creates a 'swiss cheese' effect.",
      list: [
        { label: "The Swiss Cheese Effect", text: "If vias are placed too close together, their clearance voids merge, creating a giant hole in the plane." },
        { label: "Return Path Destruction", text: "Signals routing over this void lose their reference plane, causing massive impedance spikes and EMI radiation." },
        { label: "The Solution", text: "Carefully space vias (staggering) to ensure a solid web of copper remains between every via, allowing return currents to flow freely." }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Flex Routing Validation",
      items: [
        "Dynamic flex zones use Rolled Annealed (RA) copper.",
        "Bend radius ≥ 10× thickness for dynamic, ≥ 6× for static flex.",
        "Bending axis is perpendicular to the copper grain direction.",
        "All traces in flex zone use arc routing (no 90° or 45° corners).",
        "Teardrops applied to all pad and via connections.",
        "Traces cross the bend axis at exactly 90 degrees.",
        "Top and bottom layer traces staggered to prevent the 'I-Beam' effect.",
        "Cross-hatched copper used for ground planes in dynamic zones.",
        "Coverlay overlaps SMD pads (Solder Mask Defined pads).",
        "Copper density balanced across flex layers to prevent resin starvation."
      ]
    },
    {
      category: "2. Rigid-Flex Transitions",
      items: [
        "Coverlay extends at least 1mm (40 mil) into the rigid zone.",
        "No vias within 2mm (80 mil) of the rigid-flex transition line.",
        "No solid copper planes crossing the transition zone."
      ]
    },
    {
      category: "3. HDI Breakout Validation",
      items: [
        "IPC-2226 Type (I/II/III/IV) correctly specified in Fab Notes.",
        "Microvia aspect ratio does not exceed 1:1 depth-to-diameter.",
        "Laser-drillable prepreg/cores specified in stackup.",
        "Via-in-Pad (VIP) strategy implemented for BGA pitch ≤ 0.5mm.",
        "VIP defined as IPC-4761 Type VII (filled and capped) for planar surface.",
        "Stacked microvias are specified as solid copper-filled.",
        "Trace neck-downs kept < 50 mils (1.27mm) to minimize impedance impact.",
        "Differential pairs maintain symmetry during BGA escape.",
        "Plane anti-pads checked to ensure copper 'webbing' exists between vias.",
        "Return paths verified over dense BGA breakout areas."
      ]
    }
  ]
};
