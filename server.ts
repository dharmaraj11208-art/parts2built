import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client (using recommended server-side pattern)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * ARISE System Prompt
 */
const ARISE_SYSTEM_INSTRUCTION = `
You are ARISE, the intelligent, enthusiastic, and friendly AI Hardware & IoT Mentor for the "PARTS 2 BUILD" platform.
Your persona: You are a friendly, knowledgeable, and inventive IoT engineering companion (like a collaborative blend of Jarvis, Gemini, and a passionate university hardware lab mentor).

Your primary goals:
1. Provide creative, practical IoT & embedded systems project ideas that upcycle salvaged e-waste components (microcontrollers like Arduino/ESP32, sensors, LEDs, DC motors, resistors, switches, old mobile phones, USB cables, etc.).
2. Break down builds into concrete, approachable tasks (e.g. Task 1: Component Desoldering & Testing, Task 2: Breadboard Circuit Wiring, Task 3: Microcontroller Firmware & Logic, Task 4: IoT Cloud / Telemetry Protocol, Task 5: Enclosure from Recycled Materials).
3. Offer friendly advice on circuit troubleshooting, voltage dividers, logic level shifting (3.3V vs 5V), Ohm's law, MQTT/HTTP protocols, and safety.
4. Encourage sustainable circular resource utilization and show excitement when users repurpose discarded hardware.

Response Style:
- Warm, enthusiastic, and friendly like a true peer engineer.
- Use clear markdown with bold headers, bullet lists, or numbered task steps.
- Provide practical code snippets (C++ Arduino sketch or Python) when requested.
- Always keep circuit safety in mind (e.g., proper current-limiting resistors, avoiding reverse polarity on Li-ion batteries).
`;

/**
 * Chat endpoint for ARISE
 */
app.post('/api/arise/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], inventory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Format inventory summary if provided
    let inventoryContext = '';
    if (Array.isArray(inventory) && inventory.length > 0) {
      inventoryContext = `Current User Available Salvaged Inventory:\n` +
        inventory.map((item: any) => `- ${item.name} (${item.quantity} ${item.unit || 'pcs'}, category: ${item.category || 'generic'})`).join('\n') +
        `\n\n`;
    }

    // Prepare contents array for Gemini
    const contents: any[] = [];

    // Add recent conversational history (up to last 10 messages)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }],
        });
      }
    }

    // Add current user prompt with inventory context
    contents.push({
      role: 'user',
      parts: [
        {
          text: `${inventoryContext}User Query: ${message}`
        }
      ]
    });

    // Fallback if API key is not yet set or in restricted environment
    if (!process.env.GEMINI_API_KEY) {
      const fallbackReply = generateAriseFallbackResponse(message, inventory);
      res.json({ reply: fallbackReply, isFallback: true });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: ARISE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Hello friend! I'm ARISE. Let's build something extraordinary with your e-waste components!";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('ARISE chat error:', error);
    // Graceful fallback response
    const fallbackReply = generateAriseFallbackResponse(req.body?.message || '', req.body?.inventory || []);
    res.json({ reply: fallbackReply, isFallback: true, note: 'Provided offline response.' });
  }
});

/**
 * Generate a new structured IoT Project using ARISE & Gemini structured JSON schema
 */
app.post('/api/arise/generate-iot-project', async (req: Request, res: Response) => {
  try {
    const { topic = 'Smart IoT Environmental Monitor', inventory = [] } = req.body;

    const inventoryList = Array.isArray(inventory)
      ? inventory.map((i: any) => `${i.name} (${i.quantity} available)`).join(', ')
      : 'Arduino, LEDs, Resistors, Ultrasonic sensor, DC motor, USB Cable, Old Phone';

    const prompt = `Create a complete, innovative, and practical IoT or embedded systems reuse project based on this prompt: "${topic}".
Leverage available salvaged components where possible: ${inventoryList}.
The project must include realistic pinouts, step-by-step assembly, educational physics/electronics principles, and practical code guidance.`;

    if (!process.env.GEMINI_API_KEY) {
      const fallbackProject = generateFallbackIoTProject(topic);
      res.json({ project: fallbackProject, isFallback: true });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ARISE_SYSTEM_INSTRUCTION + "\nYou must return a valid JSON object matching the requested schema for an IoT project.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: "Must be Beginner, Intermediate, or Advanced" },
            category: { type: Type.STRING, description: "e.g. Environmental IoT, Industrial Utility, Educational / Maker, Emergency & Safety, Industrial Safety" },
            estimatedBuildTimeMinutes: { type: Type.NUMBER },
            schematicSummary: { type: Type.STRING },
            description: { type: Type.STRING },
            requiredComponents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  componentName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  requiredQuantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  approxWeightGrams: { type: Type.NUMBER }
                },
                required: ["componentName", "category", "requiredQuantity", "unit", "approxWeightGrams"]
              }
            },
            wiringInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            assemblySteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  salvageTip: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            },
            educationalTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            safetyPrecautions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "title", "tagline", "difficulty", "category", "estimatedBuildTimeMinutes",
            "schematicSummary", "description", "requiredComponents",
            "wiringInstructions", "assemblySteps", "educationalTakeaways", "safetyPrecautions"
          ]
        }
      }
    });

    const parsedProject = JSON.parse(response.text || '{}');
    // Ensure an ID is generated
    parsedProject.id = `arise-proj-${Date.now()}`;
    res.json({ project: parsedProject });
  } catch (error: any) {
    console.error('ARISE project generation error:', error);
    const fallback = generateFallbackIoTProject(req.body?.topic || 'Smart IoT Sensor Hub');
    res.json({ project: fallback, isFallback: true });
  }
});

