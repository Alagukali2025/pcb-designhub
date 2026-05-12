export const content = {
  intro: "DDR Routing is fundamentally about precise signal synchronization. At high data rates, 64 parallel signals must arrive at the memory chip within a fraction of a nanosecond of each other. Even a tiny mismatch in the physical length of the copper traces causes signals to arrive out of sync, leading to data corruption. DDR (Double Data Rate) SDRAM is one of the most timing-sensitive interfaces on a modern PCB. Routing it requires more than just connecting dots — it requires managing nanosecond timing windows, controlled-impedance transmission lines, and complex power delivery networks. This guide serves as the Single Source of Truth for DDR3, DDR4, and DDR5 layout engineering.",
  sections: [
    {
      heading: "DDR Generations Comparison",
      content: "The transition from DDR3 to DDR5 involves significant changes in voltage, signaling, and power management. Layout rules for one generation are NOT interchangeable with another.",
      table: {
        headers: ["Parameter", "DDR1", "DDR2", "DDR3", "DDR4", "DDR5", "PCB Impact"],
        rows: [
          ["Standard", "JESD79", "JESD79-2", "JESD79-3F", "JESD79-4B", "JESD79-5B", "Constraint Basis"],
          ["Data Rate", "up to 400 MT/s", "up to 1066 MT/s", "up to 2133 MT/s", "up to 3200 MT/s", "up to 6400+ MT/s", "Tighter matching"],
          ["Voltage", "2.5 V", "1.8 V", "1.5 V", "1.2 V", "1.1 V", "Reduced noise margin"],
          ["Topology", "T-Branch", "T-Branch", "Fly-by (Opt)", "Fly-by (Mandatory)", "Fly-by (Mandatory)", "Write leveling req."],
          ["Vref", "External", "External", "External pin", "Internal", "Internal", "Less Vref routing"],
          ["tCK min", "~5.0 ns", "~1.87 ns", "~0.94 ns", "~0.625 ns", "~0.3 ns", "Lower skew budget"],
          ["Bus Width", "64-bit", "64-bit", "64-bit", "64-bit", "2×32-bit sub-ch", "Independent routing"],
          ["IO Standard", "SSTL_2", "SSTL_18", "SSTL_15", "POD_12", "PODL_11", "Termination scheme"]
        ]
      }
    },
    {
      heading: "Key Signal Groups & Definitions",
      content: "DDR signals are logically grouped to maintain timing synchronicity. Violating the grouping rules is the most common cause of memory training failures.",
      filletGrid: [
        {
          title: "Data Group (DQ/DQS) — The Packages",
          color: "blue",
          list: [
            { label: "DQ[0:n]", text: "Data bits. Matched to their specific DQS strobe." },
            { label: "DQS / DQS#", text: "Differential strobe. THE most critical timing reference." },
            { label: "DM / DBI#", text: "Data Mask / Bus Inversion. Reduces switching noise." }
          ]
        },
        {
          title: "Address/Command (ADDR/CMD) — The Map & Instructions",
          color: "orange",
          list: [
            { label: "A[0:n]", text: "Row/Column address lines. Sampled on CK rising edge." },
            { label: "BA / BG", text: "Bank Address/Group. BG is critical for DDR4/5." },
            { label: "CS# / CKE", text: "Chip Select and Clock Enable. Low-speed control." }
          ]
        },
        {
          title: "Clock Group (CK / CK#) — The Master Beat",
          color: "cyan",
          list: [
            { label: "CK / CK#", text: "Differential system clock. Master reference for ADDR/CMD." },
            { label: "Reset#", text: "Asynchronous reset. Matched to ADDR/CMD group." },
            { label: "Alert#", text: "Error flag (DDR4/5). Low-speed open-drain output — does not require impedance control." }
          ]
        }
      ]
    },
    {
      heading: "Advanced BGA Fanout & Via Control",
      content: "As data rates exceed 3200 MT/s, the via fanout becomes a major impedance discontinuity. Selecting the right breakout strategy is critical for signal integrity and manufacturability.",
      twoColumnGrid: [
        {
          badge: "Dogbone Fanout",
          badgeClass: "tool-badge-altium",
          title: "Standard Density",
          items: [
            "Lower cost (uses standard drilling with no via-filling required).",
            "Short trace (the 'bone') adds parasitic inductance, degrading high-speed signals.",
            "Suitable for DDR3 and low-speed DDR4 designs.",
            "Takes up surface space, limiting room for decoupling capacitors on the bottom."
          ]
        },
        {
          badge: "Via-In-Pad (VIP)",
          badgeClass: "tool-badge-cadence",
          title: "High-Speed Standard",
          items: [
            "Mandatory for DDR5 and small pitch (dense) BGAs.",
            "Eliminates trace length to minimize inductance and maximize signal integrity.",
            "Allows routing directly on the same layer or dropping straight down.",
            "Increases cost because vias must be epoxy-filled and plated over for flat soldering."
          ]
        }
      ]
    },
    {
      heading: "Controlled Impedance Specifications",
      content: "All DDR traces must be treated as transmission lines. Impedance tolerance of ±10% is the JEDEC standard, though ±7% is preferred for high-reliability designs. Note: DDR1 used single-ended DQS (marked * in the table). DDR2 onwards uses differential DQS pairs for improved noise rejection.",
      table: {
        headers: ["Signal Group", "Topology", "DDR1 Target", "DDR2 Target", "DDR3 Target", "DDR4/5 Target", "Tolerance"],
        rows: [
          ["DQ / DM / DBI", "Single-ended", "60Ω", "50-60Ω", "50Ω", "50Ω", "±10%"],
          ["DQS / DQS#", "Differential", "60Ω (SE)*", "100Ω", "100Ω", "100Ω", "±10%"],
          ["CK / CK#", "Differential", "100Ω", "100Ω", "100Ω", "100Ω", "±10%"],
          ["ADDR / CMD", "Single-ended", "60Ω", "50-60Ω", "50–60Ω", "50Ω", "±10%"],
          ["VTT Stub (DDR3)", "Fly-by stub", "N/A", "N/A", "50Ω", "N/A (ODT)", "±10%"]
        ]
      },
      alerts: [
        { type: "danger", text: "Never route DDR signals over a split plane boundary. The resulting return path detour creates an inductive loop that destroys signal integrity and causes massive EMI." }
      ]
    },
    {
      heading: "On-Die Termination (ODT) Configuration",
      content: "On-Die Termination (ODT) replaces external VTT resistors starting from DDR3. The DRAM chip activates internal resistors to absorb signal reflections. Incorrect ODT settings are the #1 cause of DDR4/5 training failures — even with perfect routing.",
      table: {
        headers: ["ODT Value", "DDR3 Support", "DDR4 Support", "DDR5 Support", "Typical Use Case"],
        rows: [
          ["34Ω", "—", "✓", "✓", "High-speed DDR5 point-to-point"],
          ["40Ω", "40Ω", "✓", "✓", "Default for DDR4-3200"],
          ["48Ω", "—", "✓", "✓", "DDR5 balanced power/SI"],
          ["60Ω", "60Ω", "✓", "✓", "DDR3/DDR4 moderate speed"],
          ["80Ω", "—", "✓", "—", "DDR4 low-power"],
          ["120Ω", "120Ω", "✓", "—", "DDR3 low-speed"],
          ["240Ω", "—", "✓", "—", "DDR4 minimal termination"]
        ]
      },
      list: [
        { label: "RTT_NOM", text: "Termination applied when the DRAM is NOT being written to. Controls reflections from idle receivers." },
        { label: "RTT_WR", text: "Termination activated during WRITE operations. Absorbs the incoming signal to prevent reflections back to the controller." },
        { label: "RTT_PARK", text: "(DDR4/5 only) Persistent termination on non-target ranks. Critical for dual-rank DIMM designs." }
      ],
      alerts: [
        { type: "warning", text: "ODT values are set in the BIOS/firmware Mode Register Set (MRS) commands. The PCB layout engineer cannot change ODT — but incorrect trace impedance will make any ODT setting ineffective. Always verify that your trace Z₀ matches the ODT target." },
        { type: "info", text: "DDR5 uses PODL (Pseudo Open Drain Low-Side) signaling, which changes the termination scheme. The DRAM terminates to VSS (ground) instead of VDDQ. This means the return current path is through the ground plane, making ground plane integrity even more critical." }
      ]
    },
    {
      heading: "Timing Budgets & Length Matching",
      content: "Every byte lane is an independent timing domain. While inter-lane matching is flexible, INTRA-lane matching (DQ to DQS) has zero margin for error. Think of each byte as a team that must arrive together; while different teams can arrive at slightly different times, members of the same team cannot be separated.",
      table: {
        headers: ["Rule", "DDR1", "DDR2", "DDR3", "DDR4", "DDR5", "Impact of Violation"],
        rows: [
          ["DQ to DQS (intra-byte)", "±100 mil", "±50 mil", "±25 mil", "±25 mil", "±15 mil", "Setup/Hold Violations"],
          ["DQS+/- Intra-pair Skew", "N/A (SE)", "±10 mil", "±5 mil", "±5 mil", "±5 mil", "Common-Mode Noise"],
          ["ADDR/CMD Intra-group", "±100 mil", "±100 mil", "±50 mil", "±25 mil", "±25 mil", "Command Phase Error"],
          ["Max DQ Trace Length", "3500 mil", "3000 mil", "2500 mil", "2000 mil", "1500 mil", "Excessive Channel Loss"]
        ]
      },
      alerts: [
        { type: "info", text: "Pedagogical Note: Values with '±' represent the allowed length matching tolerance (skew) between signals in a group. For example, a ±100 mil tolerance means that if your reference signal is 2000 mils long, all other signals in that group must be between 1900 and 2100 mils. Absolute values (like 3500 mil) represent the absolute maximum allowed length for a trace." },
        { type: "danger", text: "Expert Timing: Pad-to-Pad matching is NOT enough for DDR4/5. You must include the 'Pin-to-Die' package delay (provided by the SoC/CPU vendor) in your length-matching constraints. The package can add 50-150 mils of skew that is invisible to standard DRCs." }
      ],
      formula: {
        title: "Propagation Delay (FR4 Stripline)",
        equations: [
          "Vp ≈ c / √εr_eff  ≈ 5.7 mil/ps",
          "Delay (ps) = Length (mil) / Vp",
          "15 mil mismatch (DDR5) ≈ 2.6 ps timing loss"
        ],
        variables: [
          { name: "Vp", desc: "Propagation velocity in dielectric", tag: "PROP" },
          { name: "UI", desc: "Unit Interval (bit time)", tag: "MATH" }
        ]
      },
      type: "byte-lane-visual"
    },
    {
      heading: "Routing Topology: Fly-By Design",
      content: "Fly-by topology (mandatory for DDR4/5) chains Address, Command, Control, and Clock signals through each DRAM in sequence. This introduces intentional skew that is corrected by the memory controller's 'Write Leveling' training.",
      list: [
        { label: "Concept", text: "Instead of trying to reach all chips at once, the signal chains through them in sequence—like a postman delivering mail house-by-house." },
        { label: "Benefit", text: "Eliminates signal 'bounces' (reflections) that occur when splitting traces at high speeds (DDR4/5)." },
        { label: "Trade-off", text: "Because signals travel in sequence, the first chip hears the message before the last chip." },
        { label: "Fix", text: "The CPU runs 'Write Leveling' training to artificially delay signals and sync all chips perfectly." },
        { label: "Golden Rule", text: "This applies ONLY to Address, Command, and Clock signals. Data lines remain strictly Point-to-Point." }
      ],
      ruleCards: [
        {
          number: "01",
          title: "Monotonic Delay",
          severity: "info",
          body: "Signals must pass each DRAM sequentially. The controller uses training to calculate the exact arrival time at each chip."
        },
        {
          number: "02",
          title: "Stub Length Control",
          severity: "danger",
          body: "Max fly-by stub length: <150 mil (DDR4) / <100 mil (DDR5). Long stubs create resonant notches that close the eye diagram."
        },
        {
          number: "03",
          title: "VTT Termination",
          severity: "warning",
          body: "For DDR3, place VTT parallel termination resistors at the very end of the fly-by chain, within 100 mil of the last DRAM."
        }
      ],
      alerts: [
        { type: "danger", text: "CRITICAL: Data (DQ/DQS) signals are NOT routed in Fly-by topology. They are strictly Point-to-Point per byte lane to minimize loading and maximize speed." },
        { type: "info", text: "T-branch (Y-topology) is legacy. At DDR4/5 speeds, the impedance mismatch at the branch point creates multi-reflection noise that prevents high-speed boot." },
        { type: "warning", text: "Expert Insight: Write Leveling. Fly-by topology creates an intentional skew where the clock (CK) arrives at each DRAM at a different time. The memory controller 'learns' these delays during the 'Write Leveling' phase of training, shifting the DQS strobes to compensate. This allows the layout engineer to focus on intra-byte matching rather than absolute length matching across the entire bus." },
        { type: "info", text: "Read Leveling (Read DQS Gate Training). While Write Leveling compensates for CK-to-DQS skew during writes, Read Leveling trains the controller to correctly capture the DQS strobe returning from each DRAM during reads. The controller learns the round-trip delay for each byte lane. Both trainings are mandatory for DDR4/5 and run automatically during every power-on (BIOS POST). Poor routing symmetry within a byte lane will cause training to fail or produce marginal results." }
      ],
      type: "flyby-topology-visual"
    },
    {
      heading: "Legacy Routing: T-Branch Topology",
      content: "Before DDR3, the standard routing topology was T-Branch (or Star). This method split signals equally to all DRAM chips. While simpler to understand, it creates impedance discontinuities at every branch point, limiting maximum speed.",
      ruleCards: [
        {
          number: "01",
          title: "Symmetric Routing",
          severity: "info",
          body: "Traces from the controller to each DRAM must be of identical length and impedance to ensure simultaneous signal arrival."
        },
        {
          number: "02",
          title: "Speed Limitations",
          severity: "warning",
          body: "The reflection noise at the split points makes T-Branch unusable for data rates above 1066 MT/s."
        }
      ]
    },
    {
      heading: "Power Integrity & Decoupling Hierarchy",
      content: "VDDQ noise tolerance is ±22 mV for DDR5 (DC specification; the AC noise budget is tighter at high frequencies, typically ~15 mV). A poorly designed PDN (Power Delivery Network) will cause intermittent memory errors that are impossible to find with standard DRCs.",
      twoColumnGrid: [
        {
          badge: "Placement",
          badgeClass: "tool-badge-altium",
          title: "Under-BGA Decoupling",
          items: [
            "Place caps on BOTTOM side directly under DRAM pins.",
            "Use VIP (Via-in-Pad) for lowest loop inductance.",
            "100nF + 10nF hierarchy minimum per DRAM. 1nF optional — verify Self-Resonant Frequency (SRF) vs. target frequency before adding.",
            "2 vias per capacitor pad to halve parasitic ESL."
          ]
        },
        {
          badge: "PDN Design",
          badgeClass: "tool-badge-cadence",
          title: "VDDQ Rail Engineering",
          items: [
            "Target Impedance Ztarget < 24 mΩ (DDR4).",
            "Maintain Ztarget up to the 5th harmonic.",
            "Keep PWR and GND planes adjacent (2–4 mil gap).",
            "Verify no anti-pad overlap in power layers."
          ]
        }
      ]
    },
    {
      heading: "Common Routing Mistakes",
      content: "Avoid these common DDR pitfalls to ensure your design passes first-spin JEDEC compliance testing.",
      mistakeList: [
        { 
          mistake: "DQS pair split across layers.", 
          fix: "Always route + and - on the identical layer and proximity.",
          explanation: "DQS is a 'Differential Pair' (a team of two wires carrying opposite signals). They must stay together on the same layer to cancel noise."
        },
        { 
          mistake: "Routing DDR over a split power plane.", 
          fix: "Ensure a continuous GND reference plane for every single DDR layer.",
          explanation: "Electricity flows in a loop. The layer below the wire is the return path. A split is a gap; crossing it forces a long detour, creating noise."
        },
        { 
          mistake: "Tight serpentine meanders (gap < 3W).", 
          fix: "Follow the 3W rule internally for meanders to prevent self-coupling.",
          explanation: "We wiggle wires to match length. The gap between wiggles must be 3x the wire width, or the signal jumps the gap (self-coupling) and ruins timing."
        },
        { 
          mistake: "Missing GND return vias at layer changes.", 
          fix: "Place stitching GND vias within 20 mil of every signal layer transition.",
          explanation: "When a signal jumps layers, its return current on the ground layer must jump too. A stitching via acts as a bridge for the return current."
        }
      ]
    },

    {
      heading: "DRAM Placement Guidelines",
      content: "Component placement determines 80% of your routing success. Poor DRAM placement cannot be fixed by clever routing — you must get placement right first.",
      ruleCards: [
        {
          number: "01",
          title: "Maximum Distance",
          severity: "danger",
          body: "Place all DRAMs within 1.5 inches (38 mm) of the memory controller BGA. Every additional inch adds ~170 ps of propagation delay and increases channel loss."
        },
        {
          number: "02",
          title: "Linear Alignment",
          severity: "info",
          body: "Align DRAMs in a clean straight line for Fly-by topology. Staggered or offset placement makes monotonic delay impossible and increases stub lengths."
        },
        {
          number: "03",
          title: "Orientation Consistency",
          severity: "warning",
          body: "Orient all DRAMs identically (same pin 1 corner direction). Mixed orientation doubles fanout complexity and creates asymmetric byte lane lengths."
        }
      ],
      alerts: [
        { type: "info", text: "DDR5 Sub-Channel Tip: DDR5 splits the 64-bit bus into two independent 32-bit sub-channels (Channel A and Channel B). Each sub-channel has its own CA (Command/Address) bus and independent timing. Place DRAMs so that each sub-channel's routing has a clean, isolated path — do not interleave sub-channel A and B routing." }
      ]
    },
    {
      heading: "Crosstalk Spacing Rules",
      content: "Crosstalk occurs when electromagnetic fields from one trace couple into an adjacent trace. In DDR routing, crosstalk directly adds to timing jitter and reduces the eye opening.",
      table: {
        headers: ["Rule", "Spacing", "Application", "Consequence of Violation"],
        rows: [
          ["3W Rule (Intra-group)", "3× trace width", "DQ signals within same byte lane", "Tolerable coupling (~1% crosstalk)"],
          ["5W Rule (Inter-group)", "5× trace width", "CK to DQ, DQ to ADDR/CMD", "Excessive coupling breaks timing"],
          ["DQS Guard Band", "≥20 mil clearance", "DQS pair to any non-paired signal", "Jitter injection into strobe"],
          ["CK Isolation", "5W or ground guard", "CK/CK# to all other DDR signals", "Clock jitter → system-wide failure"]
        ]
      },
      alerts: [
        { type: "warning", text: "The 3W rule means edge-to-edge spacing equals 2× trace width (total center-to-center = 3W). For a 4 mil trace: 3W = 12 mil center-to-center, or 8 mil gap. For DDR5, use 5W between different signal groups to prevent far-end crosstalk (FEXT)." },
        { type: "info", text: "Practical Tip: If board space is tight, use a ground guard trace (grounded copper pour or a dedicated ground trace) between critical signal groups instead of increasing spacing. This provides >20 dB crosstalk isolation." }
      ]
    },
    {
      heading: "Via Stub Management & Back-Drilling",
      content: "When a signal via passes through the entire board but connects on an inner layer, the unused portion below the connection point is called a 'stub.' At DDR5 frequencies, these stubs act as resonant antennas that create deep notches in the signal spectrum.",
      twoColumnGrid: [
        {
          badge: "The Problem",
          badgeClass: "tool-badge-altium",
          title: "Stub Resonance",
          items: [
            "A via stub resonates at f = c / (4 × stub_length × √εr).",
            "A 60 mil stub in FR4 resonates at ~12.5 GHz — directly in the DDR5 5th harmonic.",
            "The resonance creates a 'notch' that kills the signal at that frequency.",
            "Even 10 mil stubs can degrade margins at DDR5-6400."
          ]
        },
        {
          badge: "The Fix",
          badgeClass: "tool-badge-cadence",
          title: "Back-Drilling / Blind Vias",
          items: [
            "Back-drilling: Fab house drills out the unused stub portion after plating.",
            "Blind vias: Only drill from surface to the target layer (no stub created).",
            "Target residual stub length after back-drill: < 10 mil.",
            "Specify back-drilling in fabrication notes for all DDR5 signal vias."
          ]
        }
      ],
      alerts: [
        { type: "danger", text: "Back-drilling adds $0.5–$2 per board to fabrication cost but is mandatory for DDR5 designs with board thickness > 1.6 mm. The alternative is to use blind/buried vias, which cost even more but eliminate stubs entirely." }
      ]
    },
    {
      heading: "Layer Assignment Strategy",
      content: "Assigning DDR signal groups to specific PCB layers is critical for maintaining isolation between groups and ensuring clean reference planes. A poor layer assignment creates crosstalk between byte lanes and ADDR/CMD groups.",
      table: {
        headers: ["Signal Group", "Recommended Layer Type", "Reference Plane", "Rationale"],
        rows: [
          ["CK / CK#", "Inner stripline (dedicated)", "GND above + GND below", "Maximum shielding for clock jitter"],
          ["DQ / DQS (Byte Lanes)", "Inner stripline", "GND reference", "Balanced coupling, low crosstalk"],
          ["ADDR / CMD", "Inner stripline or microstrip", "GND reference", "Separate from DQ for isolation"],
          ["Power (VDDQ, VPP)", "Dedicated plane layers", "Adjacent to GND", "Low-impedance PDN"]
        ]
      },
      list: [
        { label: "Golden Rule", text: "Never route DQ and ADDR/CMD on the same layer. They have different timing domains and will cross-couple." },
        { label: "Stripline vs Microstrip", text: "Stripline (inner layers) provides natural shielding between two reference planes. Microstrip (outer layer) is exposed and more susceptible to EMI and crosstalk. Use stripline for all DDR4/5 signals when possible." },
        { label: "Layer Transitions", text: "If a signal must change layers, always place a GND stitching via within 20 mil of the signal via to provide return current continuity." }
      ]
    },
    {
      heading: "DDR5 Power & Sideband Engineering",
      content: "DDR5 introduces the PMIC (Power Management IC) directly on the DIMM/PCB. This requires a dedicated focus on thermal management and I3C sideband signal integrity.",
      filletGrid: [
        {
          title: "PMIC Thermal Management",
          color: "orange",
          list: [
            { label: "Thermal Pad", text: "Must use a 4x4 or 5x5 array of thermal vias to L2 GND." },
            { label: "Input Power", text: "VIN_BULK (5V) needs high-current wide copper pours." },
            { label: "Stability", text: "Keep inductor-switching nodes compact to minimize EMI." }
          ]
        },
        {
          title: "SPD Hub & I3C Sideband",
          color: "blue",
          list: [
            { label: "Protocol", text: "Uses I3C (typically 1 MHz for SPD Hub; max 12.5 MHz per MIPI spec) for module identification." },
            { label: "Isolation", text: "Separate I3C signals from high-speed DQ lanes by >50 mil." },
            { label: "Reference", text: "Always reference sideband signals to a continuous GND plane." }
          ]
        }
      ]
    },
    {
      heading: "Fiber Weave Effect Mitigation",
      content: "For DDR4-3200 and DDR5-6400, the periodic variation in dielectric constant (Dk) caused by the glass weave can introduce deterministic skew that ruins timing margins.",
      type: "cross-ref",
      refModuleId: "stackup",
      refTargetHeading: "High-Speed Signal Integrity: Fiber Weave Skew",
      refLabel: "Open Fiber Weave Analyzer → Stackup Design",
      refDesc: "Interactive glass weave simulation and Dk variation calculators are canonically located in the Stackup Design module to ensure alignment with material laminate specifications.",
      alerts: [
        { type: "warning", text: "If using standard FR4 (e.g., 7628 weave), mitigate fiber weave skew by specifying spread-glass weave (e.g., 1078 or 3313) from the fabricator. Alternative theoretical mitigations include rotating the DDR layout by 10° or using zig-zag routing, but spread-glass is the most practical production solution." }
      ]
    },
    {
      heading: "Interactive: DDR Timing Margin Calculator",
      content: "Quantify how much of your total timing window (UI) is consumed by physical PCB layout choices. Enter your design parameters below to see the impact.",
      type: "ddr-timing-calculator"
    },
    {
      heading: "IBIS/IBIS-AMI Simulation Guidance",
      content: "IBIS (Input/Output Buffer Information Specification) models describe the electrical behavior of IC pins. IBIS-AMI extends this with algorithmic modeling for DDR4/5 equalization. Pre-layout simulation catches 90% of SI issues before a single trace is routed.",
      twoColumnGrid: [
        {
          badge: "Pre-Layout",
          badgeClass: "tool-badge-altium",
          title: "What to Simulate",
          items: [
            "Verify channel loss: total insertion loss must be < 5 dB at Nyquist frequency.",
            "Validate impedance matching: IBIS model drive impedance vs. trace Z₀ vs. ODT.",
            "Check eye diagram: Eye Height > 200 mV and Eye Width > 0.3 UI at the receiver.",
            "Simulate worst-case crosstalk: aggressor pattern PRBS-7 on all adjacent lanes."
          ]
        },
        {
          badge: "Post-Layout",
          badgeClass: "tool-badge-cadence",
          title: "Verification Checklist",
          items: [
            "Extract S-parameters from routed PCB using 3D field solver (Ansys HFSS, Simbeor).",
            "Run IBIS-AMI simulation with extracted channel model to validate eye opening.",
            "Verify that write/read leveling training window is > 25% of UI.",
            "Document simulation results in the JEDEC compliance report."
          ]
        }
      ],
      alerts: [
        { type: "info", text: "Where to get IBIS models: Download from the semiconductor vendor's website (e.g., Intel, AMD, Micron, Samsung). Look for the exact part number. IBIS models are free but may require NDA access for the AMI extensions used in DDR5." },
        { type: "warning", text: "IBIS models have limitations: they are behavioral (not transistor-level) and may not capture all parasitic effects. For production sign-off on DDR5-6400+, consider requesting SPICE-level models from the vendor or running silicon-correlated simulations." }
      ]
    },
    {
      heading: "CAD Tool Implementation Tips",
      content: "Translating theoretical constraints into CAD rules is tool-specific. Here are the best practices for the most common professional design suites.",
      twoColumnGrid: [
        {
          badge: "Altium Designer",
          badgeClass: "tool-badge-altium",
          title: "xSignals & Accordions",
          items: [
            "Use xSignals to define pad-to-pad paths automatically including series terminators.",
            "Set up 'Matched Lengths' design rules for each byte lane.",
            "Use the 'Interactive Length Tuning' tool (Accordion) to match traces within tolerance.",
            "Include package pin delays in the pin property dialog."
          ]
        },
        {
          badge: "Cadence Allegro",
          badgeClass: "tool-badge-cadence",
          title: "Constraint Manager",
          items: [
            "Define pin pairs in Constraint Manager for exact electrical length control.",
            "Create 'Match Groups' for DQ lanes relative to their DQS strobe.",
            "Use 'Sigrity' integration for post-layout SI verification.",
            "Apply 'Z-Axis' delay calculations for accurate via length matching."
          ]
        }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Pre-Routing Layout Setup",
      items: [
        "Stackup defined with 50Ω SE and 100Ω Diff targets (SSOT).",
        "DRAMs placed in a clean line for Fly-by topology.",
        "Decoupling caps allocated on layer 8 directly under DRAM BGAs.",
        "Constraint Manager groups (DQ, ADDR, CK) verified by engineering.",
        "No power islands or plane splits under the DDR routing zone."
      ]
    },
    {
      category: "2. Routing Execution (Critical Sign-Off)",
      items: [
        "CK/CK# routed first as master reference; 5W spacing to all nets.",
        "Intra-byte lane matching DQ-to-DQS verified within ±2 mil (Safety margin).",
        "DQS+/- phase skew < 5 mil verified; no split-layer routing.",
        "Fly-by stub lengths < 100 mil (DDR5) verified via DRC report.",
        "Serpentine amplitude < 3W; meander gap > 3W observed."
      ]
    },
    {
      category: "3. Manufacturing & SI/PI Verification",
      items: [
        "Back-drilling specified for all stubs > 100 mil (DDR5).",
        "Controlled impedance coupons included on board panel (±10%).",
        "Solder mask defined (SMD) pads verified for high-density BGA.",
        "Full IBIS-AMI simulation pass (Eye Height > 200 mV).",
        "JEDEC compliance report generated and archived for hardware validation."
      ]
    }
  ]
};
