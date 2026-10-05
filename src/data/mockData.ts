import { ElectronicComponent, ReuseProject, MonthlyQuotaConfig } from '../types';

export const INITIAL_COMPONENTS: ElectronicComponent[] = [
  {
    id: 'comp-1',
    name: '5mm High-Intensity LEDs (Pack of 10)',
    category: 'Passive Components',
    quantity: 15,
    unit: 'pcs',
    unitWeightGrams: 0.5,
    condition: 'Tested & Working',
    industrialSource: 'QA Reject Batch - Display Board Line B',
    dateAdded: '2026-09-28',
    imageUrl: '/src/assets/images/electronic_components_tray_1791201399697.jpg',
    notes: 'Forward voltage: 2.0V - 3.2V, Forward current: 20mA. Assorted Red, Green, and Warm White.',
    pinoutOrSpecs: 'Long lead = Anode (+), Short lead with flat rim = Cathode (-)'
  },
  {
    id: 'comp-2',
    name: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)',
    category: 'Passive Components',
    quantity: 45,
    unit: 'pcs',
    unitWeightGrams: 0.25,
    condition: 'Tested & Working',
    industrialSource: 'Automotive Sub-assembly PCB Scrap',
    dateAdded: '2026-09-29',
    imageUrl: '/src/assets/images/electronic_components_tray_1791201399697.jpg',
    notes: '0.25W power rating, ±5% tolerance. Desoldered and lead-tested on digital multimeter.',
    pinoutOrSpecs: 'Color bands: Red-Red-Brown-Gold (220Ω), Brown-Black-Red-Gold (1kΩ)'
  },
  {
    id: 'comp-3',
    name: 'Arduino Uno Rev3 Compatible Microcontroller',
    category: 'Microcontrollers & ICs',
    quantity: 3,
    unit: 'pcs',
    unitWeightGrams: 28,
    condition: 'Tested & Working',
    industrialSource: 'Robotics Lab Equipment Decommission',
    dateAdded: '2026-10-01',
    imageUrl: '/src/assets/images/arduino_circuit_project_1791201414517.jpg',
    notes: 'ATmega328P microcontroller with CH340 USB-UART chip. Working bootloader, tested with Blink.',
    pinoutOrSpecs: '14 Digital I/O (6 PWM), 6 Analog Inputs, Operating Voltage 5V DC'
  },
  {
    id: 'comp-4',
    name: 'DC Toy / Geared Motor 3V-6V',
    category: 'Actuators & Motors',
    quantity: 6,
    unit: 'pcs',
    unitWeightGrams: 32,
    condition: 'Tested & Working',
    industrialSource: 'Conveyor Sorting Mechanism Rejects',
    dateAdded: '2026-10-02',
    imageUrl: '/src/assets/images/electronic_components_tray_1791201399697.jpg',
    notes: 'Dual shaft gear motor with 1:48 gear ratio. Nominal speed 200 RPM at 6V.',
    pinoutOrSpecs: '2-wire polarity reversible DC motor, stalls at 800mA'
  },
  {
    id: 'comp-5',
    name: 'Jumper Wires Assorted (M-to-M / M-to-F)',
    category: 'Power & Cables',
    quantity: 50,
    unit: 'pcs',
    unitWeightGrams: 1.2,
    condition: 'Tested & Working',
    industrialSource: 'Prototype Testing Bench Cleanout',
    dateAdded: '2026-09-30',
    notes: '20cm multi-colored breadboard connection leads with molded 2.54mm pitch terminals.',
    pinoutOrSpecs: 'Standard 24 AWG stranded copper with insulated PVC sleeve'
  },
  {
    id: 'comp-6',
    name: 'SPST Rocker & Tactile Push Switches',
    category: 'Switches & Controls',
    quantity: 12,
    unit: 'pcs',
    unitWeightGrams: 3.5,
    condition: 'Tested & Working',
    industrialSource: 'Control Panel Refurbishment Overflow',
    dateAdded: '2026-10-01',
    imageUrl: '/src/assets/images/electronic_components_tray_1791201399697.jpg',
    notes: 'Rating: 6A 250V AC / 10A 125V AC for rocker; 12V 50mA for mini push buttons.',
    pinoutOrSpecs: '2-pin single pole single throw latching / momentary'
  },
  {
    id: 'comp-7',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensors',
    quantity: 4,
    unit: 'pcs',
    unitWeightGrams: 9,
    condition: 'Tested & Working',
    industrialSource: 'Automated Guided Vehicle (AGV) Test Rig',
    dateAdded: '2026-10-02',
    imageUrl: '/src/assets/images/solar_smart_monitor_1791201430265.jpg',
    notes: 'Non-contact distance measurement: 2cm to 400cm, accuracy up to 3mm.',
    pinoutOrSpecs: 'Pins: VCC (5V), Trig (Pulse input), Echo (Pulse output), GND'
  },
  {
    id: 'comp-8',
    name: 'Analog Soil Moisture Sensor Module',
    category: 'Sensors',
    quantity: 2,
    unit: 'pcs',
    unitWeightGrams: 8,
    condition: 'Tested & Working',
    industrialSource: 'Greenhouse Automation Pilot Project',
    dateAdded: '2026-10-03',
    imageUrl: '/src/assets/images/solar_smart_monitor_1791201430265.jpg',
    notes: 'Resistive probe with onboard LM393 comparator and potentiometer threshold adjustment.',
    pinoutOrSpecs: 'VCC, GND, DO (Digital threshold), AO (Analog voltage 0-5V)'
  },
  {
    id: 'comp-9',
    name: 'Salvaged Mobile Phone (Android Test Unit)',
    category: 'Discarded Devices & Sub-assemblies',
    quantity: 3,
    unit: 'pcs',
    unitWeightGrams: 155,
    condition: 'Functional / Untested',
    industrialSource: 'Corporate Device Replacement Batch',
    dateAdded: '2026-10-04',
    imageUrl: '/src/assets/images/ewaste_sorting_hero_1791201380637.jpg',
    notes: 'Intact screen, functional WiFi, 3000mAh lithium battery. Cracked back glass but operational camera.',
    pinoutOrSpecs: 'Micro-USB charge port, 5V 1A input, WiFi 802.11 b/g/n, 8MP camera'
  },
  {
    id: 'comp-10',
    name: 'Type-A to Micro USB Cables (1 Meter)',
    category: 'Power & Cables',
    quantity: 8,
    unit: 'pcs',
    unitWeightGrams: 24,
    condition: 'Tested & Working',
    industrialSource: 'IT Dept Peripheral Cleanup',
    dateAdded: '2026-10-03',
    notes: 'Standard 4-core shielded copper cable with intact jacket and molded strain relief.',
    pinoutOrSpecs: 'Red (+5V), Black (GND), Green (Data+), White (Data-)'
  },
  {
    id: 'comp-11',
    name: '4xAA & 9V Battery Holders with Leads',
    category: 'Power & Cables',
    quantity: 5,
    unit: 'pcs',
    unitWeightGrams: 16,
    condition: 'Tested & Working',
    industrialSource: 'Sensor Enclosure Test Prototypes',
    dateAdded: '2026-10-01',
    notes: 'Black molded ABS with nickel-plated spring contacts and 15cm color-coded flying leads.',
    pinoutOrSpecs: 'Red wire positive (+6V for 4xAA, +9V for snap), Black wire negative (GND)'
  }
];

