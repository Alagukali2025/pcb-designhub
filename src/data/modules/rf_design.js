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
    },
    {
      heading: "Trace Antenna Design: Physics, Types & Why",
      content: "A PCB trace antenna is a resonant conductor etched directly into the board — zero extra cost, zero extra assembly. Understanding the physics behind resonance and the εeff correction is the difference between a working design and an 8–12 dB loss that silently kills your link budget.",
      alerts: [
        { type: "warning", text: "εeff Correction is Mandatory: A 2.4 GHz monopole in free space = 31.2 mm. On FR-4 (εr = 4.4), microstrip εeff ≈ 3.0–3.4. Physical length ≈ 18 mm. Skipping this correction detunes the antenna by 30–40% and costs 8–12 dB of radiated performance — an invisible failure that looks like a routing problem but is a physics error." }
      ],
      cards: [
        { title: "Why Use a PCB Trace Antenna?", text: "Eliminates the cost and assembly risk of a discrete antenna component. Fully integrated into PCB manufacturing — no extra BOM line, no connector, no coax. Suitable for: BLE, Wi-Fi 2.4/5 GHz, Zigbee, LoRa (sub-GHz), NFC. Best choice for cost-sensitive, high-volume IoT products where board space permits a keep-out zone." },
        { title: "Resonance Physics — How It Works", text: "A trace antenna is a resonant conductor. When its electrical length matches λ/4 (or λ/2), impedance becomes predominantly real (resistive) — this is resonance. Maximum power transfers from the RF IC into the antenna. The PCB substrate shortens the effective electrical length because εr > 1. Physical length formula: L = λ₀ / (4 × √εeff), where εeff is the effective dielectric constant of the microstrip geometry — not simply εr of the substrate." },
        { title: "Monopole Antenna", text: "Quarter-wave (λ/4) straight trace. Free space at 2.4 GHz: 31.2 mm. On FR-4 (εeff ≈ 3.2): ~17 mm. Gain: 2.15 dBi. Pattern: omnidirectional in the plane perpendicular to the element. Best for: basic IoT sensors, industrial nodes. Simple to design but requires the largest keep-out zone of all PCB antenna types." },
        { title: "IFA (Inverted-F Antenna)", text: "A folded monopole with a short-circuit pin that tunes input impedance. Feed position along the horizontal arm controls impedance match — moveable post-fab for trimming. Compact: fits in ~15×5 mm at 2.4 GHz. Gain: 1.5–2 dBi. The industry standard for BLE/Wi-Fi SoC modules (ESP32, nRF52, CC2640). Preferred over monopole when board space is constrained." },
        { title: "Meander Line Antenna", text: "A physically compressed monopole — the trace zigzags to achieve electrical length in a smaller footprint. Gain: −1 to −3 dBi (worse than monopole due to mutual inductance cancellation between adjacent segments). Substrate loading shifts resonance significantly — always verify with EM simulation. Use only when board space is the dominant constraint and link margin is > 10 dB." },
        { title: "Patch Antenna", text: "Half-wave (λ/2) resonant patch over a solid ground plane. Physical size at 2.4 GHz on FR-4: ~29×29 mm. Gain: 6–8 dBi directional. Used for: GPS (1.575 GHz), LTE, directional point-to-point links. Requires two continuous ground plane layers. Bandwidth is narrow (~1–5% without tuning stubs). Not suitable for omnidirectional IoT applications." },
        { title: "Chip Antenna vs. Trace Antenna", text: "Chip antenna: pre-characterized, compact (as small as 2×1 mm), costs $0.20–$2.00. Trace antenna: zero cost, requires larger keep-out zone, must be simulated for each board revision. Choose chip antenna when board space is the primary constraint. Choose trace antenna when cost and BOM simplicity dominate. Never mix both on the same RF port without a switching circuit." }
      ]
    },
    {
      heading: "PCB Antenna Placement Rules",
      content: "Where the antenna sits on the board determines everything: gain, pattern, regulatory compliance, and certification validity. These rules are non-negotiable — antenna placement mistakes cannot be fixed in software.",
      alerts: [
        { type: "warning", text: "Antenna Placement is Frozen at Certification: Once an antenna position is submitted for FCC/CE certification testing, it is legally locked. Moving the antenna by even 2 mm post-certification invalidates the approval and requires a full re-test at $10,000–$50,000 cost. Freeze the antenna position before ordering first prototypes." }
      ],
      ruleCards: [
        {
          number: "ANT-01",
          severity: "warning",
          title: "Board-Edge Placement",
          body: "The radiating element of any PCB antenna must extend to or beyond the PCB edge. Never bury the antenna in the center of the board — surrounding copper pours, power planes, and component metal masses detune and absorb radiation. Corner or long-edge placement is preferred for omnidirectional patterns."
        },
        {
          number: "ANT-02",
          severity: "warning",
          title: "Keep-Out Zone Enforcement",
          body: "Enforce a keep-out zone of ≥ λ/4 radius around the radiating element in your EDA tool. Assign a 'RF_KEEPOUT' area that triggers DRC violations for copper, vias, components, and solder mask fills. At 2.4 GHz: λ/4 ≈ 31 mm. At 868 MHz: λ/4 ≈ 86 mm. This zone is not a suggestion — every element inside it shifts resonant frequency and distorts the radiation pattern."
        },
        {
          number: "ANT-03",
          severity: "warning",
          title: "Ground Plane Geometry",
          body: "Ground plane must be present below the feed transmission line, but completely absent below the radiating element for monopole and IFA antennas. The ground plane edge acts as a counterpoise — its size and shape affect radiation pattern and resonant frequency. Patch antennas are the exception: they require a solid, continuous ground plane under the patch with no cutouts."
        },
        {
          number: "ANT-04",
          severity: "warning",
          title: "Clearance from Metal Structures",
          body: "Maintain a minimum 5 mm clearance (ideally λ/4) between the radiating element and any metal structure: battery, shield can, USB/SMA connector body, mounting screws, or heatsinks. Metal objects within λ/4 act as parasitic reflectors or absorbers that detune the antenna by 5–15% and tilt the radiation pattern — measurable as 3–8 dB RSSI degradation in the affected direction."
        },
        {
          number: "ANT-05",
          severity: "info",
          title: "Metal Enclosure Derating",
          body: "A PCB trace antenna inside a sealed metal enclosure will fail to meet regulatory minimum EIRP requirements. Add 3–6 dB to the link-budget margin if enclosure is partially metal. For fully sealed metal enclosures, redesign as an aperture antenna or use an external antenna via a bulkhead SMA. Plastic enclosures attenuate 0.5–2 dB depending on material fill (ABS, PC, glass-filled nylon)."
        },
        {
          number: "ANT-06",
          severity: "info",
          title: "Antenna Orientation",
          body: "For omnidirectional coverage (typical IoT requirement), orient the antenna element perpendicular to the dominant board plane. A monopole or IFA has a radiation null pointing along its own axis — plan your product's real-world orientation accordingly. For wall-mounted devices, a horizontal antenna element pointed up/down creates full-azimuth coverage. For handheld devices, the antenna should point away from the user's hand grip."
        },
        {
          number: "ANT-07",
          severity: "warning",
          title: "FCC / CE Certification Lock",
          body: "The antenna position, orientation, ground plane size, and keep-out zone used during FCC/CE/TELEC certification testing define a legally binding design. Any change — including moving the antenna 2 mm, adding a nearby component, or changing the board shape — requires re-certification. Document the exact antenna geometry in the design history file and treat it as a controlled parameter from the first prototype."
        },
        {
          number: "ANT-08",
          severity: "warning",
          title: "Pi-Network Footprint is Mandatory",
          body: "Always include a Pi-network footprint (shunt cap → series element → shunt cap) between the RF IC output and the antenna feed point. PCB antenna feed impedance is 20–200 Ω — never 50 Ω at first spin. Without a Pi-network, 6–10 dB of transmit power is reflected back into the PA. Populate with DNP or 0Ω/open placeholders on first spin. Tune with a VNA after board bring-up. The footprint MUST exist on the PCB — it cannot be retrofitted."
        }
      ]
    },
    {
      heading: "Via Stitching & Shielding Nets — Advanced Practice",
      content: "Via stitching basics are covered across multiple modules. This section adds what is missing: the EDA shielding net concept, the distinction between via fence and via stitching, and the per-frequency λ/20 spacing table that engineers must calculate for their specific design.",
      alerts: [
        { type: "warning", text: "A Floating Copper Pour is an Antenna: Any copper island on an RF board with no stitching via connecting it to the ground reference re-radiates as a parasitic antenna. Orphaned copper islands are the #1 cause of unexpected spurious emissions during FCC pre-compliance tests. Every isolated copper region must be either removed or stitched. No exceptions." }
      ],
      cards: [
        { title: "Via Fence vs. Via Stitching — The Difference", text: "Via fence: a row of ground vias placed alongside a specific RF trace, spaced ≤ λ/20, creating a waveguide wall that confines the EM field and suppresses crosstalk to adjacent circuits. Via stitching: a distributed grid of ground vias across the entire copper pour on a layer, preventing any copper island from floating. Both are required on RF boards — they serve different purposes and are not interchangeable." },
        { title: "λ/20 Spacing — By Target Frequency", text: "2.4 GHz → max via pitch 6.25 mm. 5 GHz → 3.0 mm. 10 GHz → 1.5 mm. 24 GHz → 0.63 mm. 77 GHz → 0.19 mm. Always calculate for your highest frequency of concern — not your fundamental operating frequency. A board transmitting at 2.4 GHz still radiates harmonics at 4.8 GHz and 7.2 GHz. Stitch to the 3rd harmonic minimum." },
        { title: "Floating Pour Prevention", text: "A top-layer ground pour not connected via stitching to the inner ground plane acts as a parasitic patch antenna. Minimum stitching density: 1 via per 100 mm² of copper pour in the RF zone. In high-frequency designs (> 10 GHz), increase to 1 via per 25 mm². Use your EDA copper pour manager to auto-generate stitching vias — manually placing them is error-prone at high density." },
        { title: "Shielding Nets in EDA Tools", text: "Define a dedicated net named SHIELD_GND (or RF_GND) in your EDA netlist. Assign all shield can land pads, via fence vias, and guard ring vias to this net. This keeps the netlist auditable, enables DRC net-continuity checks on the shield structure, and prevents accidental short circuits between the shield and signal nets. In KiCad: assign via net in footprint properties. In Altium: use Net Inspector to verify all shield vias are connected." },
        { title: "Shield Can Seam Rule", text: "The via row beneath the shield can wall perimeter must maintain ≤ λ/20 pitch — gaps in the via row create apertures that radiate. All perimeter vias must share the same net (SHIELD_GND or GND). The can lid seam, hinge points, and any cable entry apertures must have their longest dimension ≤ λ/20 to maintain shielding effectiveness > 20 dB. A 10 mm aperture reduces SE to ~20 dB at 3 GHz." },
        { title: "Stitching Via Size Guidelines", text: "Use standard drill 0.3 mm / pad 0.6 mm for stitching vias. Annular ring ≥ 0.1 mm (check fab DFM). Avoid microvias (laser-drilled blind vias) for stitching unless the HDI stackup strictly requires it — microvias have higher via inductance per unit than through-hole vias and reduce stitching effectiveness at > 10 GHz. Through-hole stitching vias that span all layers are always preferred for ground stitching." }
      ]
    },
    {
      heading: "RF Board Design by Product Domain",
      content: "The product application domain defines every fundamental RF design decision: substrate, stackup, shielding aggressiveness, and which regulatory certifications drive the layout constraints. IoT, Medical, and Industrial RF boards require fundamentally different engineering approaches — not just different component choices.",
      alerts: [
        { type: "info", text: "Medical and Automotive RF boards are NOT simply 'better FR-4 designs'. They require a fundamentally different design philosophy: substrate material qualification, accelerated life testing (thermal cycling, vibration, humidity), regulatory pre-certification layout reviews by accredited labs, and documented Design History Files (DHF) that trace every layout decision to a requirement. Treat them as separate engineering disciplines from day one of the project." }
      ],
      cards: [
        { title: "General / Hobby RF", text: "Frequency: Sub-1 GHz to 2.4 GHz. Substrate: FR-4 acceptable. Surface finish: HASL or ENIG. Shielding: minimal or none. Regulatory: FCC Part 15 basic unintentional radiator. Focus: lowest cost, fastest time to market. PCB trace antenna viable. Via stitching at board edge is good practice but not mandatory. Suitable for: makers, prototypes, internal-only products, educational hardware." },
        { title: "IoT (BLE / Wi-Fi / Zigbee / LoRa)", text: "Frequency: 433 MHz, 868/915 MHz (LoRa/Sigfox), 2.4 GHz (BLE/Zigbee/Wi-Fi), 5 GHz (Wi-Fi). Substrate: FR-4 for 2.4 GHz; Rogers RO4003C for 5 GHz precision. Key concerns: OTA coexistence (BLE and Wi-Fi share 2.4 GHz — implement frequency hopping and guard bands), power-on RF transient current (can reset poorly decoupled VDD rails), OTA firmware update antenna continuity. Regulatory: FCC Part 15B (USA), CE RED (EU), TELEC (Japan), SRRC (China), IC (Canada). Pi-network footprint mandatory on every antenna feed." },
        { title: "Medical RF (MICS / BLE / UWB)", text: "Frequency: 403 MHz (MICS implant band), 2.4 GHz (BLE), 3.1–10.6 GHz (UWB positioning). Zero-failure tolerance — a dropped RF packet in a cardiac monitor is a patient safety event. SAR (Specific Absorption Rate) must comply with FCC limits (1.6 W/kg over 1g, USA) and ICNIRP (2.0 W/kg over 10g, EU) for body-worn devices. Must pass IEC 60601-1-2 (EMC for medical electrical equipment) and IEC 62133 (battery safety). Substrate: Rogers or equivalent low-loss. Full metal shield can enclosure mandatory around RF section. Redundant ground stitching grid. Fault-tree analysis (FTA) required for every RF power rail failure mode." },
        { title: "Industrial / Automotive RF", text: "Frequency: 900 MHz ISM, 2.4 GHz, 5.9 GHz DSRC/V2X, 24 GHz / 77 GHz radar. Operating temperature: −40°C to +125°C with thermal cycling per AEC-Q100. Substrate: Rogers / PTFE for > 10 GHz. Component qualification: AEC-Q grade required for automotive. Regulatory: CISPR 25 (automotive conducted/radiated emissions), ISO 11452 (automotive RF immunity), IEC 61000 (industrial EMC). Solder joint reliability on RF pads is safety-critical — use robust annular rings ≥ 0.15 mm, no via-in-pad without filled and capped vias, conformal coat over all RF traces for moisture protection." },
        { title: "Layout Rule Deltas by Domain", text: "General: FR-4, HASL, minimal stitching, no Pi-network required. IoT: FR-4/Rogers, ENIG, edge stitching, Pi-network mandatory, coexistence guard bands. Medical: Rogers, ENIG, full stitching grid, Pi-network, full shield can, ferrite bead on every RF power rail, no thermal relief on any GND pad. Automotive: Rogers/PTFE, ENIG, full stitching, thermal via arrays, vibration-rated solder alloy (SAC305 minimum), conformal coat, AEC-Q BOM. Each step up the ladder adds cost but removes a specific failure mode." }
      ]
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
    },
    {
      category: "5. RF Trace Antenna Design Review",
      description: "A 10-point pre-tape-out review for every PCB antenna design. Each item maps to a documented field failure or board respin caused by antenna detuning, impedance mismatch, or keep-out violations. Use this checklist alongside a VNA measurement to confirm S11 < −10 dB at your target band before approving Gerbers for fabrication.",
      items: [
        "Verified physical antenna length is corrected for substrate εeff — NOT free-space λ/4.",
        "Confirmed antenna type (monopole / IFA / meander / patch) matches product size, gain, and domain constraints.",
        "Keep-out zone (≥ λ/4 radius) enforced in EDA tool — zero copper, vias, or components inside the boundary.",
        "Ground plane geometry confirmed: absent below radiating element for monopole/IFA; continuous below patch.",
        "Pi-network or L-network footprint present at antenna feed — even if populated as DNP or 0Ω / open placeholders.",
        "S11 return loss < −10 dB at target band verified by EM simulation (Sonnet Lite / HFSS / CST / ADS Momentum).",
        "No metal structures (battery, shield can, USB connector, mounting screws) within λ/4 of the radiating element.",
        "Antenna position is identical to the FCC/CE certification test sample layout — any move requires full re-certification.",
        "Solder mask opening specified over the full antenna trace — LPI solder mask (εr ≈ 3.5) shifts resonant frequency.",
        "Feed trace from RF IC to antenna confirmed at 50Ω — no width necking, no abrupt geometry changes at the launch point."
      ]
    },
    {
      category: "6. RF Manual Testing Protocol",
      description: "Step-by-step bring-up and validation sequence for RF boards. Assumes a VNA (Vector Network Analyzer) with a SOLT calibration kit, a spectrum analyzer, and a calibrated receive antenna. For field-only tests without a VNA, items 5 and 6 provide a minimum viable RF sanity check. Always complete the first power-on checks (item 8) before connecting any antenna to the board.",
      items: [
        { label: "VNA Calibration", text: "Perform SOLT (Short-Open-Load-Thru) calibration at the cable end / SMA reference plane before every measurement session. Do not skip — an uncalibrated VNA gives false S11 readings that can pass a detuned antenna." },
        { label: "Return Loss S11", text: "Sweep VNA from 100 MHz to 6 GHz. Confirm S11 < −10 dB at the target band. Smith chart must show impedance in the 25–100 Ω real range at resonance. A deep S11 notch offset from target frequency indicates εeff correction was not applied to the antenna length." },
        { label: "Insertion Loss S21", text: "For RF trace verification: confirm S21 < 1 dB per 10 cm at the target frequency. Probe at dedicated RF coupon pads or SMA launch pairs fabricated on the panel edge. S21 > 2 dB indicates excessive substrate loss — verify material Df and surface finish." },
        { label: "Conducted Spectrum", text: "Connect spectrum analyzer directly to RF IC TX output (before antenna). Confirm: no spurious emission > −30 dBc relative to fundamental, harmonics within FCC Part 15 / CE RED limits, no unexpected mixing products from crystal harmonics coupling into the PA." },
        { label: "RSSI Field Test", text: "At 1 m distance from a calibrated reference receiver, measure RSSI in dBm. Must be within ±3 dB of the link budget prediction. Rotate the board through 360° in two planes — any RSSI drop > 10 dB at a specific angle indicates a radiation pattern null from a mismatched antenna or keep-out violation." },
        { label: "Temperature Drift", text: "Sweep S11 at −20°C (cold soak), +25°C (ambient), and +85°C (hot). Resonant frequency shift must be < 5% of the target frequency across the full range. FR-4 εr increases with temperature — a 2.4 GHz design can drift to 2.32 GHz at +85°C if no thermal margin was designed in." },
        { label: "Impedance Test Coupon", text: "Fabricate a dedicated 50 Ω microstrip coupon trace on the same PCB panel as the production board. Measure with TDR or VNA and confirm impedance within ±10% of target. The coupon validates the fabricator's dielectric thickness and trace geometry — if the coupon fails, all boards on that panel are suspect." },
        { label: "First Power-On RF Checks", text: "Before connecting the antenna: (1) verify correct supply voltage on RF IC VDD pin, (2) confirm reference crystal oscillator is running by probing crystal pins for ~1 Vpp oscillation, (3) enable TX in firmware and measure output power at the RF IC's RF_OUT pin with a spectrum analyzer. Only connect the antenna after confirming the IC is transmitting at expected power." }
      ]
    }
  ]
};
