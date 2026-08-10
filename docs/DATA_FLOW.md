# SynapseCity AI Data Flow Diagram

This document illustrates the pipeline of city traffic telemetry and decision-making logic inside the SynapseCity AI metropolitan operating system.

```mermaid
flowchart TD
    subgraph Data Sources
        DS1[IoT Sensors & Loops]
        DS2[Edge AI Cameras]
        DS3[Citizen Reports Portal]
        DS4[V2X Emergency Sirens & GPS]
    end

    subgraph Ingestion Layer
        IL1[Telemetry Ingestion Services]
        IL2[WebSockets / MQTT Broker]
    end

    subgraph State & Management
        SM1[Junction Intersection Nodes]
        SM2[Incident Registries]
        SM3[Emergency Corridor Green Wave status]
    end

    subgraph Forecasting & Intelligence
        FI1[Spatial-Temporal LSTM Prediction Engines]
        FI2[Distributed Multi-Agent Reinforcement Learning]
    end

    subgraph Decision Engine
        DE1[Signal Phase Optimization]
        DE2[V2X Preemption Lock Wave]
        DE3[Generative AI Assistant Operator Copilot]
    end

    subgraph Interfaces & Analytics
        IA1[Operator Command Center Map]
        IA2[Historical Analytics & Carbon Metrics]
    end

    %% Data Pipeline Connections
    DS1 & DS2 & DS3 & DS4 --> Ingestion
    subgraph Ingestion [Ingestion Layer]
        IL1 & IL2
    end
    
    Ingestion --> State
    subgraph State [Traffic State]
        SM1 & SM2 & SM3
    end

    State --> Forecasts
    subgraph Forecasts [Prediction Layer]
        FI1
    end

    Forecasts --> Agents
    subgraph Agents [Multi-Agent AI]
        FI2
    end

    Agents --> Decision
    subgraph Decision [Decision Engine]
        DE1 & DE2 & DE3
    end

    Decision --> Output
    subgraph Output [Signals / Routes Control]
        O1[Intersection Traffic Signals]
        O2[Transit Priority Lanes]
    end

    Output & State --> Dashboards
    subgraph Dashboards [Dashboard & Analytics]
        IA1 & IA2
    end
```

---

## Data Pipeline Details

1.  **Data Sources**: Detections occur at the edge (edge cameras classifying traffic classes; GPS transmitters signaling ambulance paths; citizens submitting pothole locations).
2.  **Ingestion Layer**: Ingests traffic indicators via lightweight message brokers (MQTT/WebSockets).
3.  **Traffic State**: Reconstructs the grid (represented as connected nodes in the city map, incidents list, and camera speed violations status).
4.  **Prediction**: Evaluates risk profiles (LSTM networks forecasting queue buildups 15m, 30m, and 60m into the future).
5.  **Multi-Agent AI**: Intersection nodes function as collaborative agents. Nearby nodes exchange density metrics to negotiate phase timings before bottlenecking occurs.
6.  **Decision Engine**: Outputs green/yellow/red durations, triggers emergency green lock overrides, or interacts with operators via the Gemini AI Copilot interface.
7.  **Signals & Output**: Dispatches command calls directly to physical road junction signals and AV lanes.
8.  **Dashboard & Analytics**: Updates UI maps, performance grades (LOS), carbon savings, and logs in real-time.