export const PREDEFINED_PROJECTS: ReuseProject[] = [
  {
    id: 'proj-1',
    title: 'LED Emergency Light Station',
    tagline: 'High-efficiency rechargeable work lamp constructed with reclaimed LEDs and battery packs',
    difficulty: 'Beginner',
    category: 'Emergency & Safety',
    estimatedBuildTimeMinutes: 30,
    schematicSummary: 'Battery Holder (+) -> Switch -> Resistor (220Ω) -> LEDs (Parallel Array) -> Ground (-)',
    imageUrl: '/src/assets/images/arduino_circuit_project_1791201414517.jpg',
    requiredComponents: [
      { componentName: '5mm High-Intensity LEDs', category: 'Passive Components', requiredQuantity: 6, unit: 'pcs', approxWeightGrams: 3 },
      { componentName: 'Carbon Film Resistors (220Ω)', category: 'Passive Components', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 0.5 },
      { componentName: 'SPST Rocker & Tactile Push Switches', category: 'Switches & Controls', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 3.5 },
      { componentName: '4xAA & 9V Battery Holders with Leads', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 16 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 4, unit: 'pcs', approxWeightGrams: 4.8 }
    ],
    description: 'A reliable emergency lighting beacon for industrial workshops or field study. Uses a cluster of salvaged 5mm LEDs arranged with current-limiting resistors to prevent thermal runaway. Can be housed in a discarded plastic container or 3D printed scrap shell.',
    wiringInstructions: [
      'Connect the positive (red) lead from the battery holder to one terminal of the rocker switch.',
      'Solder a lead from the other switch terminal to the parallel input of the two 220Ω current-limiting resistors.',
      'Connect the resistor outputs to the Anode (longer pin) of each LED group.',
      'Tie all LED Cathodes (shorter pin with flat notch) together and return to the black battery ground lead.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Test Reclaimed LEDs on Breadboard',
        description: 'Before permanent soldering, insert each discarded LED into a test breadboard with a 330Ω resistor and 5V supply to verify lumen brightness and color consistency.',
        salvageTip: 'Clean old oxidation from component leads with fine sandpaper or an eraser for clean solder wetting.'
      },
      {
        title: 'Step 2: Assemble Circuit on Perfboard or Point-to-Point',
        description: 'Mount the LEDs in a 2x3 honeycomb array. Solder the common anode and cathode rails with recycled jumper wire cores.',
        salvageTip: 'Use a hot glue gun or electrical tape to insulate bare solder joints against accidental shorts.'
      },
      {
        title: 'Step 3: Enclosure & Final Switch Mount',
        description: 'Drill a rectangular slot in a discarded electrical junction box or plastic casing. Press-fit the rocker switch and battery holder securely.',
        salvageTip: 'Diffusing the light with frosted scrap acrylic yields smooth, non-glaring industrial floodlight output.'
      }
    ],
    educationalTakeaways: [
      'Ohm\'s Law application: Calculating current limit R = (V_supply - V_forward) / I_forward',
      'Parallel vs series LED wiring advantages in battery longevity',
      'Life cycle extension: Prevents premature landfill disposal of functional gallium nitride semiconductors'
    ],
    safetyPrecautions: [
      'Disconnect power source before soldering.',
      'Avoid looking directly into high-intensity LEDs at close range.',
      'Ensure battery polarity matches to prevent overheating.'
    ]
  },
  {
    id: 'proj-2',
    title: 'Benchtop Fume & Dust Extractor Fan',
    tagline: 'Compact mini fan for desoldering workstations made with salvaged DC motors and USB cords',
    difficulty: 'Beginner',
    category: 'Industrial Utility',
    estimatedBuildTimeMinutes: 45,
    schematicSummary: 'USB +5V (Red Wire) -> Rocker Switch -> DC Motor (+) -> Motor (-) -> USB GND (Black Wire)',
    imageUrl: '/src/assets/images/arduino_circuit_project_1791201414517.jpg',
    requiredComponents: [
      { componentName: 'DC Toy / Geared Motor 3V-6V', category: 'Actuators & Motors', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 32 },
      { componentName: 'Type-A to Micro USB Cables', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 24 },
      { componentName: 'SPST Rocker & Tactile Push Switches', category: 'Switches & Controls', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 3.5 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 2.4 }
    ],
    description: 'When desoldering scrap PCBs, rosin fumes and fine particulates are released. This benchtop extractor repuporses a salvaged DC motor and broken USB cable to power a low-noise vortex fan that pulls fumes through activated carbon filter foam.',
    wiringInstructions: [
      'Carefully strip the outer PVC jacket of the scrap USB cable to expose the 4 internal conductors.',
      'Snip and insulate the Green (D+) and White (D-) data wires; retain Red (+5V) and Black (GND).',
      'Connect the Red (+5V) wire to the input terminal of the power switch.',
      'Run the output of the switch to the positive motor terminal, and connect the motor negative terminal to the USB Black wire.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Motor RPM & Current Draw Verification',
        description: 'Power the DC motor from a USB phone charger (5V) to confirm smooth bearing rotation and measure no-load current (<250mA).',
        salvageTip: 'Add one drop of lightweight machine oil to the front bushing if the motor whines.'
      },
      {
        title: 'Step 2: Fabricate Fan Blades from Scrap Plastic',
        description: 'Cut an impeller disc with angled blades from an old CD case or plastic bottle cap. Press-fit or epoxy onto the motor shaft.',
        salvageTip: 'Ensure balanced weight across blades to eliminate high-speed vibration.'
      },
      {
        title: 'Step 3: Filter Housing Assembly',
        description: 'Mount the motor in a cut plastic duct or 80mm PC fan shroud with a square of reclaimed charcoal foam filter behind the blades.',
        salvageTip: 'Add rubber feet salvaged from discarded electronics to absorb bench vibrations.'
      }
    ],
    educationalTakeaways: [
      'USB 2.0 power delivery principles (5V DC up to 500mA without software enumeration)',
      'DC motor back-EMF principles and electrical noise decoupling',
      'Workplace environmental safety: capturing hazardous desoldering flux fumes'
    ],
    safetyPrecautions: [
      'Keep fingers away from spinning fan blades; install a protective wire grid.',
      'Do not short the Red (+5V) and Black (GND) wires of the active USB supply.'
    ]
  },
  {
    id: 'proj-3',
    title: 'Smart Plant Soil & Irrigation Monitor',
    tagline: 'IoT telemetry probe tracking plant moisture with analog thresholds and multi-color alert LEDs',
    difficulty: 'Intermediate',
    category: 'Environmental IoT',
    estimatedBuildTimeMinutes: 60,
    schematicSummary: 'Arduino 5V/GND -> Soil Sensor; Sensor AO -> A0; Digital Pins 2,3,4 -> 220Ω Resistors -> R/Y/G LEDs',
    imageUrl: '/src/assets/images/solar_smart_monitor_1791201430265.jpg',
    requiredComponents: [
      { componentName: 'Arduino Uno Rev3 Compatible Microcontroller', category: 'Microcontrollers & ICs', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 28 },
      { componentName: 'Analog Soil Moisture Sensor Module', category: 'Sensors', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 8 },
      { componentName: '5mm High-Intensity LEDs', category: 'Passive Components', requiredQuantity: 3, unit: 'pcs', approxWeightGrams: 1.5 },
      { componentName: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)', category: 'Passive Components', requiredQuantity: 3, unit: 'pcs', approxWeightGrams: 0.75 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 8, unit: 'pcs', approxWeightGrams: 9.6 },
      { componentName: 'Type-A to Micro USB Cables', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 24 }
    ],
    description: 'An educational agro-tech device that senses volumetric water content in soil. Green LED illuminates when moisture is optimal (40-70%), Amber when approaching dry (<40%), and blinking Red when critical hydration is needed. Can send serial telemetry to PC.',
    wiringInstructions: [
      'Connect Soil Moisture Sensor VCC to Arduino 5V, GND to Arduino GND.',
      'Connect Sensor Analog Output (AO) to Arduino Analog Pin A0.',
      'Connect Arduino Digital Pin 2 -> 220Ω Resistor -> Red LED Anode (Cathode to GND).',
      'Connect Arduino Digital Pin 3 -> 220Ω Resistor -> Yellow/Amber LED Anode (Cathode to GND).',
      'Connect Arduino Digital Pin 4 -> 220Ω Resistor -> Green LED Anode (Cathode to GND).'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Calibration in Water & Dry Air',
        description: 'Read raw 10-bit analog values (0-1023) from pin A0 in serial monitor: 1023 in open air (bone dry), ~350 submerged in tap water.',
        salvageTip: 'Coat sensor probe PCB edges with nail polish or conformal silicone to prevent rapid copper corrosion.'
      },
      {
        title: 'Step 2: Threshold Programming',
        description: 'Upload lightweight C++ sketch mapping analog range into 3 distinct state buckets with hysteresis to prevent LED flickering.',
        salvageTip: 'Power the probe intermittently (only during measurement pulse) to cut electrochemical corrosion by 90%.'
      },
      {
        title: 'Step 3: Weatherproof Enclosure',
        description: 'Enclose the Arduino board inside a salvaged waterproof lunchbox or plastic jar with the sensor probe extended through the base.',
        salvageTip: 'Add desiccant silica gel packs salvaged from electronic packing boxes inside the enclosure.'
      }
    ],
    educationalTakeaways: [
      'Analog-to-Digital Conversion (ADC) 10-bit resolution and voltage division',
      'Capacitive vs resistive soil sensing limitations in agricultural monitoring',
      'Embedded power optimization techniques for remote battery-powered field sensors'
    ],
    safetyPrecautions: [
      'Ensure USB power connection is isolated from moisture during plant watering.',
      'Use lead-free solder if probe will be used with edible herb gardens.'
    ]
  },
  {
    id: 'proj-4',
    title: 'Autonomous Obstacle Detector Rover',
    tagline: 'Self-navigating obstacle-avoiding mobile robot built with ultrasonic sensor and dual DC motors',
    difficulty: 'Advanced',
    category: 'Educational / Maker',
    estimatedBuildTimeMinutes: 90,
    schematicSummary: 'Arduino -> HC-SR04 (Trig D9, Echo D10); Motor Driver / Transistors on D5,D6 -> 2x DC Motors; 4xAA Power',
    imageUrl: '/src/assets/images/solar_smart_monitor_1791201430265.jpg',
    requiredComponents: [
      { componentName: 'Arduino Uno Rev3 Compatible Microcontroller', category: 'Microcontrollers & ICs', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 28 },
      { componentName: 'HC-SR04 Ultrasonic Distance Sensor', category: 'Sensors', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 9 },
      { componentName: 'DC Toy / Geared Motor 3V-6V', category: 'Actuators & Motors', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 64 },
      { componentName: '4xAA & 9V Battery Holders with Leads', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 16 },
      { componentName: 'SPST Rocker & Tactile Push Switches', category: 'Switches & Controls', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 3.5 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 12, unit: 'pcs', approxWeightGrams: 14.4 },
      { componentName: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)', category: 'Passive Components', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 0.5 }
    ],
    description: 'An advanced educational robotics vehicle that detects physical obstacles up to 200cm away using ultrasonic pulse-echo timing. When an object is within 20cm, it brakes, reverses, and pivots to an open path. Chassis can be fabricated entirely from discarded acrylic or rigid cardboard.',
    wiringInstructions: [
      'Connect HC-SR04 VCC to 5V, GND to GND, Trig to Arduino D9, Echo to Arduino D10.',
      'Connect 4xAA Battery pack (6V) to Arduino Vin and Motor common power rail.',
      'Wire the DC motor drive pins to PWM outputs for independent speed and differential steering control.',
      'Add SPST rocker switch inline with the battery positive terminal for master power cutoff.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Fabricate Chassis from Discarded Sheet Stock',
        description: 'Cut a 12cm x 15cm base plate from old computer side panels, Plexiglas, or corrugated plastic. Affix the two geared DC motors.',
        salvageTip: 'Use bottle caps with rubber o-rings or rubber bands as high-traction salvaged wheels.'
      },
      {
        title: 'Step 2: Mount Ultrasonic Sensor Eyelet Bracket',
        description: 'Secure the HC-SR04 at the front bumper pointing forward with a 5-degree upward angle to avoid picking up floor carpet reflections.',
        salvageTip: 'Wrap sensor casing in insulating tape to avoid accidental contact with metal chassis screws.'
      },
      {
        title: 'Step 3: Calibrate Distance Algorithm',
        description: 'Calculate distance using formula: Distance (cm) = (Microseconds * 0.0343) / 2. Program steering pivot behavior.',
        salvageTip: 'Implement low-pass filtering on ultrasonic echo duration to eliminate ghost readings.'
      }
    ],
    educationalTakeaways: [
      'Acoustic time-of-flight physics and speed of sound temperature coefficients',
      'Differential drive robotics kinematics: pivot turning vs curved trajectory',
      'Electronic waste diversion impact: builds an entire robotics lab kit from scrap components'
    ],
    safetyPrecautions: [
      'Test rover on a floor area clear of stairs and steep drops.',
      'Ensure motor current stall spikes do not brown out the Arduino logic rail (use decoupling capacitor).'
    ]
  },
  {
    id: 'proj-5',
    title: 'USB Ergonomic Desk & Solder Work Light',
    tagline: 'Flicker-free adjustable task light powered directly by USB ports on laptops or industrial test consoles',
    difficulty: 'Beginner',
    category: 'Industrial Utility',
    estimatedBuildTimeMinutes: 25,
    schematicSummary: 'USB +5V -> SPST Switch -> 100Ω/220Ω Resistors -> 4x Parallel LEDs -> USB GND',
    imageUrl: '/src/assets/images/ewaste_sorting_hero_1791201380637.jpg',
    requiredComponents: [
      { componentName: 'Type-A to Micro USB Cables', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 24 },
      { componentName: '5mm High-Intensity LEDs', category: 'Passive Components', requiredQuantity: 4, unit: 'pcs', approxWeightGrams: 2 },
      { componentName: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)', category: 'Passive Components', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 0.5 },
      { componentName: 'SPST Rocker & Tactile Push Switches', category: 'Switches & Controls', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 3.5 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 2.4 }
    ],
    description: 'Transform an abandoned USB charge cable and salvaged LEDs into an efficient gooseneck desk lamp. Perfect for inspecting microscopic solder tracks, reading resistor color codes, or keyboard illumination without drawing heavy grid power.',
    wiringInstructions: [
      'Splice the USB Type-A connector cable, isolating Red (+5V) and Black (GND) wires.',
      'Solder the Red wire to one side of the SPST switch.',
      'Solder 2 parallel 220Ω resistors to drop voltage from 5.0V to ~3.2V for the white LED strip.',
      'Complete the return circuit through the LED cathodes to the USB Black GND.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Stiff Wire Gooseneck Construction',
        description: 'Twist heavy copper scrap wire together with the USB cable to create a flexible arm that holds its bend shape.',
        salvageTip: 'Enclose the twisted harness in heat-shrink tubing or spiraled electrical tape for a clean finish.'
      },
      {
        title: 'Step 2: Solder LED Array on Scrap Stripboard',
        description: 'Place 4 LEDs in a linear strip. Solder leads securely with minimal heat to avoid semiconductor degradation.',
        salvageTip: 'Check polarity with a 3V coin cell battery before final assembly.'
      },
      {
        title: 'Step 3: Clamp Mount',
        description: 'Attach the light assembly to a discarded spring clamp or heavy metal scrap bolt for solid workstation footing.',
        salvageTip: 'A cut syringe body or medicine blister pack makes an excellent reflective reflector.'
      }
    ],
    educationalTakeaways: [
      'Luminous efficacy (lumens per watt) compared to legacy tungsten bulbs',
      'Voltage drop calculations across silicon junction diodes',
      'Resource conservation: Reusing discarded consumer USB peripherals'
    ],
    safetyPrecautions: [
      'Ensure current draw does not exceed 100mA when plugged into unpowered USB hubs.'
    ]
  },
  {
    id: 'proj-6',
    title: 'Industrial Perimeter & Tilt Vibration Alarm',
    tagline: 'High-visibility intrusion and tilt safeguard using Arduino, ultrasonic/vibration sensors, and warning LEDs',
    difficulty: 'Intermediate',
    category: 'Industrial Safety',
    estimatedBuildTimeMinutes: 50,
    schematicSummary: 'Arduino Uno -> HC-SR04 / Tilt Contact -> Logic Comparator -> Pulsed LED Warning Array & Buzzer output',
    imageUrl: '/src/assets/images/solar_smart_monitor_1791201430265.jpg',
    requiredComponents: [
      { componentName: 'Arduino Uno Rev3 Compatible Microcontroller', category: 'Microcontrollers & ICs', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 28 },
      { componentName: 'HC-SR04 Ultrasonic Distance Sensor', category: 'Sensors', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 9 },
      { componentName: '5mm High-Intensity LEDs', category: 'Passive Components', requiredQuantity: 3, unit: 'pcs', approxWeightGrams: 1.5 },
      { componentName: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)', category: 'Passive Components', requiredQuantity: 3, unit: 'pcs', approxWeightGrams: 0.75 },
      { componentName: 'SPST Rocker & Tactile Push Switches', category: 'Switches & Controls', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 3.5 },
      { componentName: '4xAA & 9V Battery Holders with Leads', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 16 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 8, unit: 'pcs', approxWeightGrams: 9.6 }
    ],
    description: 'An industrial security and tilt-warning mechanism designed for equipment lockers, warehouse doorways, or hazardous test zones. Continuously pings an acoustic tripwire beam; when an unauthorized presence breaches the perimeter, it latches a high-visibility warning strobe.',
    wiringInstructions: [
      'Wire the HC-SR04 ultrasonic sensor to Arduino Digital pins 11 and 12.',
      'Connect the tactile switch to Digital Pin 2 configured with INPUT_PULLUP as an alarm silence/reset button.',
      'Connect high-intensity Red LEDs via 220Ω resistors to Digital Pins 7 and 8 for alternating strobe pattern.',
      'Power the setup from the 9V battery pack via Arduino VIN and GND pins.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Calibrate Tripwire Threshold',
        description: 'Set static reference distance (e.g., 150cm door frame width). Any sudden drop <140cm for more than 50ms triggers the latch state.',
        salvageTip: 'Add averaging filter to ignore flying insects or minor air pressure drafts.'
      },
      {
        title: 'Step 2: Emergency Disarm Switch',
        description: 'Install the tactile push switch as a hidden manual reset with a 3-second hold requirement.',
        salvageTip: 'Salvage small tactile switches from discarded computer mice or broken microwave front panels.'
      },
      {
        title: 'Step 3: Strobe Signal Mounting',
        description: 'Mount the warning LEDs behind a translucent red reflector lens salvaged from broken tail lights or hazard signs.',
        salvageTip: 'Pulsing LEDs at 10Hz creates maximum peripheral human visual alert with 50% less battery drain.'
      }
    ],
    educationalTakeaways: [
      'Digital state machine implementation (Armed, Triggered, Reset)',
      'Interrupt-driven microcontroller architecture vs continuous polling',
      'Industrial machinery interlock and safety compliance practices'
    ],
    safetyPrecautions: [
      'Do not use in mission-critical human life safety systems without secondary certified failsafes.'
    ]
  },
  {
    id: 'proj-7',
    title: 'Salvaged Mobile Phone Industrial IoT & CCTV Cam',
    tagline: 'Upcycling discarded smartphones into continuous wireless plant inspection cameras',
    difficulty: 'Beginner',
    category: 'Industrial Utility',
    estimatedBuildTimeMinutes: 20,
    schematicSummary: 'Permanent USB 5V 1A Power -> Salvaged Android Device -> IP Webcam Streaming Web Server',
    imageUrl: '/src/assets/images/ewaste_sorting_hero_1791201380637.jpg',
    requiredComponents: [
      { componentName: 'Salvaged Mobile Phone (Android Test Unit)', category: 'Discarded Devices & Sub-assemblies', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 155 },
      { componentName: 'Type-A to Micro USB Cables', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 24 }
    ],
    description: 'Decommissioned smartphones possess incredible multi-core processors, high-resolution cameras, and Wi-Fi chipsets. Rather than discarding them to toxic e-waste dumps, reflash them as dedicated RTSP/HTTP security webcams for remote machinery observation.',
    wiringInstructions: [
      'Connect the Type-A USB cable to a standard 5V 1A isolated power source.',
      'Route power cable to the phone charging port with strain relief to protect fragile solder joints.'
    ],
    assemblySteps: [
      {
        title: 'Step 1: Device Factory Reset & Debloat',
        description: 'Wipe all corporate/personal accounts. Disable animations, Bluetooth, and cellular radios to minimize heat output.',
        salvageTip: 'Install open-source IP webcam APK or lightweight local browser dashboard server.'
      },
      {
        title: 'Step 2: Thermal Management Setup',
        description: 'Remove phone back cover or mount against a small aluminum heatsink plate to ensure 24/7 continuous cool operation.',
        salvageTip: 'If internal lithium pouch cell is swollen, safely remove it and power phone directly via battery connector pins with 4.0V DC buck converter.'
      },
      {
        title: 'Step 3: Magnetic Workstation Mount',
        description: 'Epoxy discarded speaker magnets to the back of the phone case for instant attachment to industrial steel machinery frames.',
        salvageTip: 'Wrap magnets in masking tape to prevent scratching powder-coated machine enclosures.'
      }
    ],
    educationalTakeaways: [
      'Circular economy principles: Extending functional life of complex micro-electronics',
      'Embedded Linux/Android architecture and IP network camera protocols',
      'Lithium-ion battery degradation prevention and safe workshop storage'
    ],
    safetyPrecautions: [
      'Inspect battery for any physical swelling; discard swollen lithium cells in certified chemical disposal immediately.'
    ]
  }
];

