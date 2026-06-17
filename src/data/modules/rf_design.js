export const content = {
  intro: "Mastering high-frequency PCB design. Advanced principles for transmission lines, impedance control, EMI shielding, and material selection for robust RF performance.",
  sections: [
    {
      heading: "Stackup Design & Material Selection",
      content: "Choosing the right foundation for high-frequency performance.",
      alerts: [
        { type: "info", text: "Dielectric Loss: At high frequencies, standard FR4 exhibits significant signal loss. Use materials like Rogers, PTFE, or high-frequency FR4 to minimize dielectric constant (Dk) and loss tangent (Df)." }
      ],
      cards: [
        { title: "Standard FR4", text: "Suitable for low frequency or short RF traces. However, inconsistent Dk and high Df cause excessive attenuation above 1 GHz." },
        { title: "High-Frequency Laminates", text: "Materials like Rogers 4350B provide tight Dk tolerance and extremely low loss tangent, vital for maintaining signal integrity in GHz ranges." }
      ]
    },
    {
      heading: "Transmission Lines & Impedance Control",
      content: "Microstrip, Stripline, and Coplanar Waveguides.",
      alerts: [
        { type: "warning", text: "Solid Return Path: An RF trace without an uninterrupted reference plane underneath is an antenna, not a transmission line. Never cross a split plane." }
      ],
      cards: [
        { title: "Microstrip", text: "Top layer trace referenced to the next solid ground layer. Easy to tune and fabricate." },
        { title: "Stripline", text: "Inner layer trace sandwiched between two ground planes. Excellent isolation but harder to tune." },
        { title: "Coplanar Waveguide (CPW)", text: "Trace surrounded by ground pour on the same layer. Ideal for extreme high frequencies and tight isolation." }
      ],
      type: "cross-ref",
      refModuleId: "stackup",
      refLabel: "Universal Impedance Solver",
      refDesc: "Use the Universal Impedance Solver in the Stackup module to precisely calculate your trace geometries (Microstrip, Stripline) for target impedances like 50 ohms.",
      refTargetHeading: "Universal Impedance Solver"
    },
    {
      heading: "RF Routing & Vias",
      content: "Mitigating parasitic inductance and capacitance.",
      alerts: [
        { type: "info", text: "Via Stubs: A via stub acts as a resonant antenna. Use blind/buried vias or backdrilling to remove the stub." }
      ],
      ruleCards: [
        {
          number: "RF-01",
          severity: "warning",
          title: "Curved Traces",
          body: "Avoid 90-degree corners. Use smooth curves or 45-degree miters to prevent impedance mismatch and unwanted radiation at the corners."
        },
        {
          number: "RF-02",
          severity: "info",
          title: "Via Fencing & Stitching",
          body: "Place ground vias along the edges of RF traces to confine the electromagnetic field and prevent coupling with adjacent circuits."
        }
      ]
    },
    {
      heading: "EMI/EMC Shielding & Antenna Design",
      content: "Keeping signals contained and maximizing radiation only where desired.",
      cards: [
        { title: "Faraday Cages & Shield Cans", text: "Enclose sensitive RF oscillator circuits inside metal shield cans soldered to the ground plane to prevent external EMI ingress and internal radiation egress." },
        { title: "Antenna Pi-Networks", text: "Always include a Pi-network (series-shunt-series footprint) near the antenna feed point to allow for impedance matching and fine-tuning post-fabrication." }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Baseline RF Integrity",
      items: [
        "Verified all high-frequency traces are routed over a continuous, unbroken ground plane.",
        "Calculated and applied specific trace widths for target impedance (e.g. 50Ω).",
        "Replaced sharp 90° trace corners with rounded curves or 45° miters.",
        "Assessed material Dk and Df to ensure acceptable insertion loss at target frequencies."
      ]
    },
    {
      category: "2. Advanced RF Engineering",
      items: [
        "Implemented via stitching or via fences along critical RF lines.",
        "Included a Pi-matching network near the antenna feed for future tuning.",
        "Specified back-drilling or blind vias for high-frequency signal layer transitions to eliminate via stubs.",
        "Ensured proper clearance around Coplanar Waveguide (CPW) traces to the coplanar ground pour."
      ]
    }
  ]
};
