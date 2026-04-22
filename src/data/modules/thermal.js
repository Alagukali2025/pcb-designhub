export const content = {
  intro: "Thermal management is the most overlooked phase of high-power PCB design. Modern high-density boards must be sized not just for resistance, but for steady-state temperature rise (ΔT) limits to ensure dielectric reliability and prevent catastrophic delamination. This module provides a standards-driven single source of truth for thermal engineering, anchored in IPC-2152 and industrial heat transfer physics.",
  sections: [
    {
      heading: "Three Pillars of Heat Transfer",
      content: "In a PCB environment, heat moves through three fundamental physical mechanisms. Understanding these is mandatory for both beginners and experts to design efficient cooling paths.",
      filletGrid: [
        {
          title: "Conduction",
          color: "blue",
          list: [
            { label: "Mechanism", text: "Physical contact. Heat flows from warm to cool through copper and laminate." },
            { label: "PCB Rule", text: "Copper is ~1000x more conductive than FR4. Use copper pours as primary conduits." },
            { label: "Key Value", text: "Copper Conductivity ≈ 400 W/m·K." }
          ]
        },
        {
          title: "Convection",
          color: "cyan",
          list: [
            { label: "Mechanism", text: "Heat transfer to air. Can be Natural (passive) or Forced (fans)." },
            { label: "Critical Rule", text: "Air is an insulator. Still air restricts heat escape; moving air increases efficiency exponentially." },
            { label: "Standard", text: "Most IPC-2152 charts assume natural convection in still air." }
          ]
        },
        {
          title: "Radiation",
          color: "orange",
          list: [
            { label: "Mechanism", text: "Electromagnetic emission. Significant at higher temperatures (>80°C)." },
            { label: "Emissivity", text: "Matte black solder mask radiates heat better than clear or white finishes." },
            { label: "Impact", text: "Often contributes 10-20% of total board cooling in open-air environments." }
          ]
        }
      ]
    },
    {
      heading: "The Thermal Resistance Path (Rθ)",
      content: "Electrical engineers can think of heat flow like a series of resistors. While basic models use a linear series (Rθja), experts use parallel paths to account for heat flowing both 'Up' into the heatsink and 'Down' into the PCB copper planes.",
      type: "thermal-resistance-visual",
      formula: {
        title: "Total Resistance (Dual-Path Model)",
        equations: [
          "1/Rθ_total = 1/Rθ_case + 1/Rθ_board",
          "Tj = Ta + (Pd × Rθ_total)"
        ],
        variables: [
          { name: "Rθ_case", desc: "Path to air/heatsink (Rθjc + Rθcs + Rθsa)", tag: "UP" },
          { name: "Rθ_board", desc: "Path to PCB (Rθjb)", tag: "DOWN" },
          { name: "Pd", desc: "Power Dissipated (Watts)", tag: "INPUT" }
        ]
      },
      alerts: [
        { type: 'warning', text: "Exceeding Tj_max (typically 125°C or 150°C) results in immediate performance throttling or permanent silicon damage." },
        { type: 'info', text: "Expert Note: Rθja is a JEDEC comparative tool. For real-world prediction, you must account for the PCB acting as a primary heatsink through the Rθjb path." }
      ]
    },
    {
      heading: "Copper Weight & Thermal Spreading",
      content: "Increasing copper weight (oz) increases the cross-sectional area for current and the surface area for thermal spreading. Primary Metric: Current Density & Heat Spreading.",
      table: {
        headers: ["Copper Weight", "Foil Thickness µm (mil)", "Approx. Capacity", "Typical Usage"],
        rows: [
          ["0.25 oz (Quarter)", "8.75 (0.34)", "~0.5 A", "RF shields, impedance tuning"],
          ["0.5 oz (Half)", "17.5 (0.69)", "~1.0 A", "High-density signal layers, HDI"],
          { type: 'highlight', data: ["1.0 oz (Standard)", "35.0 (1.37)", "~1.5 A", "Default signal and power planes"] },
          ["2.0 oz (Heavy)", "70.0 (2.74)", "~2.5 A", "Power distribution, bus bars"],
          ["3.0 oz (Extreme)", "105.0 (4.11)", "~3.5 A", "High-current switching, EV power"],
          ["4.0 oz (Exotic)", "140.0 (5.51)", "~4.5 A", "Defense, extreme power busbars"]
        ]
      }
    },
    {
      heading: "Theory: IPC-2221 vs. IPC-2152",
      content: "For decades, designers used IPC-2221 (based on 1950s data). However, IPC-2152 is the modern replacement that provides much more accurate results for modern materials and multi-layer boards.",
      filletGrid: [
        {
          title: "IPC-2221 (Legacy)",
          color: "orange",
          list: [
            { label: "Data Age", text: "Based on 1950s research (pre-FR4)." },
            { label: "Accuracy", text: "Conservative and often inaccurate for internal layers." },
            { label: "Variable", text: "Only considers Current and Copper Weight." }
          ]
        },
        {
          title: "IPC-2152 (Modern)",
          color: "success",
          list: [
            { label: "Data Age", text: "Extensive modern empirical testing (2009)." },
            { label: "Accuracy", text: "Accounts for board thickness and copper plane proximity." },
            { label: "Variable", text: "Thermal conductivity of the dielectric is a primary input." }
          ]
        }
      ]
    },
    {
      heading: "IPC-2152 Current Capacity Solver",
      standard: {
        title: "IPC-2152 (2009)",
        note: "✅ Current Industry Standard for Trace Design (Replaces legacy IPC-2221)."
      },
      content: "A Current Capacity Solver determines how wide your PCB traces must be to prevent them from overheating or acting like a fuse. It analyzes your Amperage, Board Thickness, and nearby Copper Planes to ensure your design stays cool and your electrical power arrives without losing 'pressure' (Voltage Drop).",
      list: [
        { label: "The Heat Goal", text: "Ensure the trace doesn't exceed the board's Tg (Melting point)." },
        { label: "The Efficiency Goal", text: "Minimize Voltage Drop so your components get full power." },
        { label: "The Safety Goal", text: "Stay far below the Fusing Current (the 'Poof' point)." }
      ],
      type: "calculator"
    },
    {
      heading: "Quick Reference: Current Limits",
      content: "Estimated current capacity for 1oz (35µm) copper traces at +10°C and +20°C temperature rise.",
      table: {
        headers: ["Trace Width", "Area (sq mil)", "10°C Rise", "20°C Rise"],
        rows: [
          ["10 mil (0.25mm)", "13.7", "0.6 A", "0.9 A"],
          ["20 mil (0.50mm)", "27.4", "1.1 A", "1.5 A"],
          ["50 mil (1.27mm)", "68.5", "2.1 A", "3.0 A"],
          { type: 'highlight', data: ["100 mil (2.54mm)", "137.0", "3.8 A", "5.2 A"] },
          ["200 mil (5.08mm)", "274.0", "6.2 A", "8.5 A"]
        ]
      }
    },
    {
      heading: "Internal vs. External Traces",
      content: "The environment of a trace dictates its current-carrying limits. Stripline traces (internal) are 'blanketed' by FR4, which traps heat.",
      table: {
        headers: ["Trace Type", "Thermal Density", "Cooling Efficiency", "Engineering Action"],
        rows: [
          ["External (Microstrip)", "High Exposure", "Efficient (Air + Copper)", "Preferred for high-current rails"],
          { type: 'highlight', data: ["Internal (Stripline)", "Insulated", "Poor (FR4 bottleneck)", "Design 2x width for same ΔT"] }
        ]
      },
      alerts: [
        { type: 'info', text: "Internal traces rely entirely on conduction to adjacent GND planes. Ensure a thin dielectric (<5 mil) to the nearest plane for better heat sinking." }
      ]
    },
    {
      heading: "Via Gardening & Thermal Stitching",
      content: "Vias are the 'heat pipes' and 'shielding posts' of a high-performance PCB. While they look the same, their design intent—Thermal vs. Signal—requires different placement strategies.",
      filletGrid: [
        {
          title: "Thermal Stitching (Heat Pipes)",
          color: "success",
          list: [
            { label: "Analogy", text: "Copper rivets 'sewing' layers together." },
            { label: "Physics", text: "Moves heat from hot SMT pads to internal planes." },
            { label: "Heuristic", text: "0.3mm drill at 1.0mm pitch under thermal pads." }
          ]
        },
        {
          title: "Via Gardening (EM Shielding)",
          color: "blue",
          list: [
            { label: "Analogy", text: "A protective 'fence' around signal vias." },
            { label: "Physics", text: "Provides a cage of ground vias to trap EMI/Crosstalk." },
            { label: "Heuristic", text: "Place ground vias within 50 mil of high-speed transitions." }
          ]
        }
      ],
      type: "thermal-tool",
      alerts: [
        { type: 'info', text: "Expert Heuristic: For Thermal Stitching, use VIPPO (Via-In-Pad Plated Over) to prevent solder wicking while maximizing heat transfer area." }
      ]
    },
    {
      heading: "Heatsink & TIM Strategy",
      content: "When copper plane dissipation is insufficient, external heatsinks are required. The interface between the component and the heatsink is the primary bottleneck due to microscopic air gaps.",
      alerts: [
        { type: 'info', text: "Expert Heuristic: The air trapped between two 'flat' surfaces represents 95-99% of the interface. TIM is not just a conductor; it is an air-displacement medium." }
      ]
    },
    {
      heading: "TIM Selection Matrix",
      content: "Choosing the right Thermal Interface Material (TIM) is a balance between thermal conductivity, gap-filling capability, and manufacturing complexity.",
      table: {
        headers: ["Material Type", "Conductivity (W/m·K)", "Gap Capability", "Key Trade-off"],
        rows: [
          ["Thermal Grease", "3.0 - 15.0", "Excellent (Thin)", "Can 'pump-out' over time; messy assembly"],
          ["Gap Pads", "1.0 - 8.0", "Excellent (Thick)", "Higher thermal resistance; easier assembly"],
          ["Phase Change (PCM)", "3.0 - 10.0", "Very Good", "Requires initial 'melt' temperature to perform"],
          ["Thermal Putty", "3.0 - 12.0", "Good", "Stress-free for fragile components; one-time use"],
          ["Graphite Sheets", "1500 (XY axis)", "Poor", "Highly anisotropic; electrically conductive (Danger)"]
        ]
      }
    },
    {
      heading: "The 'BLT' Rule: Bond Line Thickness",
      content: "Bond Line Thickness (BLT) is the distance between the component and the heatsink. In thermal physics, distance is the enemy.",
      formula: {
        title: "Interface Resistance Calculation",
        equations: [
          "Rθ_cs = BLT / (K_tim × Area)"
        ],
        variables: [
          { name: "Rθ_cs", desc: "Case-to-Sink Resistance", tag: "OUTPUT" },
          { name: "BLT", desc: "Bond Line Thickness (m)", tag: "INPUT" },
          { name: "K_tim", desc: "TIM Conductivity (W/m·K)", tag: "INPUT" }
        ]
      },
      alerts: [
        { type: 'warning', text: "Doubling the TIM thickness (BLT) doubles the thermal resistance of the interface, regardless of the material's quality. Thinner is always better." }
      ]
    },
    {
      heading: "Mechanical Attachment Strategies",
      content: "How you attach the heatsink dictates the clamping force, which in turn determines the BLT and the mechanical reliability of the PCB.",
      filletGrid: [
        {
          title: "Push-Pins & Springs",
          color: "blue",
          list: [
            { label: "Category", text: "Industrial Grade" },
            { label: "Pros", text: "High, consistent clamping force; easy rework." },
            { label: "Cons", text: "Requires PCB through-holes; consumes significant 'Keep-out' area." }
          ]
        },
        {
          title: "Solderable Anchors",
          color: "success",
          list: [
            { label: "Category", text: "Automated Assembly" },
            { label: "Pros", text: "Pick-and-place compatible; no through-holes needed." },
            { label: "Cons", text: "Permanent; difficult to rework without specialized tools." }
          ]
        },
        {
          title: "Adhesive Tape",
          color: "orange",
          list: [
            { label: "Category", text: "Consumer Grade" },
            { label: "Pros", text: "Zero PCB footprint impact; lowest cost." },
            { label: "Cons", text: "Low clamping force; adhesive can degrade over time/heat." }
          ]
        }
      ]
    },
    {
      heading: "Altitude & Air Density Derating",
      content: "IPC-2152 standards are based on sea-level air density. As altitude increases, air becomes thinner and its ability to carry heat via convection drops significantly.",
      table: {
        headers: ["Altitude (ft)", "Altitude (m)", "Density Ratio", "Current Derating"],
        rows: [
          ["0 (Sea Level)", "0", "1.00", "100% (No change)"],
          ["5,000", "1,524", "0.86", "95% Capacity"],
          ["10,000", "3,048", "0.74", "89% Capacity"],
          { type: 'highlight', data: ["30,000 (Avionics)", "9,144", "0.37", "72% Capacity"] },
          ["50,000", "15,240", "0.15", "55% Capacity"]
        ]
      },
      alerts: [
        { type: 'warning', text: "Critical: For aerospace or high-altitude industrial designs, you must increase trace widths by ~20-30% to maintain the same ΔT as sea level." }
      ]
    },
    {
      heading: "Forced Air: CFM Calculation",
      content: "When natural convection is insufficient, a fan must be sized to move enough air (Mass Flow) to absorb the heat generated by the system.",
      formula: {
        title: "Required Airflow (CFM)",
        equations: [
          "CFM = (1.76 × P) / ΔT_rise",
          "CFM = (3.16 × P) / ΔT_rise (Metric Units)"
        ],
        variables: [
          { name: "P", desc: "Total Power Dissipated (Watts)", tag: "INPUT" },
          { name: "ΔT_rise", desc: "Allowed Air Temp Rise", tag: "INPUT" },
          { name: "3.16", desc: "Conversion Constant (Use for °C)", tag: "CONST" },
          { name: "1.76", desc: "Conversion Constant (Use for °F)", tag: "CONST" },
          { name: "CFM", desc: "Required Airflow Volume", tag: "OUTPUT" }
        ]
      },
      alerts: [
        { type: 'info', text: "Engineering Tip: A standard 40mm fan provides 5-10 CFM. For high-power servers, you may need 50+ CFM per slot." },
        { type: 'info', text: "Expert Insight: The 1.76 and 3.16 constants represent the density and specific heat of air at sea level. If designing for high altitude, these constants must be adjusted based on the Altitude Derating table above." }
      ]
    },
    {
      heading: "Placement & Airflow Strategy",
      content: "The physical arrangement of components determines if your cooling strategy actually works. Avoid 'Thermal Shadowing' to ensure fresh air reaches hot components.",
      filletGrid: [
        {
          title: "Thermal Shadowing",
          color: "orange",
          list: [
            { label: "The Problem", text: "Tall components block airflow to hot SMT parts downstream." },
            { label: "The Fix", text: "Stagger tall components or align them parallel to the airflow path." }
          ]
        },
        {
          title: "Upstream Priority",
          color: "success",
          list: [
            { label: "Strategy", text: "Place the most temperature-sensitive parts (e.g., Crystal Oscillators) upstream." },
            { label: "Strategy", text: "Place the hottest parts (e.g., CPU) near the exhaust or in direct intake flow." }
          ]
        },
        {
          title: "Airflow Shortcuts",
          color: "blue",
          list: [
            { label: "The Problem", text: "Air takes the path of least resistance, bypassing hot areas." },
            { label: "The Fix", text: "Use baffles or ducting to force air through heatsink fins." }
          ]
        }
      ]
    },
    {
      heading: "Critical DFM: The Bowing Warning",
      content: "Excessive clamping force on a thin PCB (< 1.6mm) can cause the board to 'bow' (bend). This is a catastrophic failure mode.",
      ruleCards: [
        {
          number: "T-01",
          severity: "danger",
          title: "Solder Joint Fatigue",
          body: "PCB bowing puts tensile stress on BGA/QFN solder joints. Over thermal cycles, this leads to micro-cracking and intermittent failures."
        },
        {
          number: "T-02",
          severity: "warning",
          title: "Stiffener Requirements",
          body: "For heatsinks > 100g, use a backplate (stiffener) on the opposite side of the PCB to distribute the clamping load."
        }
      ]
    },
    {
      heading: "Expert DFM: The Soldering Paradox",
      content: "High thermal conductivity is great for cooling, but terrible for manufacturing. Solid plane connections cause 'cold solder joints' during assembly.",
      mistakeList: [
        { mistake: "Solid connections to large planes on SMT pads.", fix: "Use 4-spoke thermal relief for all components < 1206 size." },
        { mistake: "Oversized thermal vias on QFN pads.", fix: "Limit via drill to 0.3mm and use 'Windowpane' stencil apertures to prevent solder wicking." }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Baseline Thermal Integrity",
      items: [
        "Current requirements gathered for all power rails (Amps).",
        "Maximum allowable temperature rise established (default +10°C / +20°C).",
        "Continuous ground planes provided as primary heat spreaders.",
        "Components with exposed pads include via stitching to planes."
      ]
    },
    {
      category: "2. Expert Engineering Review",
      items: [
        "Junction temperature (Tj) calculated for all components > 1W.",
        "Heatsink-to-PCB mechanical keepouts verified.",
        "TIM conductivity and thickness specified in the mechanical BOM.",
        "TIM Bond Line Thickness (BLT) verified for multi-component heatsinks (Gap analysis).",
        "PCB stiffener/backplate verified for heavy heatsinks (>100g) to prevent bowing.",
        "TIM 'Pump-out' and aging effects evaluated for high-cycle power applications.",
        "Airflow path (CFM) and 'Thermal Shadowing' verified for forced-convection.",
        "Altitude derating applied to IPC-2152 current capacity limits.",
        "Thermal relief verified on all pads to prevent manufacturing defects."
      ]
    }
  ]
};