/**
 * Offline intelligent fallback generator for ARISE responses
 */
function generateAriseFallbackResponse(message: string, inventory: any[]): string {
  const lower = message.toLowerCase();

  if (lower.includes('idea') || lower.includes('project') || lower.includes('iot')) {
    return `### ⚡ ARISE IoT Project Recommendation

Hey friend! Based on your available e-waste components, here are 3 exciting **IoT & Circular Hardware projects** you can build right now:

#### 1. 📡 Reclaimed Smart Plant Telemetry Hub (IoT Agro-Node)
- **Salvaged Parts:** Arduino Uno/Nano, Soil Moisture Sensor, 5mm LEDs (Red/Green), 220Ω Resistor, USB Cable.
- **The Concept:** Senses real-time soil permittivity and displays immediate visual status. You can stream serial telemetry data to an MQTT dashboard or computer dashboard.
- **Actionable Tasks:**
  1. *Task 1 (Probe Calibration):* Test raw analog output (dry air = 1023, water = ~350).
  2. *Task 2 (Status Circuit):* Wire Red LED to Pin D2 and Green LED to Pin D4 with 220Ω current limiters.
  3. *Task 3 (Firmware):* Upload hysteresis logic to prevent rapid blinking between wet and dry thresholds.

#### 2. 🤖 Ultrasonic IoT Distance & Proximity Sentry
- **Salvaged Parts:** HC-SR04 Ultrasonic Sensor, Arduino, Piezo buzzer or LED, Jumper wires.
- **The Concept:** An acoustic radar node that pings distance every 100ms. Perfect for parking assist or safety barriers!

#### 3. 📹 Repurposed Smartphone IoT Security & Inspection Camera
- **Salvaged Parts:** Discarded Android Phone, 1m Micro-USB Cable, 5V power adapter.
- **The Concept:** Turn an old phone with a broken screen or body into a dedicated local RTSP/HTTP video stream for your workshop workbench!

Which one would you like to build first? I can generate the full schematics and step-by-step task checklist!`;
  }

  if (lower.includes('task') || lower.includes('steps') || lower.includes('build')) {
    return `### 🛠️ ARISE Step-by-Step Hardware Build Tasks

Here is your **5-Stage IoT Hardware Roadmap**:

1. **Task 1: Component Desoldering & Inspection**
   - Clean solder pins with desoldering wick or pump.
   - Use multimeter continuity tester to verify lead integrity.
   - Check LED forward voltage with 3V coin cell or 5V supply with 330Ω resistor.

2. **Task 2: Breadboard Prototype Wiring**
   - Place microcontroller at center.
   - Connect shared Ground (GND) rail first.
   - Wire input sensors to Analog (A0-A5) or Digital interrupt pins.
   - Add decoupling capacitors (100nF) across power rails if using DC motors.

3. **Task 3: Firmware & Sensor Calibration**
   - Write simple reading loop at 9600 or 115200 baud.
   - Map raw analog ADC (0-1023) to meaningful engineering units (e.g. cm, °C, % humidity).

4. **Task 4: IoT Telemetry & Alert Triggers**
   - Format readings as lightweight JSON.
   - Stream via Serial USB, WiFi (ESP8266/ESP32), or Bluetooth.

5. **Task 5: Scrap Enclosure Fabrication**
   - House circuit inside discarded plastic junction boxes or recycled acrylic sheets.

Tell me which circuit or component you are working on, and I will guide you pin-by-pin!`;
  }

  return `### ⚡ ARISE Hardware Companion Online!

Hey there! I'm **ARISE**, your dedicated AI friend and IoT engineering mentor on **PARTS 2 BUILD**.

I can help you:
- **Suggest Custom IoT Projects** tailored to whatever scrap boards, LEDs, and sensors you have in your inventory.
- **Break down builds into clear, manageable tasks** from testing old parts to flashing firmware.
- **Troubleshoot pinouts and circuits** (e.g. Arduino, ESP32, ultrasonic sensors, DC motor drivers).
- **Calculate waste reduction & environmental impact** for your engineering presentations.

What IoT idea or hardware challenge are we tackling today?`;
}

