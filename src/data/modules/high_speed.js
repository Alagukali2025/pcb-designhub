export const content = {
  intro: "A signal is considered high-speed not because of its clock frequency, but because its electrical wavelength — or its rise/fall time — is short enough relative to the trace length that the trace must be treated as a transmission line.",
  sections: [
    {
      heading: "What is High-Speed PCB Design?",
      content: "The standard industry threshold for high-speed design is when trace length exceeds 1/6 of the signal wavelength. Below this, lumped-circuit analysis is valid. Above it, distributed transmission line effects dominate. For digital signals, the rise time (tr) is the primary driver of high-speed behavior. (Note: The more conservative 1/10th rule is often used in margin-critical designs, such as DDR5, to double the safety margin).",
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
          "// Validity: 0.1 < W/H < 2.0 (For both Microstrip & Stripline)",
          "Z₀(Microstrip) ≈ (87/√(εr + 1.41)) × ln(5.98H/(0.8W + T))",
          "εeff ≈ 0.475εr + 0.67 // Effective Dk (accounts for air)",
          "Z₀(Stripline) ≈ (60/√εr) × ln(1.9B / (0.8W + T))"
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
          ["DDR4 Data", "34–40Ω (ODT-dependent)", "—", "±10%"],
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
            "< 50 mils bypass cap placement, minimize via count",
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
      ],
      type: "return-path-visual"
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
      heading: "Crosstalk Control & Suppression",
      content: "Crosstalk is the unwanted coupling of energy from an aggressor net onto a victim net through parasitic capacitance and mutual inductance.",
      table: {
        headers: ["Type", "Location", "Polarity", "Magnitude"],
        rows: [
          ["NEXT", "Same end as driver", "Same as aggressor", "Saturates after critical length"],
          ["FEXT", "Far end of line", "Opposite (microstrip) / Zero (stripline)", "Accumulates (inhomogeneous media)"]
        ]
      },
      list: [
        { label: "Spacing", text: "Increase spacing (1/S² drop-off). Doubling 'S' reduces coupling by ~75%. 3W rule reduces NEXT to <10%." },
        { label: "Orthogonality", text: "Route adjacent layers perpendicular to eliminate broadside coupling (avoid parallel overlapping traces)." },
        { label: "Stripline", text: "FEXT in balanced stripline is zero (homogeneous dielectric), making it superior to microstrip." }
      ],
      alerts: [
        { type: 'info', text: "Expert Insight: Stripline cancels FEXT because the velocity of propagation is identical in a homogeneous dielectric, causing the inductive and capacitive components to cancel exactly. In Microstrip, the 'Far End' crosstalk grows linearly with trace length." }
      ]
    },
    {
      heading: "Termination: SI Placement & Topology",
      content: "While Hardware Engineers define termination in the schematic, the PCB Designer determines if it works. Placement dictates physics. **Rule of Thumb: If trace length > (Rise Time / 6), termination is mandatory.**",
      alerts: [
        { type: 'warning', text: "The Guardian of Physics: A perfectly calculated schematic resistor fails if placed at the wrong end of the trace or connected with a massive stub. Topology is your responsibility." }
      ],
      terminationGrid: [
        {
          name: "Series (Source)",
          tag: "Low Power",
          tagColor: "green",
          pros: "Prevents reflection at source. Rs = Z₀ − Zdriver.",
          cons: "Ideal for point-to-point only.",
          placement: "< 200 mils from Driver pad."
        },
        {
          name: "Parallel (End)",
          tag: "High Freq",
          tagColor: "amber",
          pros: "Instantaneous match. Best for multi-drop and clocks.",
          cons: "High DC power drain.",
          placement: "End of line, absolutely zero stubs."
        },
        {
          name: "AC (Capacitive)",
          tag: "Clocks",
          tagColor: "blue",
          pros: "Blocks DC current, saving massive power over Parallel.",
          cons: "Adds RC time constant delay.",
          placement: "End of line."
        },
        {
          name: "Thevenin (Split)",
          tag: "Bias VREF",
          tagColor: "amber",
          pros: "Pulls signal to specific bias voltage (VTT). Good for DDR.",
          cons: "Constant DC drain through both resistors.",
          placement: "End of line."
        },
        {
          name: "Differential",
          tag: "Serial Links",
          tagColor: "blue",
          pros: "100Ω across D+/D-. Specified by serial standards.",
          cons: "Internal ODT preferred over external components.",
          placement: "Directly across receiver pins."
        },
        {
          name: "On-Die (ODT)",
          tag: "Modern DDR",
          tagColor: "green",
          pros: "Eliminates board stubs and parasitic inductance.",
          cons: "Requires software configuration.",
          placement: "Inside IC (Hardware feature)."
        }
      ]
    },
    {
      heading: "Via Parasitics & Stub Resonance",
      content: "Every via is a tiny obstacle for high-speed signals. Modeling parasitic capacitance and inductance is essential. At rates >10 Gbps, any remaining stub length becomes a parasitic 'antenna' that absorbs energy from the primary signal.",
      type: 'cross-ref',
      refModuleId: 'si_pi',
      refTargetHeading: 'Via Stub Resonance & Back-Drilling',
      refLabel: 'Open Expert Via Analytics → SI / PI Mastery',
      refDesc: 'Complex via stub resonance modeling and back-drilling depth calculators are canonically located in the Signal Integrity module for high-fidelity channel analysis.'
    },
    {
      heading: "Back-Drilling Strategy",
      content: "When via stubs exceed 100 mils at frequencies >5 GHz, back-drilling (controlled depth drilling) is required to physically remove the unused via plating.",
      table: {
        headers: ["Parameter", "Standard Capability", "High-Precision"],
        rows: [
          ["Remaining Stub Length", "< 10 mil (0.25mm)", "< 5 mil (0.125mm)"],
          ["Drill Depth Tolerance", "± 2 mil", "± 1 mil"],
          ["Clearance to Signal", "10 mil", "8 mil"]
        ]
      }
    },
    {
      heading: "S-Parameters: Reading Channel Health",
      content: "S-parameters are the universal measurement language for high-speed channels. They define how much energy passes through, reflects back, or couples to neighboring traces in the frequency domain.",
      cards: [
        { title: "S11 (Return Loss)", text: "Measures reflection. A value of -20 dB means 1% of energy is reflecting back. Target: < -15 dB across the operating bandwidth." },
        { title: "S21 (Insertion Loss)", text: "Measures attenuation (signal passing through). A value of -3 dB means half the power is lost. Target depends on the standard (e.g., -14 dB for PCIe Gen 4)." },
        { title: "S31 (FEXT) / S41 (NEXT)", text: "Measures crosstalk isolation from port 1 to neighboring ports. Target: < -40 dB to prevent interference." }
      ]
    },
    {
      heading: "Channel Budget & Equalization",
      content: "At >10 Gbps, FR4 dielectric loss completely closes the 'eye diagram'. Hardware engineers must compensate for this physical loss using Tx/Rx Equalization.",
      list: [
        { label: "Tx Pre-Emphasis", text: "Boosts the high-frequency components (edges) of the transmitted signal before it travels down the trace." },
        { label: "Rx CTLE / DFE", text: "Continuous Time Linear Equalization and Decision Feedback Equalization at the receiver mathematically recover closed eyes." },
        { label: "Design Impact", text: "Even with equalization, channel loss must stay within a strict budget (e.g., -28 dB for PCIe Gen 5 edge-to-edge). You must sum package loss, trace loss, and connector loss." }
      ]
    },
    {
      heading: "PCIe Gen 3–5 Routing Checklist",
      content: "Peripheral Component Interconnect Express (PCIe) is the most common multi-gigabit interface. Routing must adhere strictly to the standard's loss budget.",
      ruleCards: [
        { number: "PCI-1", severity: "danger", title: "Loss Budget Margin", body: "Gen 3: -10 dB @ 4 GHz. Gen 4: -14 dB @ 8 GHz. Gen 5: -16 dB @ 16 GHz. Use Megtron 6 or similar for Gen 4/5." },
        { number: "PCI-2", severity: "warning", title: "AC Coupling Caps", body: "Place 100nF (Gen 3) or 220nF (Gen 4/5) AC coupling capacitors symmetrically on TX pairs. Place close to the transmitter to minimize stub effects." },
        { number: "PCI-3", severity: "info", title: "Intra-pair Skew", body: "Match P/N legs within ±5 mils. Use tight serpentine bends (length ≤ 3x gap) directly at the mismatch point." }
      ]
    },
    {
      heading: "USB 3.2 / USB4 Routing Rules",
      content: "Modern USB carries 10 Gbps to 40 Gbps. It requires strict differential impedance and deep isolation.",
      list: [
        { label: "Zdiff", text: "USB uses 90Ω differential impedance (unlike PCIe's 85Ω or 100Ω)." },
        { label: "Common-Mode Chokes", text: "Place CMCs directly at the connector to suppress cable-radiating common-mode noise. Maintain 90Ω through the choke pads." },
        { label: "ESD Protection", text: "Place ultra-low capacitance TVS diodes (<0.15 pF) before any other component on the data lines." }
      ]
    },
    {
      heading: "Clock Distribution (H-Tree vs. Daisy Chain)",
      content: "Clock signals are the most critical nets on the board. They run continuously and contain massive harmonic energy.",
      cards: [
        { title: "H-Tree Fanout", text: "Symmetrical branching ensures equal trace lengths to all receivers. Use for synchronous systems like DDR memory." },
        { title: "Series Termination", text: "Always place a series resistor at the clock source to dampen reflections and slow the edge rate to exactly what is needed—no faster." }
      ]
    },
    {
      heading: "EMI / EMC Compliance",
      content: "PCB layout is the primary determinant of EMI performance. Loop area is the single largest contributor to radiated emissions.",
      list: [
        { label: "Loop Area", text: "Radiation ∝ Loop Area × Freq² × dI/dt. Keep return path directly beneath signal." },
        { label: "Decoupling", text: "Use thin dielectrics between power and ground to maximize inter-plane capacitance." },
        { label: "Board Edge", text: "Route over continuous reference plane up to board edge. Use edge-stitching ground vias at 1/20 wavelength intervals." }
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
      },
      alerts: [
        { type: 'info', text: "For an interactive deep-dive into Eye Diagrams and Jitter extraction, see the Signal & Power Integrity (SI/PI) module." }
      ]
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