export const INITIAL_QUOTA_CONFIG: MonthlyQuotaConfig = {
  monthlyQuotaKg: 50.0, // Max safe disposal limit per month
  warningThresholdPercent: 65, // 32.5 kg -> Amber Warning
  dangerThresholdPercent: 85,  // 42.5 kg -> Red Danger
  currentMonthName: 'October 2026',
  disposalLogs: [
    {
      id: 'disp-1',
      date: '2026-10-01',
      weightKg: 8.4,
      facilityDepartment: 'Assembly Line 1 Maintenance',
      wasteType: 'Non-reusable Scrap',
      disposalContractor: 'EcoRecycle Certified Ltd',
      notes: 'Crushed PCB boards with unrecoverable copper trace delamination.'
    },
    {
      id: 'disp-2',
      date: '2026-10-03',
      weightKg: 12.2,
      facilityDepartment: 'Power Transformer Bay',
      wasteType: 'Heavy Metal Slag',
      disposalContractor: 'HazardShield E-Waste Logistics',
      notes: 'Burnt transformer potting resin and non-recyclable ferrite fragments.'
    },
    {
      id: 'disp-3',
      date: '2026-10-04',
      weightKg: 6.5,
      facilityDepartment: 'Quality Inspection Scrap',
      wasteType: 'Shattered Glass/Casings',
      disposalContractor: 'CleanStream Municipal',
      notes: 'Shattered instrument front panels and cracked CRT monitor casing shards.'
    }
  ]
};
