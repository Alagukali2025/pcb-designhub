export const content = {
  intro: "The most demanding discipline in PCB engineering. Master transmission line physics, substrate selection, via fencing, impedance matching, and shielding strategy — from MHz to mmWave.",
  sections: [
    {
      heading: "RF Frequency Bands & The Transmission Line Threshold",
      content: "How operating frequency determines every decision: substrate material, trace width tolerance, via design, and shielding strategy.",
      alerts: [
        { type: "info", text: "The λ/20 Rule: When a PCB trace exceeds one-twentieth of the wavelength in the substrate (λpcb/20), it must be treated as a transmission line — not a wire. At 2.4 GHz on FR-4 (εr ≈ 4.5), λ/20 ≈ 13 mm. At 5 GHz on RO4003C (εeff ≈ 3.1), λ/20 ≈ 1.7 mm." }
      ],
      cards: [
        { title: "HF / VHF / UHF (3 MHz – 960 MHz)", text: "Standard FR-4 acceptable. Lumped elements dominate. Transmission line effects begin appearing at UHF upper end for trace lengths > 5 cm." },
        { title: "L-Band / S-Band (1 – 4 GHz)", text: "GPS (1.575 GHz), Wi-Fi 2.4 GHz, Bluetooth. Low-loss material (Rogers RO4003C) strongly recommended for precision designs. FR-4 usable with careful design." },
        { title: "C-Band / X-Band (4 – 12 GHz)", text: "Satellite uplink, Wi-Fi 5 GHz, radar. PTFE or ceramic-filled substrates required. ENIG surface finish mandatory to reduce skin-effect loss." },
        { title: "Ku / K / Ka-Band (12 – 40 GHz)", text: "5G mmWave (24–39 GHz), automotive radar (77 GHz). Via drill tolerance, copper roughness, and solder mask clearance become dominant loss factors." }
      ]
    },
    {
      heading: "Stackup Design & Material Selection",
      content: "Choosing the right foundation for high-frequency performance. Dielectric constant (εr), loss tangent (tan δ), and their tolerance are the three most critical parameters.",
      alerts: [
        { type: "info", text: "Dielectric Loss: At high frequencies, standard FR4 exhibits significant signal loss. FR-4 has tan δ ≈ 0.018–0.024 and εr tolerance ±10–20%. Above ~2 GHz this causes 2–4 dB/10 cm insertion loss. Use Rogers RO4003C (tan δ = 0.0027 @ 10 GHz) or RT/duroid 5880 (tan δ = 0.0009) for precision RF work." }
      ],
      cards: [
        { title: "Standard FR4", text: "Suitable for low frequency or short RF traces. However, inconsistent Dk and high Df (tan δ ≈ 0.02) cause excessive attenuation above 1 GHz. Max practical use: ~2 GHz." },
        { title: "Rogers RO4003C", text: "εr = 3.55 ±0.05, tan δ = 0.0027 @ 10 GHz. Max practical freq ~40 GHz. The industry workhorse for Wi-Fi, 5G sub-6, LNA designs. 4–6× cost of FR-4." },
        { title: "Rogers RT/duroid 5880", text: "εr = 2.20 ±0.02, tan δ = 0.0009 @ 10 GHz. Max practical freq >100 GHz. The gold standard for mmWave, V-band, W-band. 10–15× cost of FR-4." },
        { title: "Surface Finish Impact on RF Loss", text: "ENIG: Nickel layer (µr > 1) adds ~10–15% conductor loss at 10 GHz vs bare copper. OSP: Best conductivity but poor shelf life. HASL: Rough tin-lead surface adds conductor loss. Specify VLP (Very Low Profile) copper foil for Ka-band and above to combat surface roughness loss." }
      ]
    },
    {
      heading: "Transmission Lines & Impedance Control",
      content: "Microstrip, Stripline, and Coplanar Waveguides.",
      alerts: [
        { type: "warning", text: "Solid Return Path: An RF trace without an uninterrupted reference plane underneath is an antenna, not a transmission line. Never cross a split plane. Never route over a via clearance hole in the reference plane — even a 0.3 mm antipad under a 5 GHz trace causes a 15–25% impedance bump and measurable radiation." }
      ],
      cards: [
        { title: "Microstrip", text: "Top layer trace referenced to the next solid ground layer. Easy to tune and fabricate. Use Hammerstad-Jensen dual-branch model: W/h ≤ 1 → Z₀ = (60/√εeff)×ln(8h/W + W/4h); W/h > 1 → Z₀ = 120π/[√εeff×(W/h + 1.393 + 0.667×ln(W/h + 1.444))]. The Wheeler single-formula approximation has up to 5% error for W/h > 3." },
        { title: "Stripline", text: "Inner layer trace sandwiched between two ground planes. Excellent isolation but harder to tune. The Cohn formula is valid ONLY for centered (symmetric) stripline. In asymmetric stackups (common in 6-layer boards), use the Wadell asymmetric formula — applying the centered formula to an off-center trace causes up to 20% Z₀ error." },
        { title: "Coplanar Waveguide (CPW)", text: "Trace surrounded by ground pour on the same layer. Ideal for extreme high frequencies and tight isolation." },
        { title: "Grounded CPW (GCPW)", text: "CPW with an additional back ground plane. WARNING: εeff for GCPW is NOT (εr+1)/2 — that formula is for ungrounded CPW only. GCPW εeff is substrate-dominated and must be computed via elliptic integral conformal mapping or a 2.5D EM solver (Sonnet Lite is free). Gap G ≈ W as a starting point." }
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
        { type: "info", text: "Via Stubs: A via stub acts as a resonant antenna. A 1 mm stub resonates near 30 GHz, causing a deep notch in insertion loss. Use blind/buried vias or backdrilling to remove the stub for any RF signal layer transition above 10 GHz." }
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
          body: "Place ground vias along the edges of RF traces, spaced ≤ λ/20, to confine the electromagnetic field and prevent coupling with adjacent circuits. At 10 GHz on RO4003C: max pitch ≈ 1.6 mm."
        },
        {
          number: "RF-03",
          severity: "warning",
          title: "Trace-to-Trace Clearance",
          body: "Minimum 3× trace width between adjacent RF lines. For isolation > 20 dB, use ≥ 5× trace width. Capacitive coupling between parallel RF traces creates unwanted resonances."
        },
        {
          number: "RF-04",
          severity: "warning",
          title: "Solder Mask Clearance",
          body: "Specify solder mask openings over all RF traces. LPI solder mask (εr ≈ 3.5) over a 50 Ω microstrip shifts Z₀ to ~44–46 Ω. Always validate final Z₀ with mask εr included in the stackup model."
        },
        {
          number: "RF-05",
          severity: "warning",
          title: "No Thermal Relief on RF GND Pads",
          body: "Never use thermal relief spokes on ground pads of RF components. Thermal relief adds series inductance to the ground path. At GHz frequencies, even 0.5 nH is enough to shift a matching network resonance by hundreds of MHz. Always use direct solid copper connection."
        },
        {
          number: "RF-06",
          severity: "info",
          title: "Decoupling Cap Selection (SRF-Aware)",
          body: "Place bypass caps within 0.5–1 mm of device power pin. Select cap value so its Self-Resonant Frequency (SRF) covers the operating RF frequency. At 2.4 GHz, a 100 pF cap may have SRF at 600 MHz — useless for RF bypass. Use 1–10 pF chip caps for GHz-range bypass, plus a 100 nF for low-frequency stability. Add a ferrite bead between RF and digital supply rails."
        },
        {
          number: "RF-07",
          severity: "info",
          title: "Connector Launch Design",
          body: "The SMA connector launch is the single biggest impedance discontinuity on most RF boards. The SMA center pin pad must be geometrically matched to 50 Ω — typically requires a tapered pad. Remove ground plane antipad under SMA center pin. Model the connector footprint in 3D EM for any design above 3 GHz."
        },
        {
          number: "RF-08",
          severity: "warning",
          title: "VCO / PLL Isolation from LNA",
          body: "VCO phase noise and harmonic injection is the leading cause of receiver desensitization. Minimum spacing: 20 mm + shielded section between LO/synthesizer and LNA input. Budget at least −80 dBm coupling limit between LO and LNA input."
        }
      ]
    },
    {
      heading: "RF PCB Stackup & Partitioning",
      content: "Layer ordering strategies for RF + digital mixed boards and pure RF designs.",
      alerts: [
        { type: "info", text: "Mixed-Signal Partition Rule: Draw a physical line separating the RF section from digital. No digital trace should cross under any RF trace. No power trace should pass through the RF ground plane. Use a single-point or bridge connection between RF and digital grounds to avoid ground loops. Place RF circuitry in one corner quadrant of the board." }
      ],
      cards: [
        { title: "4-Layer RF Stackup", text: "L1 (RF/Signal Microstrip) → L2 (Solid GND — RF reference) → L3 (Digital/Power) → L4 (GND/Heatspreader). L1–L2 dielectric sets Z₀. Keep L2 as unbroken solid ground — no routing, no cutouts under RF traces." },
        { title: "6-Layer Mixed RF+Digital", text: "L1 (RF Microstrip/Antennas) → L2 (RF GND reference) → L3 (Stripline digital) → L4 (Power planes) → L5 (Digital GND) → L6 (Digital component side). RF and digital sections must have a copper guard/moat between them. No digital via should cross the L2 RF ground plane." },
        { title: "RF-Digital Moat Technique", text: "A moat is a slot cut in the shared ground plane between RF and digital domains. Connect across the moat with a single copper bridge at the power supply entry point only. This prevents digital switching currents from returning through the RF ground and causing noise floor degradation at the LNA input." },
        { title: "Via Backdrilling Strategy", text: "For 6+ layer boards with RF signals changing layers above 10 GHz: specify backdrilling to remove via stubs. A 1 mm stub resonates at ~30 GHz. Backdrillable PCBs add ~15–20% to fabrication cost but eliminate the most common mmWave failure mode." }
      ]
    },
    {
      heading: "EMI/EMC Shielding & Antenna Design",
      content: "Keeping signals contained and maximizing radiation only where desired.",
      cards: [
        { title: "Faraday Cages & Shield Cans", text: "Enclose sensitive RF oscillator circuits inside metal shield cans soldered to the ground plane to prevent external EMI ingress and internal radiation egress. Provides 40–80 dB isolation. Design the can footprint from the very first schematic revision — it cannot be added as an afterthought." },
        { title: "Aperture Shielding Rule", text: "SE_aperture ≈ 20·log₁₀(λ / 2L) dB, where L is the longest dimension of any aperture in a shield wall. A 10 mm slot reduces SE to ~20 dB at 3 GHz. Keep all apertures ≤ λ/20 for SE > 20 dB. Add castellated ground vias around shield can perimeter at ≤ λ/20 pitch." },
        { title: "Antenna Pi-Networks (Mandatory)", text: "Always include a Pi-network footprint (series-shunt-series) near the antenna feed point. PCB antenna feed impedance is 20–200 Ω — never 50 Ω. Connecting directly to the IC RF port causes 6–10 dB gain loss. Measure with a VNA and tune post-fab. Even if the Pi-network starts as 0 Ω / open, the footprint must be present." },
        { title: "PCB Antenna Keep-Out Zone", text: "Monopole: length = λ/4 in free space. Patch: length ≈ λ/2 in substrate. IFA: folded monopole, tunable with feed position. All PCB antennas require a complete unbroken ground plane reference and a clear keep-out zone ≥ λ/4 around the radiating element — no metal, no vias, no traces allowed." }
      ],
      type: "cross-ref",
      refModuleId: "emi_emc",
      refLabel: "EMI / EMC Compliance Module",
      refDesc: "RF shielding and EMI/EMC compliance are deeply interrelated. Study the EMI/EMC module for regulatory frameworks (FCC Part 15, CE RED, CISPR 32), aperture theory, conducted emissions filter design, and pre-compliance measurement strategy.",
      refTargetHeading: "Aperture Theory & Enclosure Shielding"
    }
  ],
  checklists: [
    {
      category: "1. Pre-Layout RF Verification",
      items: [
        "Selected substrate material appropriate for operating frequency (Rogers, PTFE, or equivalent for > 2 GHz).",
        "Verified substrate εr and tan δ values from the actual manufacturer datasheet — not from generic references.",
        "Specified VLP (Very Low Profile) or RTF copper foil for designs at Ka-band (26+ GHz) and above.",
        "Defined the RF stackup with solid, unbroken ground planes as direct RF references.",
        "Confirmed all RF trace impedances are calculated using Hammerstad-Jensen (microstrip) or Cohn/Wadell (stripline) models.",
        "Validated impedance with a 2.5D EM solver (Sonnet Lite, ADS Momentum) for production designs."
      ]
    },
    {
      category: "2. Baseline RF Integrity",
      items: [
        "Verified all high-frequency traces are routed over a continuous, unbroken ground plane.",
        "Calculated and applied specific trace widths for target impedance (e.g. 50Ω).",
        "Replaced sharp 90° trace corners with rounded curves or 45° miters.",
        "Assessed material Dk and Df to ensure acceptable insertion loss at target frequencies.",
        "Specified solder mask openings over all RF traces in Gerber output files.",
        "Verified RF-to-digital ground partitioning with single-point bridge connection only."
      ]
    },
    {
      category: "3. Advanced RF Engineering",
      items: [
        "Implemented via stitching or via fences along critical RF lines, spaced ≤ λ/20.",
        "Included a Pi-matching network footprint near the antenna feed for future tuning.",
        "Specified back-drilling or blind vias for high-frequency signal layer transitions to eliminate via stubs.",
        "Ensured proper clearance around Coplanar Waveguide (CPW) traces to the coplanar ground pour (Gap G ≈ W as minimum).",
        "Applied direct copper connection (no thermal relief) to all RF IC ground pads and shield can pads.",
        "Verified decoupling cap SRF covers the RF operating frequency — used 1–10 pF for GHz bypass.",
        "Designed SMA connector launch with tapered pad geometry and antipad removed under center pin.",
        "Maintained ≥ 20 mm + shielded separation between VCO/PLL and LNA input."
      ]
    },
    {
      category: "4. Shielding & EMC Compliance",
      items: [
        "Designed metal shield can footprints for all oscillators, LNAs, and precision RF blocks from schematic stage.",
        "Verified all shield can apertures are ≤ λ/20 to maintain SE > 20 dB.",
        "Added castellated ground vias around shield can perimeter at ≤ λ/20 pitch.",
        "Cross-checked RF layout against EMI/EMC module requirements for regulatory compliance."
      ]
    }
  ]
};
