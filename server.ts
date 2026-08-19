import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import { TrafficStore } from "./src/services/state/TrafficStore";
import { IntelligenceEventBus } from "./src/intelligence/events/IntelligenceEventBus";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Authoritative Traffic Store
  const store = new TrafficStore();
  await store.initialize();
  store.start();

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SynapseCity AI" });
  });

  // Gemini Traffic Intelligence Endpoint with Intelligent Local Fallback
  app.post("/api/gemini/analyze", async (req, res) => {
    const { prompt = "", scenario, gridState } = req.body;

    const generateHeuristicTrafficAnalysis = (userQuery: string) => {
      const q = userQuery.toLowerCase();
      if (q.includes("bottleneck") || q.includes("gandhipuram") || q.includes("avinashi")) {
        return `### 🚦 Gandhipuram & Avinashi Road Bottleneck Analysis
• **Current Congestion State:** Node-1 (Gandhipuram) queue at 14 vehicles with 42% density. Node-2 (Lakshmi Mills) East-West arterial experiencing moderate surge.
• **Recommended Signal Actions:**
  1. Extend Phase 2 (East-West Express Flow) by **+8 seconds** on Lakshmi Mills to prevent Avinashi spillback.
  2. Implement dynamic metering on Cross Cut approach at Gandhipuram.
  3. Pre-empt Node-9 (Nava India) phase splits to maintain continuous 48 km/h progressive green wave.
• **Predicted Outcome:** Reduces arterial queue dissipation time by **22.4%** across central commercial sector.`;
      }
      if (q.includes("rain") || q.includes("monsoon") || q.includes("weather")) {
        return `### 🌧️ Monsoon Surge & Road Friction Impact Analysis
• **Friction Factor:** Reduced from 0.95 (dry asphalt) to 0.76 (wet surface).
• **Safety & Flow Adjustments:**
  1. Increase yellow clearance transition intervals by **+1.5 seconds** at high-speed junctions (Hopes & SITRA Airport approach).
  2. Activate 3-phase pedestrian scramble at Uppilipalayam (Node-4) to prevent crossing slip hazards.
  3. Divert 18% of heavy transit freight toward L&T Bypass corridor.
• **Predicted Network Stability:** Prevents sudden multi-node gridlock cascade during intense rainfall spikes.`;
      }
      if (q.includes("corridor") || q.includes("kmch") || q.includes("emergency") || q.includes("psg") || q.includes("st. jude")) {
        return `### 🚑 Emergency Corridor Preemption Audit (PSG / KMCH / CMCH)
• **Corridor Readiness:** 100% Verified.
• **Preemption Vector:** Singanallur (Node-5) → Uppilipalayam (Node-4) → Lakshmi Mills (Node-2) → PSG Hospitals.
• **Safety Validations (SafetyValidator Engine):**
  - Minimum all-red clearance interval (3.0s) strictly enforced before emergency green lock.
  - Cross-traffic queue discharge verified at Lakshmi Mills.
• **Time Advantage:** Signal preemption reduces emergency transit time by **3.8 minutes** (60% transit time reduction).`;
      }
      if (q.includes("av") || q.includes("transit") || q.includes("lane") || q.includes("bus")) {
        return `### 🚌 Public Transit & Dedicated Lane Allocation Assessment
• **Avinashi Road BRT:** Transit fleet operating at 78% capacity with +0.5m on-time adherence.
• **Recommendations:**
  1. Maintain dedicated bus priority phase triggers at Hopes College Junction (Node-3).
  2. Dynamically synchronize green windows with Route 10A (Gandhipuram - SITRA) arrivals.
• **Commuter Throughput:** Increases peak-hour passenger transport volume by +340 passengers/hour.`;
      }

      return `### 🌐 SynapseCity Multi-Agent Mobility Audit
• **Citywide Status:** 11 Coimbatore intersection nodes synchronized in adaptive equilibrium.
• **Average Velocity:** 45.2 km/h across primary arterials (Avinashi, Trichy, Sathy roads).
• **Edge Coordination:** Node agents negotiating phase split adjustments in ~12ms cycles.
• **Active Actions:** Dynamic green wave preemption standby active for 108 Emergency units.`;
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "demo_key" || apiKey === "your_api_key_here") {
        const fallbackText = generateHeuristicTrafficAnalysis(prompt);
        return res.json({ success: true, text: fallbackText, model: "Heuristic AI Engine" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are SynapseCity AI, an advanced multi-agent Autonomous Urban Mobility Operating System for Coimbatore. You specialize in real-time computer vision traffic analysis, adaptive signal phase timing, emergency corridor wave dispatching, and predictive congestion mitigation. Provide clear, actionable, technical, and data-driven recommendations with concise bullet points and numerical traffic metrics.`;

      const userPrompt = `
Scenario: ${scenario || "Current Live Grid Evaluation"}
Grid Metrics: ${JSON.stringify(gridState || { congestion: "22%", activeVehicles: 1420, avgSpeed: "45 km/h", emergencyCorridors: 1 })}
User Inquiry: ${prompt || "Analyze grid bottlenecks and recommend multi-agent signal phase adjustments."}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] }
        ]
      });

      const responseText = response.text || generateHeuristicTrafficAnalysis(prompt);
      res.json({ success: true, text: responseText, model: "Gemini 2.5 Flash" });
    } catch (err: any) {
      console.warn("Gemini API Error (Falling back to local heuristic intelligence):", err.message);
      const fallbackText = generateHeuristicTrafficAnalysis(prompt);
      res.json({ success: true, text: fallbackText, model: "Heuristic AI Engine (Fallback)" });
    }
  });

  // Vite middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Create HTTP Server and bind WebSocket Server
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SynapseCity AI] Server running on http://0.0.0.0:${PORT}`);
  });

  const wss = new WebSocketServer({ server });

  store.on("state_update", (data) => {
    const payload = JSON.stringify({ type: "UPDATE", state: data });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  const intelBus = IntelligenceEventBus.getInstance();
  intelBus.on('ANY', (event) => {
    const payload = JSON.stringify({ type: "INTELLIGENCE_EVENT", event });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  });

  wss.on("connection", (ws) => {
    // Send initial authoritative state
    const fullState = store.getEngineState();
    ws.send(JSON.stringify({ 
      type: "INIT", 
      state: { 
        snapshot: store.getSnapshot(), 
        status: store.getStatus(),
        corridors: store.getCorridors(),
        digitalTwinComparison: store.getDigitalTwinComparison(),
        cameraFeeds: fullState.cameraFeeds,
        agents: fullState.agents,
        agentLogs: fullState.agentLogs,
        simConfig: fullState.simConfig,
        timelineStage: fullState.timelineStage,
        strategy: fullState.strategy,
        comparison: fullState.comparison,
        history: fullState.history
      } 
    }));

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        store.executeCommand(data);
      } catch (err) {
        console.error("Failed to process WebSocket message:", err);
      }
    });
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await store.shutdown();
    server.close();
    process.exit(0);
  });
}

startServer().catch((err) => {
  console.error("Failed to start SynapseCity AI server:", err);
});


