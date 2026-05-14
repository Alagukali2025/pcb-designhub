export const content = {
  intro: "A PCB stackup defines the layer sequence, material selection, and dielectric geometry that jointly control signal impedance, return path integrity, EMI containment, and power delivery performance. Following the Single Source of Truth (SSOT) methodology ensures parity between simulation, layout, and fabrication.",
  sections: [
    {
      heading: "SSOT Stackup Workflow",
      content: "In a professional engineering environment, a single master stackup definition (the SSOT) drives every downstream process to prevent errors and unauthorized material substitutions at the fabrication house.",
      flow: [
        { step: "01", title: "Define", desc: "Master SSOT definition (Materials, Dk, Df, Cu Weight, Thickness)" },
        { step: "02", title: "Import", desc: "EDA tool loads SSOT — trace/via rules are auto-applied" },
        { step: "03", title: "Simulate", desc: "SI/PI tools load SSOT Dk/Df — simulation finally matches reality" },
        { step: "04", title: "Fabricate", desc: "Fabrication house quotes from SSOT — no interpretation, no substitutions" }
      ]
    },
    {
      heading: "Material Science: The Laminate",
      content: "Your material selection locks in the dielectric constant (Dk) and dissipation factor (Df). High-speed designs require ultra-low loss (low Df) materials to maintain signal integrity at frequencies >3 GHz.",
      filletGrid: [
        {
          title: "Dk (Dielectric Constant)",
          color: "blue",
          list: [
            { label: "Definition", text: "Relative permittivity; slows EM waves compared to vacuum. Drifts with frequency and temperature." },
            { label: "Formula", text: "Dielectric determines propagation velocity (vp). See Routing Topologies for specific equations." },
            { label: "Glass Weave", text: "Glass density (1080 vs 7628) directly alters local Dk values." }
          ]
        },
        {
          title: "Df (Dissipation Factor)",
          color: "orange",
          list: [
            { label: "Definition", text: "Loss tangent; energy absorbed by the board as heat. Directly drives insertion loss (dB/inch)." },
            { label: "FR4 vs Megtron 6", text: "FR4 (0.018) vs Megtron 6 (0.004) at 10 GHz — nearly 5x loss difference." },
            { label: "Impact", text: "Critical for long traces and high-speed SerDes >10Gbps. At high Df, the eye diagram will collapse." }
          ]
        },
        {
          title: "Tg (Glass Transition)",
          color: "green",
          list: [
            { label: "Definition", text: "The temperature where the board softens into a 'rubber' state." },
            { label: "Requirement", text: "Lead-free reflow (260°C) requires High-Tg (>170°C) FR4." },
            { label: "Standard", text: "High-Tg materials prevent via barrel cracking during reflow." }
          ]
        }
      ]
    },
    {
      heading: "Laminate Benchmarks (Thermal & Dielectric)",
      content: "Laminate selection must account for both electrical performance (Dk/Df) and thermal survivability (Tg/Td/CTE). High-speed materials often sacrifice mechanical robustness for lower loss tangent.",
      table: {
        headers: ["Material Class", "Example Product", "Dk (@10GHz)", "Df (@10GHz)", "Tg (°C)", "Td (°C)", "CTE-Z (ppm)"],
        rows: [
          ["Standard FR4", "Isola 370HR", "4.17", "0.0160", "180", "340", "45"],
          { type: 'highlight', data: ["Low-Loss (Speed)", "Panasonic Megtron 6", "3.10", "0.0020", "185", "410", "45"] },
          ["Ultra-Low Loss (RF)", "Rogers RO4350B", "3.66", "0.0031", ">280", "390", "32"],
          ["High-Speed/High-Tg", "TUC TU-883", "3.80", "0.0080", "200", "400", "35"]
        ]
      },
      alerts: [
        { type: 'info', text: "Tg (Glass Transition) is where the board softens. Td (Decomposition) is the 'point of no return' where it loses 5% mass. CTE-Z determines via reliability." }
      ]
    },
    {
      heading: "Copper Weight Reference (IPC-4562A)",
      content: "Copper weight (oz/ft²) is the industry-standard unit defining copper foil thickness. This table provides the definitive SSOT mapping between weight designations, physical thickness, and nominal current capacity for standard trace geometries.",
      table: {
        headers: ["Copper Weight", "Foil Thickness µm (mil)", "Approx. Capacity", "Typical Application"],
        rows: [
          ["0.25 oz (Quarter)", "8.75 (0.34)", "~0.5 A", "RF shields, impedance tuning"],
          ["0.5 oz (Half)", "17.5 (0.69)", "~1.0 A", "High-density signal layers, HDI"],
          { type: 'highlight', data: ["1.0 oz (Standard)", "35.0 (1.37)", "~1.5 A", "Default signal and plane layers"] },
          ["2.0 oz (Heavy)", "70.0 (2.74)", "~2.5 A", "Power distribution, bus bars"],
          ["3.0 oz (Extreme)", "105.0 (4.11)", "~3.5 A", "High-current switching, EV power"],
          ["4.0 oz (Exotic)", "140.0 (5.51)", "~4.5 A", "Defense, extreme power busbars"]
        ]
      },
      alerts: [
            { type: 'info', text: "💡 Pro Tip: 1 oz copper means 1 oz of copper was spread over 1 sq ft, resulting in a thickness of ~35µm (1.37 mil)." },
            { type: 'warning', text: "Current Density: Define copper weight by analyzing the target current (A) against allowable temperature rise. Use 0.5 oz for high-density signals and 2 oz+ for power distribution to prevent excessive current density (A/mm²)." },
            { type: 'info', text: "Current capacity values are approximate for a 10 mil wide external trace with 10°C rise in still air. Use the IPC-2152 calculator above for precise results." }
          ]
    },
    {
      heading: "Industrial Stackup Visualizer",
      content: "A PCB stackup is constructed by alternating copper foil layers with dielectric insulation materials (Prepreg and Core) to reach target board thickness and electrical properties.",
      list: [
        { label: "Build-Up Sequence", text: "Alternating copper conductor layers and dielectric insulation (Core/Prepreg)." },
        { label: "Symmetry", text: "Keeping the top and bottom material stack identical to prevent board warping (bow and twist)." },
        { label: "Reference Planes", text: "Using solid copper planes to provide return paths, EMI shielding, and power distribution." }
      ],
      type: 'visualizer'
    },
    {
      heading: "Standard 8-Layer PCB Construction",
      content: "A standard 1.6mm (62 mil) 8-layer board requires precise material thickness control to achieve target impedances while maintaining mechanical symmetry. Below is a representative 1.6mm build-up using alternating Core and Prepreg construction.",
      table: {
        headers: ["Layer", "Function", "Material Type", "Foil/Dielectric Thickness mil (mm)", "Copper (oz)"],
        rows: [
          ["L1", "Signal (Microstrip)", "Top Solder Mask + Foil", "1.4 (0.035)", "0.5 oz (p)"],
          ["DI-1", "Prepreg", "1080 / 2116 Glass Style", "4.0 (0.100)", "-"],
          ["L2", "Ground Plane", "Core (Reference)", "1.4 (0.035)", "1.0 oz"],
          ["DI-2", "Core", "Dielectric isolation", "8.0 (0.200)", "-"],
          ["L3", "Signal (Stripline)", "Internal Signal", "1.4 (0.035)", "1.0 oz"],
          ["DI-3", "Prepreg", "1080 / 2116 Glass Style", "4.0 (0.100)", "-"],
          ["L4", "Power Plane", "Core (Distribution)", "1.4 (0.035)", "1.0 oz"],
          ["DI-4", "Core", "Mid-Plane Isolation", "8.0 (0.200)", "-"],
          ["L5", "Ground Plane", "Core (Reference)", "1.4 (0.035)", "1.0 oz"],
          ["DI-5", "Prepreg", "1080 / 2116 Glass Style", "4.0 (0.100)", "-"],
          ["L6", "Signal (Stripline)", "Internal Signal", "1.4 (0.035)", "1.0 oz"],
          ["DI-6", "Core", "Dielectric isolation", "8.0 (0.200)", "-"],
          ["L7", "Ground Plane", "Core (Reference)", "1.4 (0.035)", "1.0 oz"],
          ["DI-7", "Prepreg", "1080 / 2116 Glass Style", "4.0 (0.100)", "-"],
          ["L8", "Signal (Microstrip)", "Bottom Solder Mask + Foil", "1.4 (0.035)", "0.5 oz (p)"]
        ]
      },
      alerts: [
        { type: 'info', text: "The above buildup yields exactly 62.8 mil (1.59 mm), falling within the standard ±10% fabrication tolerance. Copper weights on L1/L8 include plating (p)." }
      ]
    },
    {
      heading: "Core vs. Foil Construction",
      content: "Choosing between Foil Build (industry standard) or Core Build determines the lamination sequence and final board rigidity.",
      table: {
        headers: ["Construction Type", "Process", "Primary Benefit", "Standard Application"],
        rows: [
          ["Foil Build", "Copper foil + Prepreg on outer cores", "Cheaper; thinner dielectric control", "Standard 4-10 layer commercial"],
          ["Core Build", "Laminating double-sided cores together", "Increased rigidity; symmetric stability", "Backplanes, high-reliability aerospace"]
        ]
      }
    },
    {
      heading: "Flex PCB Fundamentals (IPC-2223D)",
      standard: {
        title: "IPC-2223D",
        note: "✅ Standard for Flexible/Rigid-Flex PWBs."
      },
      content: "Flexible PCBs replace rigid FR4 with dynamic materials like Polyimide (PI). Understanding adhesive vs. adhesiveless construction and the use of Coverlays (instead of Solder Mask) is critical for reliable flex design.",
      table: {
        headers: ["Material", "Thickness Range", "Dk (@1GHz)", "Application"],
        rows: [
          ["Kapton (PI)", "12.5–125 µm", "3.4", "Standard flex base, high temp"],
          ["UPILEX (PI)", "12.5–75 µm", "3.5", "High-temp/aerospace, stiff"],
          ["PET", "25–125 µm", "3.2", "Low-cost consumer, non-reflow"],
          ["LCP", "25–100 µm", "2.9", "RF/mmWave flex, extreme SI"]
        ]
      },
      alerts: [
        { type: 'info', text: "Adhesiveless PI is preferred over Adhesive-based PI for high-speed signals because the acrylic adhesive has poor loss characteristics." },
        { type: 'warning', text: "Flex boards use Coverlay (polyimide film + adhesive) instead of liquid photoimageable (LPI) solder mask. Solder mask is brittle and will crack under dynamic bending." }
      ]
    },
    {
      heading: "Flex DFM — Bending Radius & Routing Rules",
      content: "The physical mechanics of bending dictate specific routing rules to prevent copper fracturing. The most critical failure mode in flex design is the 'I-Beam' effect, where stacking traces on top of each other creates massive stress concentrations.",
      table: {
        headers: ["Rule", "Static Flex (Bend-to-Install)", "Dynamic Flex (Continuous Bend)"],
        rows: [
          ["Min. Bend Radius", "6× board thickness", "10× board thickness"],
          ["Copper Type", "ED (Electrodeposited) or RA", "RA (Rolled Annealed) ONLY"],
          ["Via Placement", "≥ 2× bend radius from fold", "Not permitted in flex zone"],
          ["Trace Direction", "Perpendicular to fold preferred", "Must be perfectly perpendicular"]
        ]
      },
      alerts: [
        { type: 'danger', text: "The I-Beam Effect: Never route traces directly on top of each other on adjacent flex layers. You must stagger them. Stacked traces act like an I-Beam, resisting bend and causing the outer trace to snap." }
      ]
    },
    {
      heading: "Rigid-Flex Architecture (IPC-2223D)",
      content: "Rigid-Flex designs integrate standard rigid zones with flexible zones in a single monolithic board. The transition zone, where the flex layers 'stub out' into the rigid section, requires precise material overlap definitions.",
      list: [
        { label: "The Stub-Out Architecture", text: "A rigid-flex board might have 8 layers in the rigid zone, but only layers 4 and 5 extend across the flex zone." },
        { label: "Coverlay Boundary Rule", text: "The flexible Coverlay MUST extend at least 1mm (40 mil) inside the rigid zone. It cannot end exactly at the rigid boundary, or the transition will fracture." },
        { label: "Transition Zone", text: "The area where rigid materials end and flex begins. Absolutely no vias, component pads, or solid copper planes are permitted in this zone." }
      ]
    },
    {
      heading: "HDI Fundamentals — IPC-2226 Type Definitions",
      standard: {
        title: "IPC-2226",
        note: "✅ Standard for High-Density Interconnect (HDI) PWBs."
      },
      content: "HDI (High-Density Interconnect) relies on laser-drilled microvias (≤ 150µm) and sequential lamination cycles to achieve massive routing density. HDI architecture is categorized by IPC-2226 Types.",
      table: {
        headers: ["IPC-2226 Type", "Structure", "Min. Drill Size", "Sequential Lam Cycles", "Application"],
        rows: [
          ["Type I (1+N+1)", "1 blind via layer + N through + 1", "150 µm", "1", "Consumer BGA, cost-effective"],
          ["Type II (1+N+1 w/ buried)", "Type I + buried vias in core", "150 µm", "2", "Mid-range mobile, dense routing"],
          ["Type III (2+N+2)", "2 blind via layers each side", "100 µm", "2", "High-density compute, tight pitch"],
          ["Type IV (ELIC)", "Every Layer Interconnect", "75–100 µm", "N-1", "Advanced packaging, smartphones"]
        ]
      },
      alerts: [
        { type: 'warning', text: "Cost Impact: Each sequential lamination cycle adds ~25–40% to board cost and doubles lead time. Use Type I (1 lam cycle) if possible; moving to Type III (2 lam cycles) drastically increases cost." }
      ]
    },
    {
      heading: "HDI Microvia Design Rules",
      content: "Microvia design is fundamentally different from mechanical through-hole design. Laser physics dictate depth limits, and component pitch forces specific pad geometries.",
      list: [
        { label: "Aspect Ratio Limit (1:1)", text: "Unlike mechanical vias (10:1 ratio), laser-drilled microvias cannot exceed a 1:1 depth-to-diameter ratio. A 100µm microvia can only penetrate 100µm deep (typically 1 dielectric layer)." },
        { label: "Stacked vs. Staggered", text: "Staggered microvias offset from layer to layer, providing high reliability. Stacked microvias (aligned vertically) save space but MUST be solid copper-filled to prevent failure during reflow." },
        { label: "Via-in-Pad (VIP)", text: "Mandatory for BGA pitches ≤ 0.5 mm. The via is placed directly inside the BGA pad, then copper-filled and planarized flat so solder paste does not wick down the hole." }
      ],
      alerts: [
        { type: 'info', text: "Via filling types are defined by IPC-4761. Via-in-Pad typically requires IPC-4761 Type VII (Filled and Capped) to ensure a perfectly flat, solderable pad." }
      ]
    },
    {
      heading: "HDI Material Selection",
      content: "HDI requires specialized laminates. The Prepreg layers must have Low Resin Content to remain dimensionally stable, and cores must be laser-drillable (without thick glass weave blocking the laser).",
      table: {
        headers: ["Material", "Dk (@10GHz)", "Df (@10GHz)", "Key Property", "HDI Application"],
        rows: [
          ["Panasonic R-1566W", "3.80", "0.0080", "Laser-drillable, halogen-free", "Standard HDI / any build-up"],
          ["Isola I-Tera MT40", "3.45", "0.0040", "Ultra-low loss, laser-drillable", "HDI high-speed networking"],
          ["Shengyi S1000-2M", "4.00", "0.0150", "Cost-effective, drillable", "Consumer electronics HDI"],
          { type: 'highlight', data: ["Megtron 7", "3.37", "0.0020", "Extreme SI, laser drillable", "Server/AI ELIC architecture"] }
        ]
      }
    },
    {
      heading: "Prepreg Glass Style & Fiber Density",
      content: "Prepreg and core materials are composed of a woven fiberglass matrix filled with resin. The glass style directly influences dielectric consistency, via reliability, and thickness.",
      table: {
        headers: ["Glass Style", "Characteristics", "Typical Thickness", "Common Application"],
        rows: [
          ["1080", "Loose weave, resin-rich, high Dk variation", "~2.5 mil", "Thin dielectrics, filling inner layers"],
          ["2116", "Balanced weave, moderate density", "~4.5 mil", "Standard rigid stackup cores"],
          ["7628", "Dense weave, low resin, stable Dk", "~7.0 mil", "Cost-effective bulk thickness layers"],
          { type: 'highlight', data: ["Spread Glass", "Fibers flattened to eliminate gaps", "Variable", "High-speed routing (reduces skew)"] }
        ]
      }
    },
    {
      heading: "VLP (Very Low Profile) Copper",
      content: "At high frequencies, the 'skin effect' forces current to travel on the outermost surface of the copper trace. If the copper foil is rough to improve laminate adhesion, this current path becomes longer, causing extreme insertion loss.",
      list: [
        { label: "Standard ED Copper", text: "Roughness (Rz) ~5–8 µm. Good for adhesion, terrible for SI >5 GHz." },
        { label: "VLP / HVLP Copper", text: "Roughness (Rz) <2 µm. Essential for differential pairs operating at >10 Gbps (PCIe Gen4+, 10G Ethernet)." },
        { label: "Rolled Annealed (RA)", text: "Extremely smooth, primarily used in dynamic flex circuits due to fatigue resistance." }
      ]
    },
    {
      heading: "Copper Balancing for Lamination Quality",
      content: "Resin starvation occurs during the lamination press cycle if one side of the board has significantly higher copper density than the other, leading to board warpage (bow and twist).",
      list: [
        { label: "The Resin Starvation Risk", text: "Prepreg resin flows toward empty copper areas. If one layer is 'starved,' the board becomes unstable." },
        { label: "Copper Thieving", text: "Adding 'dead' copper pads or pours in open board areas to equalize the copper density and resin flow." },
        { label: "Lamination Balance", text: "Maintain a symmetric copper density (±10%) about the board's vertical center plane." }
      ],
      alerts: [
        { type: 'info', text: "Copper density balance (target ±10%) is one of the rules validated in the DFM Rule Checker. Run the full DFM verification in the DFM/DFT Mastery module after stackup is finalized." }
      ]
    },
    {
      heading: "Routing Topologies & Impedance Control",
      content: "The propagation speed and characteristic impedance (Z₀) of a signal change depending on if it is on the surface (Microstrip) or embedded between planes (Stripline).",
      twoColumnGrid: [
        {
          badge: "Microstrip",
          badgeClass: "tool-badge-altium",
          title: "Surface Layers",
          items: [
            "Trace sits on outer surface; field partly in air",
            "εr,eff < εr (Faster propagation speed)",
            "Easier to debug but prone to EMI emissions",
            "Differential Microstrip requires spacing (S) control"
          ]
        },
        {
          badge: "Stripline",
          badgeClass: "tool-badge-cadence",
          title: "Inner Layers",
          items: [
            "Trace embedded between two ground planes",
            "εr,eff = εr (Full material Dk speed path)",
            "Best EMI shielding and return path isolation",
            "Symmetric Stripline uses balanced heights (H1=H2)"
          ]
        }
      ],
      type: "stackup-cross-section"
    },
    {
      heading: "Universal Impedance Solver",
      standard: {
        title: "IPC-2141B (2017)",
        note: "✅ Industry standard for controlled impedance modeling."
      },
      content: "Impedance control ensures that your electrical signals arrive at their destination without 'bouncing' back. This solver calculates the exact trace width needed to match your circuit's requirements.",
      list: [
        { label: "The Echo", text: "Impedance mismatch causes signal reflection coefficient Γ = (ZL−Z₀)/(ZL+Z₀). This creates data errors." },
        { label: "The Solution", text: "Adjusting width and spacing to reach 50Ω (Single) or 100Ω (Diff)." },
        { label: "The Rule", text: "Moving the trace closer to the ground plane lowers impedance." }
      ],
      type: 'calculator'
    },
    {
      heading: "Return Currents: High-Frequency Physics",
      content: "Every signal needs a return path. At frequencies above 1 MHz — and critically above 100 MHz for all modern digital signals — return current concentrates directly beneath the signal trace.",
      list: [
        { label: "High-Frequency Physics", text: "Return current concentrates directly beneath the signal trace to minimize the loop area." },
        { label: "Inductance Rule", text: "Minimizing loop area between the signal and plane reduces EMI and crosstalk." },
        { label: "Discontinuity Risk", text: "Crossing a gap (split) in a reference plane forces a long return path, causing massive EMI radiation." }
      ],
      alerts: [
        { type: 'danger', text: "Never route a high-speed signal across a split in its reference plane. Use stitching capacitors if a cross-over is unavoidable." }
      ]
    },
    {
      heading: "Power Plane Segmentation Strategy",
      content: "Modern designs require multiple voltage rails (e.g., 3.3V, 1.8V, VDDIO). Allocating these rails on internal power planes requires careful segmentation to avoid return path destruction.",
      mistakeList: [
        { mistake: "Crossing the Split", fix: "Signal traces on adjacent layers MUST NOT cross the anti-etch boundary between two different power plane zones. This forces the return current to take a massive detour, acting as a slot antenna." },
        { mistake: "Inadequate Clearance", fix: "Maintain at least 1mm (40 mil) clearance between different power plane polygons to prevent accidental shorts during fabrication." },
        { mistake: "Orphaned Shapes", fix: "Avoid creating narrow 'peninsulas' or isolated islands of copper when splitting planes, which act as un-damped resonators." }
      ]
    },
    {
      heading: "Via Stitching / Ground Stitch Strategy",
      content: "When a high-speed signal transitions between layers, its reference plane also changes. Return current must jump between these planes. Without a dedicated path, the current will find the nearest decoupling capacitor, creating a massive inductive loop.",
      ruleCards: [
        {
          number: "01",
          title: "Adjacent GND Stitching",
          severity: "warning",
          body: "Always place a Ground Stitching Via within 1.0mm (40 mil) of the signal via when transitioning between two layers that are both referenced to Ground."
        },
        {
          number: "02",
          title: "PWR-to-GND Transitions",
          severity: "danger",
          body: "If a signal transitions from a Ground-referenced layer to a Power-referenced layer, you MUST place a stitching capacitor adjacent to the signal via to couple the planes."
        }
      ]
    },
    {
      heading: "Current Carrying Capacity (IPC-2152)",
      content: "Calculate the required trace width for high-current paths based on modern IPC-2152 standards. Internal vs. external dissipation physics are canonically handled in the Thermal module.",
      type: 'cross-ref',
      refModuleId: 'thermal',
      refTargetHeading: 'IPC-2152 Current Capacity Solver',
      refLabel: 'Launch Interactive IPC-2152 Solver →',
      refDesc: 'The interactive Current Capacity Solver with substrate-specific thermal conductivity modeling is located in the Thermal Management module.'
    },
    {
      heading: "High-Speed Signal Integrity: Fiber Weave Skew",
      content: "Fiber weave skew is what happens when the 'fabric' of your board causes one signal in a pair to travel slower than the other. This tool helps you choose the right glass style to keep your data synchronized.",
      list: [
        { label: "The Fabric Effect", text: "Board material is a weave of glass and resin with different speeds." },
        { label: "The Skew", text: "If one wire sits on glass and the other on resin, they arrive at different times." },
        { label: "The Solution", text: "Using 'Spread Glass' or routing at an angle ensures both wires see the same speed." }
      ],
      type: 'fiber-weave'
    },
    {
      heading: "DFM Validation — Key Stackup Rules",
      standard: {
        title: "IPC-2221B (2012)",
        note: "✅ Base standard for generic PCB design rules."
      },
      content: "Before finalizing your stackup, verify these three critical IPC-2221B manufacturing limits that are directly driven by stackup geometry decisions:",
      list: [
        { label: "Aspect Ratio (IPC-2221B)", text: "Board Thickness ÷ Smallest Drill Diameter must be ≤ 10:1 for standard fab, ≤ 12:1 maximum. A 1.6mm board with a 0.2mm drill = 8:1 — acceptable. With 0.1mm drill = 16:1 — will cause plating failures." },
        { label: "Copper-to-Drill Clearance", text: "Minimum 0.125mm (5 mil) from drill edge to nearest copper on adjacent layers. Verify after all via assignments are defined in the stackup." },
        { label: "Copper Density Balance", text: "Copper coverage on symmetric layer pairs (L1/L8, L2/L7, etc.) should be within ±10%. Use the Copper Thieving pattern from the section above to equalize." }
      ],
      type: 'cross-ref',
      refModuleId: 'dfm_dft',
      refLabel: 'Run Full Interactive DFM Rule Checker → DFM / DFT Mastery',
      refDesc: 'The interactive DFM Rule Checker validates all three rules above in real time against IPC-2221B and IPC-6012 limits. It is the canonical DFM verification tool, located in the DFM / DFT Mastery module.'
    },
    {
      heading: "Via Technologies: Aspect Ratio & DFM",
      content: "Vias transition signals between layers. This calculator ensures your board is 'buildable' by checking the Aspect Ratio—the relationship between board thickness and hole size.",
      list: [
        { label: "The Drill Limit", text: "If the hole is too deep and too thin, the copper 'plating' cannot reach the middle." },
        { label: "The 10:1 Rule", text: "Standard fabrication stays below a 10:1 ratio for high reliability." },
        { label: "Z-Axis Expansion", text: "Thicker boards expand more when heated, putting stress on thin vias." }
      ],
      type: 'aspect-ratio-calc'
    },

    {
      heading: "IPC Standards Compliance",
      content: "Specify laminates by IPC slash-sheet designators in your SSOT — never by brand name alone — to prevent unauthorized substitutions.",
      table: {
        headers: ["Standard", "Title", "Design Hub Application"],
        rows: [
          ["IPC-2221B", "Generic PWB Design", "Electrical clearances, via aspect ratios"],
          ["IPC-2222", "Sectional Standard for Rigid", "Rigid organic board requirements"],
          { type: 'highlight', data: ["IPC-2223D", "Flex/Rigid-Flex Design", "Bending radius, coverlay, transition rules"] },
          { type: 'highlight', data: ["IPC-2226", "HDI Design Standard", "Microvia types, sequential lam rules"] },
          ["IPC-4101C", "Rigid Base Materials", "/21 (Std FR4), /24 (High-Tg), /99 (Halogen-Free)"],
          ["IPC-4562A", "Metal Foil Standard", "ED, RA, and VLP copper foil specifications"],
          { type: 'highlight', data: ["IPC-4761", "Via Protection", "Via fill/cap designation system (e.g. Type VII)"] },
          ["IPC-6012E", "Qualification & Perf.", "Acceptance criteria (Bow/Twist <0.75%)"],
          { type: 'highlight', data: ["IPC-6013", "Flex Qualification", "Acceptance criteria for flex/rigid-flex PWBs"] },
          ["IPC-1601A", "Handling & Storage", "Mandatory bake-out (125°C) to prevent delamination"]
        ]
      }
    },
    {
      heading: "SSOT Intelligence & Export Formats",
      content: "Standard Gerber RS-274X is a 'dumb' format that only contains geometry. For professional stackup handovers, use intelligent formats that carry the SSOT definition.",
      table: {
        headers: ["Format", "Intelligence", "Content", "Preferred Usage"],
        rows: [
          ["IPC-2581", "Full SSOT", "Stackup, materials, Dk/Df, netlist, BOM", "Modern 1st Choice; Vendor Preferred"],
          ["ODB++", "High-Level", "Layer stackup, component footprints, netlist", "Industry Standard; Tool agnostic"],
          ["Gerber RS-274X", "Zero", "Only lines and polygons (Apertures)", "Legacy; Requires manual FAB drawing"]
        ]
      },
      alerts: [
        { type: 'info', text: "Exporting in IPC-2581 allows the fabricator to verify impedance targets against actual material Dk in their software automatically." }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Material Selection",
      items: [
        "Laminate specified by IPC-4101 slash-sheet designer.",
        "Thermal properties (Tg/Td) meet assembly heat profile.",
        "VLP copper grade specified for high-speed differential pairs.",
        "CTE-Z value confirmed to prevent via fatigue.",
        "Dk/Df values verified at target operational frequency."
      ]
    },
    {
      category: "2. Mechanical Symmetry",
      items: [
        "Stackup has an EVEN number of layers (required for balance).",
        "Material types mirrored exactly about the board midplane.",
        "Copper density balanced on opposite layers (Copper Thieving).",
        "Overall thickness tolerance meets IPC-6012 Class 2/3 (<10%).",
        "Bow and Twist tolerance documented on fabrication drawing."
      ]
    },
    {
      category: "3. Electrical Design",
      items: [
        "Impedance targets calculated with Single-Ended and Diff models.",
        "Symmetric Stripline heights (H1=H2) maintained for consistency.",
        "Reference planes (GND/PWR) are adjacent to every signal layer.",
        "Return paths cleared: No signals routing over plane splits.",
        "Trace spacing (S) defined to hit differential Zdiff goals."
      ]
    },
    {
      category: "4. DFM & Fabrication Export",
      items: [
        "Aspect Ratio (Thickness/Drill) verified to be ≤ 10:1.",
        "Layer stackup table included in the SSOT Fab Drawing.",
        "Microvia stack/stagger rules follow IPC-2226.",
        "Export format selected: IPC-2581 or ODB++ for stackup parity.",
        "Fabricator confirmation for High-Tg lamination sequence."
      ]
    },
    {
      category: "5. Flex / Rigid-Flex Design",
      items: [
        "Coverlay boundaries extend ≥ 1mm into rigid zone.",
        "Bend radius confirmed: ≥ 10× thickness (dynamic), ≥ 6× (static).",
        "Rolled Annealed (RA) copper specified for dynamic flex zones.",
        "No vias, fills, or cuts placed within the flex transition zone.",
        "IPC-2223D Class (1/2/3) documented on FAB drawing."
      ]
    },
    {
      category: "6. HDI Design",
      items: [
        "IPC-2226 Type (I/II/III/IV-ELIC) defined and documented.",
        "Microvia aspect ratio confirmed ≤ 1:1 (laser drill).",
        "Via-in-Pad (VIP) copper-filled and planarized where pitch ≤ 0.5 mm.",
        "Stacked vs. staggered microvia strategy documented per class requirement.",
        "Sequential lamination cycle count confirmed with fabricator."
      ]
    }
  ]
};