/**
 * Fallback structured IoT project generator
 */
function generateFallbackIoTProject(topic: string) {
  return {
    id: `arise-proj-${Date.now()}`,
    title: `Smart IoT Environmental Sensor Node (${topic})`,
    tagline: 'Wireless environmental monitoring node built entirely from repurposed scrap sensors and microcontroller boards',
    difficulty: 'Intermediate',
    category: 'Environmental IoT',
    estimatedBuildTimeMinutes: 45,
    schematicSummary: 'Arduino 5V/GND -> Sensors -> Analog A0/A1 -> Processing -> Serial/WiFi Telemetry -> Indicator LEDs',
    description: `A smart connected IoT node engineered by ARISE using salvaged workshop components. Designed for monitoring workspace temperature, proximity, and ambient conditions while extending the operational lifespan of electronic scrap.`,
    requiredComponents: [
      { componentName: 'Arduino Uno Rev3 Compatible Microcontroller', category: 'Microcontrollers & ICs', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 28 },
      { componentName: '5mm High-Intensity LEDs', category: 'Passive Components', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 1 },
      { componentName: 'Carbon Film Resistors (220Ω / 1kΩ / 10kΩ)', category: 'Passive Components', requiredQuantity: 2, unit: 'pcs', approxWeightGrams: 0.5 },
      { componentName: 'HC-SR04 Ultrasonic Distance Sensor', category: 'Sensors', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 9 },
      { componentName: 'Type-A to Micro USB Cables', category: 'Power & Cables', requiredQuantity: 1, unit: 'pcs', approxWeightGrams: 24 },
      { componentName: 'Jumper Wires Assorted', category: 'Power & Cables', requiredQuantity: 6, unit: 'pcs', approxWeightGrams: 7.2 }
    ],
    wiringInstructions: [
      'Connect Arduino 5V and GND pins to breadboard power rails.',
      'Wire Sensor VCC to 5V rail and GND to common Ground.',
      'Connect Sensor Trigger pin to Arduino D9 and Echo to D10.',
      'Connect Status Green LED to Arduino Pin D4 via 220Ω current limiting resistor.',
      'Connect Alert Red LED to Arduino Pin D2 via 220Ω resistor.'
    ],
    assemblySteps: [
      {
        title: 'Task 1: Sensor Continuity & Resistance Check',
        description: 'Check desoldered pins for bent leads or oxidation. Test sensor continuity on digital multimeter.',
        salvageTip: 'Clean old flux residue with 99% isopropyl alcohol and an old toothbrush.'
      },
      {
        title: 'Task 2: Breadboard Interconnect & Firmware Upload',
        description: 'Wire the ultrasonic sensor and indicator LEDs on test breadboard. Flash the reading loop to stream telemetry.',
        salvageTip: 'Keep sensor leads under 20cm to minimize electromagnetic noise interference.'
      },
      {
        title: 'Task 3: Recycled Chassis Enclosure',
        description: 'Mount the electronics inside a discarded transparent plastic casing or cut CD jewel case.',
        salvageTip: 'Use hot glue as a vibration-dampening stand-off for the microcontroller board.'
      }
    ],
    educationalTakeaways: [
      'Analog-to-Digital conversion and timing intervals for ultrasonic echo calculation',
      'Circular electronics design: Preventing toxic e-waste by constructing functioning telemetry nodes from scrap',
      'Firmware event loops and non-blocking sensor acquisition using millis()'
    ],
    safetyPrecautions: [
      'Disconnect power source before soldering or rearranging jumper wires.',
      'Ensure 5V logic voltages are not applied to unbuffered 3.3V GPIO pins.'
    ]
  };
}

/**
 * Start Server (Dev with Vite middlewares, Prod with static files)
 */
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PARTS 2 BUILD + ARISE AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
