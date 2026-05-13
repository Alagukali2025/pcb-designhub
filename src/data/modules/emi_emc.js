export const content = {
  intro: "A professional-grade engineering guide to electromagnetic compatibility. Success in the EMC lab begins with physics-driven PCB layout, focusing on loop area containment, spectrum management, and strategic grounding based on IPC-D-317A, CISPR 32, and FCC Part 15B standards.",
  sections: [
    {
      heading: "The Regulatory Landscape: Class A vs. Class B",
      content: "Regulatory bodies like the FCC (USA) and CISPR (International) define strict limits based on the product's environment. Failing these tests bars your product from the market. Conducted emissions are tested first, followed by radiated emissions.",
      table: {
        headers: ["Standard", "Class / Type", "Environment", "Emission Limit"],
        rows: [
          ["CISPR 32 / FCC Part 15B", "Conducted", "AC Mains (LISN)", "< 56 dBμV (150kHz-30MHz, QP)"],
          ["CISPR 32 / FCC Part 15B", "Class A Radiated", "Industrial / Commercial", "40 dBμV/m (at 10m, 30-230MHz)"],
          { type: 'highlight', data: ["CISPR 32", "Class B Radiated", "Residential / Consumer", "30 dBμV/m (at 10m) — 10dB Stricter"] },
          ["FCC Part 15B", "Class B Radiated", "Residential / Consumer", "40 dBμV/m (at 3m)"],
          ["CISPR 25", "Classes 1-5", "Automotive (Internal)", "Class 5: 18 dBμV/m (Most Stringent)"]
        ]
      },
      alerts: [
        { type: 'info', text: "Class B is roughly 10dB stricter than Class A. If your product enters a home, it MUST meet Class B. A 10dB difference is a 3.16x reduction in voltage field strength." }
      ]
    },
    {
      heading: "Antenna Theory for Traces (The λ/20 Rule vs. λ/4)",
      content: "A trace becomes an efficient radiator at quarter-wave resonance (λ/4) or half-wave (λ/2). However, at 1/20th of the wavelength (λ/20) of the signal harmonics, the trace starts behaving as a distributed element (transmission line) and must be treated with controlled impedance. Fast edge rates (Rise Time) create high-frequency harmonics.",
      formula: {
        title: "Maximum Harmonic Frequencies",
        equations: [
          "Fmax ≈ 0.35 / Tr (Rise Time)",
          "λ (Wavelength) = c / (Fmax × √εr)",
          "Critical Length = λ / 20 (Controlled Impedance Begins)",
          "Peak Radiation = λ / 4 (Efficient Antenna)"
        ],
        variables: [
          { name: "Tr", desc: "10-90% Rise Time (ns)", tag: "INPUT" },
          { name: "√εr", desc: "Dielectric Constant (e.g., 4.4 for FR4)", tag: "CONST" }
        ]
      }
    },
    {
      heading: "Near-Field vs. Far-Field Radiation",
      content: "EMC issues manifest differently depending on the distance from the source. Understanding this distinction is critical for choosing between filtering and shielding.",
      cards: [
        {
          title: "Near-Field (r < λ/2π)",
          text: "Dominated by magnetic (H-field) loops or electric (E-field) dipoles. Fields decay rapidly (1/r³ or 1/r²). Addressed via layout (loop area reduction) and stackup."
        },
        {
          title: "Far-Field (r > λ/2π)",
          text: "Plane wave radiation (E/H orthogonal). Decays at 1/r. Measured at 3m or 10m in the EMC lab. Addressed via enclosure shielding, common-mode filtering, and cable management."
        }
      ]
    },
    {
      heading: "The Ghost of Return Current: Image Planes",
      content: "In high-speed design, current follows the path of least **inductance**, not resistance. Depending on the stackup, above 1 kHz – 100 kHz, the return current crowds directly beneath the signal trace in the reference (image) plane to minimize loop area. The image plane provides a Faraday shield mirroring the trace current.",
      alerts: [
        { type: 'danger', text: "Never route signal traces over slots or splits in ground planes. Think of it like a broken bridge: the return current must take a long detour, creating a large loop area that can fail FCC/CISPR limits by 20dB or more." }
      ]
    },
    {
      heading: "The Real Enemy: Common Mode Noise",
      content: "Understanding the difference between Differential Mode and Common Mode noise is critical. Common mode noise is often created by asymmetry in differential pairs, ground bounce, or potential differences driving cable shields. The cable acts as a monopole antenna driven by the CM voltage at the connector.",
      cards: [
        {
          title: "Differential Mode (DM)",
          text: "Currents flow in opposite directions. Fields cancel out if the loop area is small. Rarely the cause of radiated failures unless loop areas are massive."
        },
        {
          title: "Common Mode (CM)",
          text: "Currents flow in the same direction. Fields add up and use external cables as antennas. This is the primary cause of radiated EMC lab failures."
        }
      ]
    },
    {
      heading: "Power Supplies: The Hot Loop Physics",
      content: "Switching Power Supplies (SMPS) are the primary source of broadband noise. The 'Hot Loop' (high di/dt path) must be minimized to contain the near-field magnetic field (B ∝ I × Area / r³). Additionally, high dV/dt switching nodes couple capacitively.",
      cards: [
        {
          title: "Loop Minimization",
          text: "Keep the area between the input capacitor and the switching transistor as small as possible (< 1 cm²)."
        },
        {
          title: "PCB Mitigations",
          text: "Use snubber circuits (RC) to dampen ringing, or tune gate resistors to slow down the dV/dt edge rates if thermal budgets allow."
        }
      ]
    },
    {
      heading: "Conducted Emissions & PI Filter Design",
      content: "Conducted emissions (150kHz - 30MHz) are measured via a Line Impedance Stabilization Network (LISN). They represent noise traveling back onto the AC mains. A well-designed power input (PI) filter is mandatory.",
      list: [
        { label: "Differential Mode Filter", text: "X-capacitors (Line-to-Neutral) and series inductors (Pi-filter) suppress DM noise." },
        { label: "Common Mode Filter", text: "Y-capacitors (Line-to-Ground) and Common-Mode Chokes suppress CM noise." },
        { label: "Decoupling Focus", text: "EMI decoupling aims to keep high-frequency noise OFF the power plane, unlike PI decoupling which stabilizes voltage." }
      ]
    },
    {
      heading: "Spread Spectrum Clocking (SSC)",
      content: "A highly effective, low-cost technique for reducing peak radiated emissions. By slightly modulating the clock frequency (e.g., 1% down-spread), the harmonic energy is distributed over a wider bandwidth.",
      alerts: [
        { type: 'info', text: "SSC doesn't eliminate the total energy; it just lowers the peak amplitude (often by 6–10 dB) to pass the quasi-peak or average limits in CISPR 32." }
      ]
    },
    {
      heading: "ESD Protection Design (IEC 61000-4-2)",
      content: "Electrostatic Discharge (ESD) is the #1 immunity failure. Protection relies on diverting the discharge energy away from sensitive silicon before it enters the board.",
      list: [
        { label: "TVS Diodes", text: "Place Transient Voltage Suppressor (TVS) diodes directly at the connector entry point." },
        { label: "Discharge Paths", text: "Provide a low-inductance path from the TVS ground pad directly to the chassis ground, isolating it from the digital signal ground." },
        { label: "Guard Traces", text: "Use grounded guard traces around sensitive reset/interrupt lines to prevent induced capacitive coupling from ESD events." }
      ]
    },
    {
      heading: "Grounding Topologies & Board Edges",
      content: "Grounding strategy dictates how noise currents flow. While a unified ground plane is standard for high-speed digital, mixed-signal designs require careful topological planning.",
      cards: [
        {
          title: "Ground Topologies",
          text: "Single-point (star) is best for low-frequency analog (<100kHz). Multi-point is required for digital/RF. Hybrid uses capacitors to isolate DC while shorting RF."
        },
        {
          title: "Edge-Guard Vias",
          text: "To prevent edge-fired radiation, use edge-guard via stitching (vias spaced < λ/20) connecting ground planes at the board periphery. (The 20H rule is an outdated myth)."
        }
      ]
    },
    {
      heading: "EMI Suppressing Stackups",
      content: "The physical stackup of your PCB is the first line of defense against EMI. By placing solid ground planes adjacent to signal layers and using thin dielectrics, you naturally contain electromagnetic fields.",
      alerts: [
        { type: 'info', text: "For a deep dive into EMI-optimized stackups, thin dielectrics, and layer assignments, refer to the Stackup Design module." }
      ]
    },
    {
      heading: "Aperture Theory & Enclosure Shielding",
      content: "If the product uses a metal enclosure, the enclosure acts as a Faraday cage. However, seams, ventilation holes, and cable exits act as slot antennas.",
      list: [
        { label: "Maximum Dimension", text: "Shielding effectiveness is dictated by the LONGEST dimension of an aperture, not its total area." },
        { label: "Cutoff Frequency", text: "If a slot length approaches λ/4 of a noise frequency, it becomes an efficient radiator, ruining the enclosure's shielding." }
      ]
    },
    {
      heading: "The Pigtail Trap: Shield Integrity",
      content: "A cable shield is only as good as its termination. Connecting a shield via a wire 'pigtail' introduces enough inductance to ruin shielding above 100 MHz.",
      cards: [
        {
          title: "360° Termination",
          text: "Use metal backshells for continuous circular connection between shield and chassis. Zero 'leakage' apertures are the goal."
        },
        {
          title: "The Pigtail Impedance",
          text: "A 1-inch pigtail (20nH) at 500MHz presents a 63Ω impedance—effectively an open circuit to EMI."
        }
      ]
    },
    {
      heading: "Regulatory Tiers: FCC / CISPR / MIL-STD",
      content: "Professional engineers design for global compliance simultaneously. CISPR 32 is the commercial baseline, but military and automotive have specialized requirements.",
      table: {
        headers: ["Standard", "Domain", "Key Focus Areas"],
        rows: [
          ["CISPR 32 / FCC P15B", "Commercial / IT", "Radiated/Conducted Emissions (150kHz - 6GHz)"],
          ["CISPR 25 / ISO 11452", "Automotive", "Component-level, Stripline, Bulk Current Injection (BCI)"],
          ["MIL-STD-461G", "Defense / Aero", "CE102, RE102, RS103 (Extreme field strengths 50-200 V/m)"],
          ["IEC 61000-4 Series", "Immunity", "ESD (4-2), Radiated Immunity (4-3), EFT (4-4), Surge (4-5)"]
        ]
      }
    },
    {
      heading: "EMI Bandwidth & Critical Length Solver",
      content: "This solver calculates the highest significant harmonic frequency of your signal edge and determines the critical routing lengths. It helps you identify which wires on your board require high-speed termination.",
      list: [
        { label: "The Antenna Rule", text: "Traces approach efficient resonance at λ/4 of the signal's wavelength." },
        { label: "Edge Rate Danger", text: "Fast rise times create high-frequency noise, even if the fundamental clock is slow." },
        { label: "Critical Length", text: "The length where distributed element (transmission line) routing rules become mandatory." }
      ],
      type: "emi-calculator"
    },
    {
      heading: "EMI Design Compliance Checklist",
      content: "EMC compliance is a critical milestone in product certification. This interactive checklist guides you through the physics of shielding and grounding to ensure you pass on the first try.",
      list: [
        { label: "The Shield", text: "Using continuous metal to contain and reflect radiated fields." },
        { label: "Grounding", text: "Providing a low-impedance reference for return currents and ESD." },
        { label: "Filtering", text: "Suppressing conducted emissions on AC mains and IO cables." }
      ],
      type: "emi-checklist-tool"
    }
  ]
};
