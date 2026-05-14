export const content = {
  intro: "Advanced routing for Flex, Rigid-Flex, and HDI designs requires moving beyond standard rigid FR4 techniques. This module covers the CAD-level layout strategies necessary to prevent flex circuit fracturing under dynamic bending and to successfully escape ultra-fine-pitch BGA packages using microvias.",
  sections: [
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
      content: "Where a thin trace connects to a large via or component pad, a severe stress point is created. During bending, the trace will snap right at this junction.",
      list: [
        { label: "The Teardrop Solution", text: "Adding 'teardrops' (fillets) smooths the transition from pad to trace, adding structural reinforcement." },
        { label: "Mandatory for Flex", text: "While teardrops are optional (but recommended) on rigid boards, they are absolutely mandatory for all pad connections in a flex circuit." },
        { label: "Annular Ring Protection", text: "Teardrops also prevent breakout if the drill wanders slightly off-center during fabrication." }
      ]
    },
    {
      heading: "Cross-Hatched Planes vs. Solid Copper",
      content: "Solid copper pours destroy the flexibility of a circuit. However, high-speed signals still require a continuous ground reference for impedance control.",
      table: {
        headers: ["Plane Type", "Flexibility", "Impedance Control", "Application"],
        rows: [
          ["Solid Copper", "Very Poor", "Excellent", "Rigid boards only"],
          { type: 'highlight', data: ["Cross-Hatched (Mesh)", "Excellent", "Good", "Dynamic flex zones"] },
          ["Silver Ink Shielding", "Good", "Moderate", "EMI shielding on low-cost flex"]
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
        { label: "Staggered Routing", text: "Traces on opposite layers MUST be staggered (offset) so they never sit directly on top of one another." },
        { label: "Dummy Traces", text: "If maintaining symmetry is required for mechanical balance, use unconnected 'dummy' traces offset from the active traces." }
      ]
    },
    {
      heading: "HDI: Fine-Pitch BGA Breakout",
      content: "High-Density Interconnect (HDI) is driven by the need to escape massive BGA packages (e.g., 1000+ pins) with pitches of 0.5mm, 0.4mm, or even 0.35mm. Traditional through-hole vias physically cannot fit.",
      table: {
        headers: ["BGA Pitch", "Escape Strategy", "Via Type Required", "Cost Impact"],
        rows: [
          ["1.0mm - 0.8mm", "Standard Dog-bone", "Through-hole", "Low"],
          ["0.65mm - 0.5mm", "Micro Dog-bone / VIP", "Blind Microvia", "Medium (HDI Type I)"],
          { type: 'highlight', data: ["≤ 0.4mm", "Via-in-Pad (VIP) ONLY", "Stacked/Staggered Microvias", "High (HDI Type III/IV)"] }
        ]
      }
    },
    {
      heading: "Via-in-Pad (VIP) vs. Dog-Bone Routing",
      content: "The method of connecting a BGA pad to a via changes drastically as pitch decreases.",
      twoColumnGrid: [
        {
          badge: "Dog-Bone",
          badgeClass: "tool-badge-altium",
          title: "Standard Pitch (>0.65mm)",
          items: [
            "A short trace connects the BGA pad to an offset via.",
            "Via is tented with solder mask.",
            "Cheap to manufacture.",
            "Leaves less room for routing channels between pads."
          ]
        },
        {
          badge: "Via-in-Pad (VIP)",
          badgeClass: "tool-badge-cadence",
          title: "Fine Pitch (≤0.5mm)",
          items: [
            "Laser microvia is drilled directly inside the BGA pad.",
            "MUST be copper-filled and planarized (IPC-4761 Type VII).",
            "Eliminates the dog-bone trace entirely.",
            "Frees up maximum routing channels on inner layers."
          ]
        }
      ]
    },
    {
      heading: "Trace Neck-Downs",
      content: "When escaping the inner rows of a BGA, traces must often pass between the outer pads. A 'neck-down' is a temporary reduction in trace width to meet clearance rules.",
      list: [
        { label: "The Neck-Down Rule", text: "Drop the trace width only for the short segment passing between the BGA pads, then return to the standard width." },
        { label: "Impedance Impact", text: "A neck-down causes a short, localized impedance spike. Keep the narrowed segment as short as possible (< 2-3mm) to avoid major signal reflections." },
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
        "All traces in flex zone use arc routing (no 90° or 45° corners).",
        "Teardrops applied to all pad and via connections.",
        "Traces cross the bend axis at exactly 90 degrees.",
        "Top and bottom layer traces staggered to prevent the 'I-Beam' effect.",
        "Cross-hatched copper used for ground planes in dynamic zones."
      ]
    },
    {
      category: "2. HDI Breakout Validation",
      items: [
        "Via-in-Pad (VIP) strategy implemented for BGA pitch ≤ 0.5mm.",
        "VIP defined as IPC-4761 Type VII (filled and capped) for planar surface.",
        "Trace neck-downs kept as short as possible to minimize impedance impact.",
        "Plane anti-pads checked to ensure copper 'webbing' exists between vias.",
        "Return paths verified over dense BGA breakout areas."
      ]
    }
  ]
};
