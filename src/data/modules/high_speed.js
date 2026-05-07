export const content = {
  intro: "A signal is considered high-speed not because of its clock frequency, but because its electrical wavelength — or its rise/fall time — is short enough relative to the trace length that the trace must be treated as a transmission line. This guide provides a standards-driven single-source-of-truth for high-speed digital design.",
  sections: [
    {
      heading: "What is High-Speed PCB Design?",
      content: "The standard industry threshold for high-speed design is when trace length exceeds 1/6 of the signal wavelength. Below this, lumped-circuit analysis is valid. Above it, distributed transmission line effects dominate. For digital signals, the rise time (tr) is the primary driver of high-speed behavior.",
      formula: {
        title: "The Critical Length Rule",
        equations: [
          "vp = c / √εr // propagation velocity (c ≈ 3×10⁸ m/s)",
          "Lcritical = (tr × vp) / 6 // 1/6th rise-time distance rule"
        ],
        variables: [
          { name: "vp", desc: "Propagation velocity", tag: "CALC" },
          { name: "tr", desc: "Signal rise time (10% to 90%)", tag: "INPUT" },
          { name: "Lcritical", desc: "Critical length", tag: "OUTPUT" }
        ]
      },
      twoColumnGrid: [
        {
          badge: "DDR4 / LPDDR4",
          badgeClass: "tool-badge-altium",
          title: "High Speed",
          items: [
            "<200 ps rise time", 
            "Critical length ≈ 7 mm (@ FR4)", 
            "Every trace is a transmission line",
            "Heuristic: Use 1/10th rule for DDR5"
          ]
        },
        {
          badge: "Slow logic",
          badgeClass: "tool-badge-cadence",
          title: "Lumped",
          items: [
            ">10 ns rise time", 
            "Critical length >40 mm", 
            "Most traces safe without TL treatment",
            "Heuristic: Simple R-C models valid"
          ]
        }
      ],
      alerts: [
        { type: 'info', text: "Industrial Workflow: Professional designers use these formulas for pre-layout planning. Final trace widths and via geometries are always validated using 2D/3D Field Solvers for production reliability." }
      ]
    },
    {
      heading: "Transmission Line Theory",
      content: "A PCB trace over a reference plane forms a distributed network of inductance (L), capacitance (C), resistance (R), and conductance (G). Matching characteristic impedance (Z₀) throughout the signal path is the single most important objective.",
      formula: {
        title: "Characteristic Impedance Z₀",
        equations: [
          "Z₀ = √(L/C) // lossless approximation",
          "Γ = (ZL − Z₀) / (ZL + Z₀) // reflection coefficient"
        ],
        variables: [
          { name: "Z₀", desc: "Characteristic impedance", tag: "PROP" },
          { name: "Γ", desc: "Reflection coefficient", tag: "CALC" },
          { name: "ZL", desc: "Load impedance", tag: "INPUT" }
        ]
      },
      alerts: [
        { type: 'info', text: "Reflections travel back to the source, causing ringing, overshoot, and setup/hold time violations. Matched load (ZL = Z₀) results in Γ = 0 (no reflection)." }
      ]
    },
    {
      heading: "Impedance Control",
      content: "Controlled impedance is the practice of designing trace geometry to achieve a target Z₀ within a specified tolerance (typically ±10%). This require tight coordination with the fabricator.",
      formula: {
        title: "Geometry Models",
        equations: [
          "Z₀(Microstrip) ≈ (87/√(εr + 1.41)) × ln(5.98H/(0.8W + T))",
          "εeff ≈ 0.475εr + 0.67 // Effective Dk (accounts for air)",
          "Z₀(Stripline) ≈ (60/√εr) × ln(1.9B / (0.8W + T))",
          "// Validity: 0.1 < W/H < 2.0"
        ],
        variables: [
          { name: "W", desc: "Trace width", tag: "GEOM" },
          { name: "H", desc: "Dielectric height", tag: "GEOM" },
          { name: "T", desc: "Trace thickness", tag: "GEOM" },
          { name: "B", desc: "Total dielectric thickness (stripline)", tag: "GEOM" },
          { name: "εeff", desc: "Effective Dk", tag: "PRO" }
        ]
      },
      table: {
        headers: ["Interface", "Z₀ Single-Ended", "Z₀ Differential", "Tolerance"],
        rows: [
          ["USB 2.0 / 3.x", "—", "90Ω", "±10%"],
          ["PCIe Gen 1–5", "—", "100Ω", "±10%"],
          ["HDMI / DP", "—", "100Ω", "±10%"],
          ["DDR4 Data", "40Ω", "—", "±10%"],
          ["RF (50Ω sys)", "50Ω", "—", "±5%"]
        ]
      },
      alerts: [
        { type: 'info', text: "Field Solvers (e.g., Polar SI9000) are required for actual production. Simple formulas do not account for trapezoidal etching or copper surface roughness." }
      ]
    },
    {
      heading: "Material Physics & Loss",
      content: "At frequencies >1 GHz, the choice of substrate material becomes a primary design decision. FR-4, while economical, exhibits excessive dielectric loss (tangent delta) and inconsistent Dk across high-speed bands.",
      table: {
        headers: ["Material Family", "Dk (@10GHz)", "Df (@10GHz)", "Best For"],
        rows: [
          ["Standard FR-4", "4.2–4.5", "0.020–0.025", "General purpose <1 Gbps"],
          ["Mid-Loss (Megtron 4)", "3.8", "0.005–0.010", "1–10 Gbps designs"],
          ["Low-Loss (Megtron 6)", "3.7", "0.002", "10–25 Gbps, PCIe Gen 4/5"],
          ["Ultra-Low Loss (Rogers)", "3.4", "0.001", "25+ Gbps, RF & 5G"]
        ]
      },
      formula: {
        title: "Skin Depth (δ)",
        equations: [
          "δ = 1 / √(π × f × μ × σ) // eddy current penetration",
          "α_skin ∝ √f // loss increases with frequency"
        ],
        variables: [
          { name: "f", desc: "Frequency", tag: "INPUT" },
          { name: "σ", desc: "Conductivity", tag: "CONST" }
        ]
      },
      alerts: [
        { type: 'warning', text: "Skin effect causes signal current to travel on the rough surface of the copper. For frequencies >5GHz, specify VLP (Very Low Profile) or RTF (Reverse Treated Foil) copper to reduce resistive loss." },
        { type: 'danger', text: "Surface Finish Impact: ENIG (Nickel/Gold) is ferromagnetic and increases insertion loss by up to 30% at high frequencies. For 28Gbps+ links, mandate Immersion Silver (I-Ag) or OSP for the signal path." }
      ]
    },
    {
      heading: "The Fiber Weave Effect",
      content: "For signals >10 Gbps, the physical weave of the PCB glass becomes a critical bottleneck. Differences in Dk between glass and resin cause intra-pair skew that cannot be ignored.",
      type: 'cross-ref',
      refModuleId: 'stackup',
      refTargetHeading: 'High-Speed Signal Integrity: Fiber Weave Skew',
      refLabel: 'Open Interactive Fiber Weave Analyzer →',
      refDesc: 'The interactive Fiber Weave Skew simulator and material-specific Dk variation tools are canonically located in the Stackup Design module.'
    },
    {
      heading: "Layer Stack-Up Design",
      content: "Stack-up design determines the physical environment of every trace. It must be defined before routing begins to control impedance and minimize crosstalk.",
      type: 'cross-ref',
      refModuleId: 'stackup',
      refLabel: 'Open Layer Stackup Visualizer →',
      refDesc: 'Canonical impedance calculations, material dielectric benchmark tables, and the industrial 8-layer stackup visualizer are managed in the Stackup Design module.'
    },
    {
      heading: "Return Paths & Ground Planes",
      content: "At high frequencies, return current takes the path of least inductance, mirroring its path directly beneath the signal trace.",
      alerts: [
        { type: 'danger', text: "Never route a high-speed signal across a split in the reference plane. The return current loop area increases dramatically, causing EM failures." }
      ],
      twoColumnGrid: [
        {
          badge: "Correct Practice",
          badgeClass: "tool-badge-cadence",
          title: "Continuity",
          items: [
            "Signal via + adjacent GND via at transitions",
            "100nF bypass cap within 100 mils of power transitions",
            "Solid copper pours with no unnecessary cutouts",
            "Connect all GND islands with stitching vias"
          ]
        },
        {
          badge: "Common Errors",
          badgeClass: "tool-badge-altium",
          title: "Discontinuities",
          items: [
            "Routing over anti-pads that break copper",
            "Crossing split-plane boundaries",
            "Isolated GND pours without stitching",
            "Bypass caps placed far from power pins"
          ]
        }
      ]
    },
    {
      heading: "Power Integrity (PI) Strategy",
      content: "High-speed digital links are sensitive to transient current spikes. A stable Power Delivery Network (PDN) is the foundation of Signal Integrity — without power stability, signal timing cannot be guaranteed.",
      type: 'cross-ref',
      refModuleId: 'si_pi',
      refTargetHeading: 'PDN Target Impedance Solver (Interactive)',
      refLabel: 'Open Expert PI Target Wizard →',
      refDesc: 'The interactive Target Impedance Wizard, decoupling stack heuristics, and PDN stability analysis are canonically located in the Signal & Power Integrity module.'
    },
    {
      heading: "Routing Techniques & Geometry",
      content: "Trace width directly sets Z₀. Use a validated field solver for production designs. Length matching is critical for timing budgets in parallel buses.",
      formula: {
        title: "3W Spacing Rule",
        equations: [
          "S_center_to_center ≥ 3 × W // reduces NEXT to <10%",
          "Gap_edge_to_edge = 2W"
        ],
        variables: [
          { name: "W", desc: "Trace width", tag: "GEOM" },
          { name: "S", desc: "Spacing", tag: "RULE" }
        ]
      },
      ruleCards: [
        {
          number: "01",
          title: "Stitching Vias (The GND Shadow)",
          severity: "warning",
          body: "Always place a Ground via next to a signal via when changing layers. This maintains return path continuity and minimizes loop inductance, preventing EMI and signal degradation at the transition point."
        },
        {
          number: "02",
          title: "Guard Traces vs. Spacing",
          severity: "warning",
          body: "Prefer increased spacing (3W/5W) over guard traces. Guard traces can actually increase crosstalk if not stitched to GND at intervals much smaller than the signal wavelength."
        },
        {
          number: "03",
          title: "Teardrops (Impedance Smoothing)",
          severity: "info",
          body: "Apply teardrops at pad and via junctions to prevent drill breakout and smooth the abrupt change in cross-sectional area. This reduces the impedance 'bump' and reflections at high frequencies."
        },
        {
          number: "04",
          title: "Routing Corners (DFM Priority)",
          severity: "info",
          body: "Use 45° corners or arcs. Contrary to myths, 90° corners are primarily a DFM risk (acid traps/etch undercut) rather than an SI risk until well above 20 GHz."
        },
        {
          number: "05",
          title: "The Zero-Stub Rule",
          severity: "danger",
          body: "Eliminate unterminated stubs in high-speed nets. Stubs act as quarter-wave resonators (λ/4) that can absorb signal energy at specific frequencies, creating 'notches' in the insertion loss."
        },
        {
          number: "06",
          title: "Length Matching",
          severity: "warning",
          body: "DDR4 Data: ±25 mil within byte lane. PCIe (Intra-pair): ±5 mil. Match to setup/hold window."
        },
        {
          number: "07",
          title: "Serpentine Tuning",
          severity: "info",
          body: "Maintain gap between legs ≥ 3W. Amplitude should be small. Never serpentine inside a differential pair region."
        },
        {
          number: "08",
          title: "The Hidden Skew: Package Delay",
          severity: "danger",
          body: "Pad-to-Pad matching is insufficient for high-end FPGAs/CPUs. You must account for 'Pin-to-Die' delay (Package Skew) which can vary by 100+ mils. Import the package delay file (.csv/.pkg) into your constraint manager to match the true electrical length."
        }
      ]
    },
    {
      heading: "Differential Pair Routing",
      content: "Differential signaling provides inherent immunity to common-mode noise and is the backbone of modern serial links. Precise length matching and constant Zdiff are mandatory.",
      type: 'cross-ref',
      refModuleId: 'diff_pair',
      refLabel: 'Open Differential Pair Routing Module →',
      refDesc: 'The complete engineering reference for 8 Non-Negotiable Routing Rules, Zdiff Calculators, and interface-specific constraints is canonically located in the Diff Pair module.'
    },
    {
      heading: "Crosstalk Mitigation",
      content: "Crosstalk is the unwanted coupling of energy from an aggressor net onto a victim net through parasitic capacitance and mutual inductance.",
      table: {
        headers: ["Type", "Location", "Polarity", "Magnitude"],
        rows: [
          ["NEXT", "Same end as driver", "Same as aggressor", "Higher (accumulates)"],
          ["FEXT", "Far end of line", "Opposite (stripline)", "Lower in microstrip"]
        ]
      },
      list: [
        { label: "Spacing", text: "Increase spacing (1/S² drop-off). 3W rule reduces NEXT to <10%." },
        { label: "Orthogonality", text: "Route adjacent layers perpendicular to eliminate broadside coupling." },
        { label: "Stripline", text: "FEXT in balanced stripline cancels, making it superior to microstrip." }
      ]
    },
    {
      heading: "Termination Strategies",
      content: "Termination is the use of resistors to match the source or load impedance to the transmission line Z₀, thereby eliminating reflections.",
      terminationGrid: [
        {
          name: "Series (Source) Termination",
          tag: "Low Power",
          tagColor: "green",
          pros: "Prevents reflection at source. Rs = Z₀ − Zdriver.",
          cons: "Ideal for point-to-point only."
        },
        {
          name: "Parallel (End) Termination",
          tag: "High Freq",
          tagColor: "amber",
          pros: "Instantaneous match. Best for multi-drop and clocks.",
          cons: "High DC power consumption."
        },
        {
          name: "Differential Termination",
          tag: "Serial Links",
          tagColor: "blue",
          pros: "100Ω across D+/D-. Specified by serial standards.",
          cons: "Internal ODT preferred over external components."
        },
        {
          name: "On-Die Termination (ODT)",
          tag: "Modern DDR",
          tagColor: "green",
          pros: "Eliminates board stubs and parasitic inductance.",
          cons: "Requires software configuration."
        }
      ]
    },
    {
      heading: "Via Parasitics (Advanced Modeling)",
      content: "Every via is a tiny obstacle for high-speed signals. Modeling parasitic capacitance and inductance is essential for designs exceeding 5 Gbps.",
      type: 'cross-ref',
      refModuleId: 'si_pi',
      refTargetHeading: 'Via Stub Resonance & Back-Drilling',
      refLabel: 'Open Expert Via Analytics →',
      refDesc: 'Complex via stub resonance modeling and back-drilling depth calculators are canonically located in the Signal Integrity module.'
    },
    {
      heading: "Via Stub Resonance",
      content: "Calculate the quarter-wave resonant frequency of via stubs to identify potential signal absorption nulls. At rates >10 Gbps, any remaining stub length becomes a parasitic 'antennna' that absorbs energy from the primary signal.",
      type: 'cross-ref',
      refModuleId: 'si_pi',
      refTargetHeading: 'Via Stub Resonance & Back-Drilling',
      refLabel: 'Open Expert Via Analytics → SI / PI Mastery',
      refDesc: 'Complex via stub resonance modeling and back-drilling depth calculators are canonically located in the Signal Integrity module for high-fidelity channel analysis.'
    },
    {
      heading: "EMI / EMC Compliance",
      content: "PCB layout is the primary determinant of EMI performance. Loop area is the single largest contributor to radiated emissions.",
      list: [
        { label: "Loop Area", text: "Radiation ∝ Loop Area × Freq² × dI/dt. Keep return path directly beneath signal." },
        { label: "Decoupling", text: "100nF bulk HF, 10nF mid-freq as close as possible to IC power pins." },
        { label: "Board Edge", text: "20H keepout: no routing within 20× dielectric height of board edge." }
      ]
    },
    {
      heading: "Common Mistakes & Fixes",
      content: "Avoid these common high-speed pitfalls to ensure your design passes first-spin simulation and testing.",
      mistakeList: [
        { mistake: "Crossing plane splits with HS traces.", fix: "Route over continuous reference planes." },
        { mistake: "Using online calculators for production.", fix: "Use field solvers (Polar SI9000)." },
        { mistake: "Ignoring via stubs (>5 Gbps).", fix: "Specify back-drilling to remove resonance." },
        { mistake: "Serpentining inside a diff-pair.", fix: "Length-tune outside the coupled region." }
      ]
    },
    {
      heading: "Simulation & Verification",
      content: "Simulation is not optional for designs >1 Gbps. It is cheaper than one failed prototype spin.",
      phaseList: [
        { num: "1", title: "Pre-layout", desc: "IBIS-based SPICE to verify termination and topology." },
        { num: "2", title: "Field Solver", desc: "Extract exact RLGC coefficients for the layer stack-up." },
        { num: "3", title: "Post-layout", desc: "3D via extraction and full channel eye diagram simulation." }
      ],
      table: {
        headers: ["Metric", "Description", "Pass Criterion"],
        rows: [
          ["Eye Height", "Voltage margin at sample point", ">200 mV (DDR4)"],
          ["Insertion Loss (S21)", "Channel attenuation at Nyquist", "<-20 dB (PCIe Gen 4)"],
          ["Jitter (TJ)", "Total timing jitter at BER", "<0.1 UI"]
        ]
      }
    },
    {
      heading: "Design Checklist",
      content: "Final pre-route and post-route verification for high-speed systems."
    }
  ],
  checklists: [
    {
      category: "Pre-Route Validation",
      items: [
        "Stackup field-solver validated.",
        "Impedance-controlled layers identified.",
        "Trace widths calculated for target net classes.",
        "3W spacing rules applied to all HS nets."
      ]
    },
    {
      category: "Post-Route Verification",
      items: [
        "Return path analysis: no splits under nets.",
        "Via stub analysis: back-drilling specified.",
        "Eye diagram simulation pass for all links.",
        "Intra-pair skew within standard limits."
      ]
    },
    {
      category: "Veteran DFM Review",
      items: [
        "Surface finish: OSP or I-Ag specified for HF loss reduction.",
        "Copper thieving added to balance density and prevent plating variation.",
        "Teardrops added on all HS pads to reduce impedance discontinuities.",
        "10° design rotation requested if using standard weave cores."
      ]
    }
  ]
};
