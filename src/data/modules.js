import { 
  Search, 
  Layout, 
  Zap, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Factory, 
  Thermometer,
  Layers,
  Radio
} from 'lucide-react';

export const modulesData = [
  { 
    id: "footprint", 
    icon: Search, 
    title: "Component Footprint Engineering", 
    desc: "Master IPC-7351B standards for land pattern generation.",
    prerequisites: [],
    sections: [
      "IPC-7351B Standard",
      "Component Producibility Levels",
      "Density Level Selection",
      "Footprint Geometries & Tolerances",
      "Solder Mask & Silk Screens",
      "Courtyard & Mechanical Keepouts",
      "Interactive: Zero-DPMO Footprint Calculator"
    ],
    loadContent: () => import('./modules/footprint.js')
  },
  { 
    id: "stackup",    
    icon: Layout,      
    title: "Layer Stackup & Materials",      
    desc: "Layer stack-up planning for impedance and signal integrity.",
    prerequisites: ['footprint'],
    sections: [
      "SSOT Stackup Workflow",
      "Material Science: The Laminate",
      "Laminate Benchmarks (Thermal & Dielectric)",
      "Copper Weight Reference (IPC-4562A)",
      "Advanced Material Science — Laminate Database",
      "Interactive Layer Stackup Generator",
      "Standard 8-Layer PCB Construction",
      "Core vs. Foil Construction",
      "Flex PCB Fundamentals (IPC-2223D)",
      "Flex DFM — Bending Radius & Routing Rules",
      "Rigid-Flex Architecture (IPC-2223D)",
      "HDI Fundamentals — IPC-2226 Type Definitions",
      "HDI Microvia Design Rules",
      "HDI Material Selection",
      "Copper Balancing for Lamination Quality",
      "Routing Topologies & Impedance Control",
      "Universal Impedance Solver",
      "Return Currents: High-Frequency Physics",
      "Current Carrying Capacity (IPC-2152)",
      "High-Speed Signal Integrity: Fiber Weave Skew",
      "DFM Validation — Key Stackup Rules",
      "Via Technologies: Aspect Ratio & DFM",
      "Creepage vs. Clearance — Design Decision",
      "Electrical Clearance & Creepage (IPC-2221B)",
      "IPC Standards Compliance",
      "SSOT Intelligence & Export Formats"
    ],
    loadContent: () => import('./modules/stackup.js')
  },
  {
    id: "thermal",
    icon: Thermometer,
    title: "Thermal Analysis & Management",
    desc: "Calculate trace current capacity and design internal thermal paths.",
    prerequisites: [],
    sections: [
      "Three Pillars of Heat Transfer",
      "The Thermal Resistance Path (Rθ)",
      "Copper Weight & Thermal Spreading",
      "IPC-2152 Current Capacity Solver",
      "Internal vs. External Traces",
      "Via Gardening & Thermal Stitching",
      "Heatsink & TIM Strategy",
      "Expert DFM: The Soldering Paradox"
    ],
    loadContent: () => import('./modules/thermal.js')
  },
  { 
    id: "high_speed", 
    icon: Activity,    
    title: "High-Speed Digital Interconnects",   
    desc: "Transmission line theory and reflection management.",
    prerequisites: ['stackup'],
    sections: [
      "The Transmission Line Threshold",
      "Characteristic Impedance (Z0)",
      "Signal Velocity & Propagation Delay",
      "Reflection Theory & SWR",
      "The Critical Path Length",
      "High-Speed Layer Transitions (Vias)",
      "Termination Physics",
      "Interactive: TDR Impedance & Reflection Solver"
    ],
    loadContent: () => import('./modules/high_speed.js')
  },
  { 
    id: "diff_pair",  
    icon: Zap,         
    title: "Differential Signaling Protocol", 
    desc: "Achieve the 8 golden rules of differential signaling.",
    prerequisites: ['high_speed'],
    sections: [
      "Differential Signaling Physics",
      "The Golden Rules of Diff Pairs",
      "Interface Impedance Targets",
      "Skew Matching & Meandering",
      "The Reference Plane Penalty",
      "Broadside vs. Edge Coupling",
      "Diff Pair Termination Strategies",
      "Interactive: Zdiff Differential Solver"
    ],
    loadContent: () => import('./modules/diff_pair.js')
  },
  { 
    id: "ddr",        
    icon: Cpu,         
    title: "DDR Memory Layout",          
    desc: "Master DDR4/DDR5 layout topologies and timing matching.",
    prerequisites: ['high_speed'],
    sections: [
      "DDR Evolution (DDR3 vs. DDR4 vs. DDR5)",
      "Fly-By vs. T-Topology",
      "Fly-By Topology (DDR3/4/5)",
      "Length Matching & Skew Groups",
      "VTT & VREF Power Integrity",
      "Point-to-Point (P2P) Topologies",
      "Signal Inversion & Swap Rules",
      "Interactive: DDR Dynamic Skew Matcher"
    ],
    loadContent: () => import('./modules/ddr.js')
  },
  { 
    id: "si_pi",      
    icon: Activity,     
    title: "SI / PI Validation",         
    desc: "Industrial-grade engineering for high-speed channel compliance and PDN stability.",
    prerequisites: ['high_speed', 'ddr', 'diff_pair'],
    sections: [
      "SI Core: Transmission Line Standards",
      "Lossy Line Physics (Expert Insight)",
      "Differential Pair Routing (Cross-Reference)",
      "Crosstalk — NEXT & FEXT Fundamentals",
      "Via Stub Resonance & Back-Drilling",
      "Visualizing Via Stub Resonance",
      "Return Path Continuity",
      "Impedance Discontinuity Analysis",
      "PDN Target Impedance — Theory & Formula",
      "PDN Target Impedance Solver (Interactive)",
      "Decoupling Capacitor Engineering",
      "DC IR Drop Analysis",
      "BGA Escape & Fanout Design (IPC-7095C)",
      "Recommended 6-Layer Stackup for SI/PI",
      "S-Parameters & Frequency-Domain Compliance",
      "Eye Diagram, Jitter & Bathtub Curves",
      "Simulation & Validation Pipeline"
    ],
    loadContent: () => import('./modules/si_pi.js')
  },
  {
    id: "rf_design",
    icon: Radio,
    title: "High-Frequency RF Layout",
    desc: "Mastering high-frequency PCB design, transmission lines, and EMI shielding.",
    prerequisites: ['si_pi', 'high_speed'],
    sections: [
      "RF Frequency Bands & The Transmission Line Threshold",
      "Stackup Design & Material Selection",
      "Transmission Lines & Impedance Control",
      "RF Routing & Vias",
      "RF PCB Stackup & Partitioning",
      "Via Fencing, Stitching & Shielding",
      "Impedance Matching Networks",
      "EMI/EMC Shielding & Antenna Design",
      "Common RF PCB Mistakes"
    ],
    loadContent: () => import('./modules/rf_design.js')
  },
  { 
    id: "flex_hdi_routing", 
    icon: Layers,    
    title: "HDI & Flex Design Rules",   
    desc: "Master fine-pitch BGA escape strategies and dynamic flex layout rules.",
    prerequisites: ['stackup', 'high_speed'],
    sections: [
      "Flex Routing: The 'No 90°' Rule",
      "Teardrops: Preventing Pad Fractures",
      "Cross-Hatched Planes vs. Solid Copper",
      "The 'I-Beam' Avoidance Strategy",
      "HDI: Fine-Pitch BGA Breakout",
      "Via-in-Pad (VIP) vs. Dog-Bone Routing",
      "Trace Neck-Downs",
      "Plane Voiding & Return Paths"
    ],
    loadContent: () => import('./modules/flex_hdi_routing.js')
  },
  { 
    id: "emi_emc",    
    icon: ShieldAlert,      
    title: "EMI / EMC Compliance", 
    desc: "Master regulatory standards and suppression techniques.",
    prerequisites: ['stackup', 'high_speed'],
    sections: [
      "The Regulatory Landscape: Class A vs. Class B",
      "Antenna Theory for Traces (The λ/20 Rule vs. λ/4)",
      "Near-Field vs. Far-Field Radiation",
      "The Ghost of Return Current: Image Planes",
      "The Real Enemy: Common Mode Noise",
      "Power Supplies: The Hot Loop Physics",
      "Conducted Emissions & PI Filter Design",
      "Spread Spectrum Clocking (SSC)",
      "ESD Protection Design (IEC 61000-4-2)",
      "Grounding Topologies & Board Edges",
      "EMI Suppressing Stackups",
      "Aperture Theory & Enclosure Shielding",
      "The Pigtail Trap: Shield Integrity",
      "Regulatory Tiers: FCC / CISPR / MIL-STD",
      "EMI Bandwidth & Critical Length Solver",
      "EMI Design Compliance Checklist"
    ],
    loadContent: () => import('./modules/emi_emc.js')
  },
  { 
    id: "dfm_dft",    
    icon: Factory,        
    title: "Design for Manufacturing (DFM/DFT)",                 
    desc: "Achieve industrial-grade yields and 100% test coverage.",
    prerequisites: ['high_speed'],
    sections: [
      "The Business Case: Yield and Rework",
      "Fabrication Physics: Beyond the Basics",
      "Assembly & Thermal Profiles (J-STD-020)",
      "Thermal Relief Engineering",
      "DFT Architecture: ICT vs. JTAG",
      "Zero-Orientation & Centroid Data",
      "Panelization & Fiducial Strategy",
      "Surface Finish Decision Matrix",
      "Interactive: Real-Time DFM Rule Checker"
    ],
    loadContent: () => import('./modules/dfm_dft.js')
  },
  {
    id: "pcb_output_system",
    icon: Factory,
    title: "Fabrication & Output Systems",
    desc: "The definitive engineering guide for Fabrication, Assembly, and Test release packages.",
    prerequisites: ['dfm_dft'],
    sections: [
      "Fabrication Output Files (The Photoplot)",
      "NC Drill Precision (CNC Instructions)",
      "Assembly & Placement Engineering",
      "Advanced Formats: ODB++ & IPC-2581",
      "Intelligent Handover: The IPC-2581 'Digital Twin'",
      "CAD-Specific Export Workflows",
      "Common Manufacturing Risks",
      "Standard Release Package (Directory Structure)",
      "Technical Appendix: Test & PnP Metadata",
      "Interactive: Manufacturing Release Simulator"
    ],
    loadContent: () => import('./modules/pcb_output_system.js')
  }
];
