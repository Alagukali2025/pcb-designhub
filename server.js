{
  "home": {
    "title": "Welcome to PCB Masterclass Dashboard",
    "intro": "Your industrial guide to mastering Printed Circuit Board design. This platform bridges the gap between basic theory and real-world manufacturing standards.",
    "modules": [
      { "icon": "fa-microchip", "title": "Footprint Creation", "desc": "Master IPC-7351 standards and land patterns." },
      { "icon": "fa-bolt", "title": "High-Speed Routing", "desc": "Learn impedance control and differential pairs." },
      { "icon": "fa-layer-group", "title": "Stackup Design", "desc": "Understand materials, prepreg, and cores." }
    ]
  },
  "footprint": {
    "title": "Footprint Creation (IPC-7351)",
    "intro": "A footprint (or land pattern) is the physical arrangement of copper pads on a PCB. Designing it incorrectly leads to tombstoning, solder bridges, and manufacturing failures.",
    "sections": [
      {
        "heading": "The IPC-7351 Standard",
        "content": "IPC-7351 is the global standard for surface mount design. It relies on mathematical models to calculate the exact pad size based on the component's leads and required solder fillets (Toe, Heel, and Side)."
      },
      {
        "heading": "The 3 Density Levels",
        "content": "Not all boards are the same. IPC defines three density levels to determine how much extra pad area you need:",
        "cards": [
          { "title": "Level A (Maximum)", "text": "For low-density boards or extreme environments (aerospace/military). Largest solder joints for maximum strength." },
          { "title": "Level B (Nominal)", "text": "The standard for most desktop and consumer electronics. A perfect balance between size and reliability." },
          { "title": "Level C (Least)", "text": "For high-density mobile devices (smartphones). Minimal solder joints to save maximum board space." }
        ]
      },
      {
        "heading": "Design Guidelines & Courtyard",
        "content": "The **Courtyard** is the absolute minimum area required around a component. It includes the component body, the pads, and an extra 'excess' boundary to prevent placement machines from crashing components into each other."
      },
      {
        "heading": "Common Mistakes to Avoid",
        "list": [
          "Placing silkscreen over exposed copper pads (causes soldering defects).",
          "Forgetting to mark Pin 1 on both the Assembly and Silkscreen layers.",
          "Ignoring manufacturing tolerances and making the courtyard too tight."
        ]
      }
    ],
    "checklist": [
      "Verify datasheet dimensions and tolerances.",
      "Calculate Toe, Heel, and Side fillets for Density Level B.",
      "Ensure Silkscreen clearance is at least 0.1mm from pads.",
      "Add Courtyard polygon on the correct mechanical layer.",
      "Verify 3D STEP model aligns perfectly with pads."
    ]
  }
}
