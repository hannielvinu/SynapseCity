# Vellore Feasibility Assessment
## SynapseCity AI — Smart Traffic Management for Vellore, Tamil Nadu

---

## 1. Executive Summary

SynapseCity AI's current codebase is built entirely around a **fictional Western city model** with no connection to Vellore, Tamil Nadu, or Indian traffic conditions. This document assesses the feasibility of adapting the system for a real Vellore deployment and identifies every change required.

**Feasibility Score: 12/100 (Current) → 75/100 (Achievable with Phase 1-3 changes)**

---

## 2. Vellore Traffic Context

### 2.1 City Profile

| Aspect | Data |
|:---|:---|
| Population | ~550,000 (metro area ~1M) |
| Area | 87.92 km² |
| Major Roads | NH48 (Chennai-Bangalore), VIT Road, Katpadi Main Road, Officers Line, CMC Hospital Road |
| Intersections | ~40-60 signalized, ~200+ unsignalized |
| Public Transit | TNSTC buses, auto-rickshaws, limited share autos |
| Institutions | VIT University (30K+ students), CMC Hospital (major), Vellore Fort area |
| Peak Hours | 8:00-10:00 AM, 4:30-7:00 PM |
| Climate | Tropical, heavy monsoon (Oct-Dec), hot summers (35-42°C) |

### 2.2 Key Intersections for Pilot

| # | Intersection | Type | Traffic Characteristics | Priority |
|:---|:---|:---|:---|:---|
| V-01 | Katpadi Junction | Major 4-way | Bus terminal, rail station, heavy mixed traffic | HIGH |
| V-02 | Sathuvachari Circle | Roundabout | Commercial area, auto-rickshaw heavy | HIGH |
| V-03 | VIT Main Gate Junction | 3-way | Student pedestrians, scooter surge at peak | HIGH |
| V-04 | CMC Hospital Gate | 4-way | Ambulance priority needed, pedestrian heavy | HIGH |
| V-05 | Long Bazaar / Scudder Road | Narrow 4-way | Market area, parked vehicles, very dense | MEDIUM |
| V-06 | Officers Line Junction | 4-way | Government offices, moderate traffic | MEDIUM |
| V-07 | Thorapadi Junction | 3-way | Residential exit, morning rush | MEDIUM |
| V-08 | Gandhi Road / Balujas Junction | 4-way | Shopping district, pedestrian jaywalking | MEDIUM |

---

## 3. Gap Analysis: Current System vs Vellore Needs

### 3.1 Unit System

| Current | Required | Files to Change |
|:---|:---|:---|
| mph (miles per hour) | km/h (kilometers per hour) | `types.ts` (field names), `mockData.ts`, `trafficEngine.ts`, `simulationEngine.ts`, `routingEngine.ts`, all UI components displaying speed |
| miles | km | `routingEngine.ts:104` (`baseSpeedMps = 15`), distance calculations |
| "Tons CO2" (imperial) | Tonnes CO2 (metric) or kg CO2 | `types.ts`, `mockData.ts`, analytics page |

### 3.2 Vehicle Types

| Vehicle | % of Vellore Traffic | In System? | Action Required |
|:---|:---|:---|:---|
| Motorcycle / Scooter | **45-55%** | ❌ NO | **CRITICAL ADD** — Largest vehicle class in Indian traffic |
| Auto-Rickshaw (3-wheeler) | **10-15%** | ❌ NO | **CRITICAL ADD** — Unique lane behavior, stopping patterns |
| Car | 15-20% | ✅ YES | Keep, adjust proportions |
| Bus (TNSTC) | 5-8% | ✅ YES | Keep, add Tamil Nadu bus behavior |
| Truck / Lorry | 5-8% | ✅ YES | Keep, add goods vehicle restrictions |
| Bicycle / Cycle | 2-4% | ❌ (detection only) | Add as simulation vehicle |
| Pedestrian | Heavy | ⚠️ (counter only) | Add as first-class simulation entity |
| Bullock Cart / Animal | <1% | ❌ NO | Consider for rural approach roads |

### 3.3 Traffic Behavior Differences

| Behavior | Western Model (Current) | Vellore Reality | Gap |
|:---|:---|:---|:---|
| **Lane discipline** | Strict lane following | Lane splitting, two-wheelers filter | ❌ Major rewrite of vehicle movement |
| **Signal compliance** | Near 100% | ~60-70%, red-light violations common | ❌ Must model violation behavior |
| **Pedestrian behavior** | Crosswalk-only | Jaywalking frequent, informal crossings | ❌ Must model pedestrian flow |
| **Auto-rickshaw stops** | N/A | Stop anywhere, passengers board/alight | ❌ New vehicle behavior class |
| **Bus stops** | Dedicated stops | Often stop in traffic lane | ❌ Must model blocking behavior |
| **Parking** | Off-road parking | Roadside parking reducing effective lanes | ❌ Must reduce effective road capacity |
| **Peak hour intensity** | Moderate spread | Sharp spikes (VIT bell, hospital shift) | ⚠️ Surge model exists but needs calibration |
| **Wrong-way driving** | Not modeled | Occurs on divided roads | ⚠️ Consider for safety scoring |

### 3.4 Infrastructure Differences

| Infrastructure | Western Model | Vellore Reality | Impact |
|:---|:---|:---|:---|
| **Signal controllers** | NEMA TS2, ATC 2070 | Indian standard (IRC SP-41), basic controllers | Must target Indian signal hardware |
| **Signal phases** | 4-phase standard | Often 2-3 phase only | Simplify phase model |
| **Road width** | Wide multi-lane | Often narrow, single-lane sections | Must affect density calculations |
| **Road surface** | Uniform asphalt | Mixed (asphalt, gravel, broken sections) | Affects speed and weather impact |
| **Drainage** | Storm drains | Poor drainage = flooding in monsoon | Must enhance weather model |
| **Power supply** | Reliable | Intermittent outages possible | Must handle signal dark mode |
| **Internet connectivity** | Fiber/5G | 4G variable, rural areas weak | Must handle offline/degraded mode |
| **CCTV cameras** | Ubiquitous | Limited, mostly at major junctions | Pilot must consider camera placement |

---

## 4. Data Model Changes

### 4.1 IntersectionNode Modifications

```diff
interface IntersectionNode {
  id: string;
  name: string;
  district: string;
- x: number; // percentage position
- y: number; // percentage position
+ latitude: number;
+ longitude: number;
  signalState: SignalState;
  signalMode: SignalMode;
  queueLength: number;
  vehicleCount: number;
- avgSpeedMph: number;
+ avgSpeedKmh: number;
  densityScore: number;
  currentPhase: string;
  phaseTimeRemaining: number;
  aiConfidence: number;
  connectedNodes: string[];
+ roadWidth: 'narrow' | 'medium' | 'wide';
+ hasCamera: boolean;
+ hasPedestrianSignal: boolean;
+ intersectionType: '3-way' | '4-way' | 'roundabout' | 'T-junction';
  // ... existing fields
}
```

### 4.2 Vehicle Type Expansion

```diff
- type VehicleType = 'car' | 'truck' | 'bus';
+ type VehicleType = 
+   | 'car' 
+   | 'truck' 
+   | 'bus' 
+   | 'motorcycle'
+   | 'scooter'
+   | 'auto_rickshaw'
+   | 'bicycle'
+   | 'pedestrian';

+ interface VehicleBehavior {
+   canLaneSplit: boolean;      // motorcycles can filter between cars
+   stopsAnywhere: boolean;     // auto-rickshaws stop to pick up
+   effectiveWidth: number;     // 0.5 for motorcycles, 1.0 for cars, 1.5 for buses
+   signalComplianceRate: number; // 0.6-1.0 probability of stopping at red
+   maxSpeedKmh: number;
+ }
```

### 4.3 Vellore Intersection Data (Sample)

```typescript
const VELLORE_INTERSECTIONS: IntersectionNode[] = [
  {
    id: 'vel-01',
    name: 'Katpadi Junction',
    district: 'Katpadi',
    latitude: 12.9795,
    longitude: 79.1453,
    signalState: 'green',
    signalMode: 'fixed_timer',
    roadWidth: 'wide',
    intersectionType: '4-way',
    hasCamera: true,
    hasPedestrianSignal: false,
    connectedNodes: ['vel-02', 'vel-05'],
    // ... traffic metrics
  },
  {
    id: 'vel-02',
    name: 'Sathuvachari Circle',
    district: 'Sathuvachari',
    latitude: 12.9567,
    longitude: 79.1534,
    signalState: 'green',
    signalMode: 'fixed_timer',
    roadWidth: 'medium',
    intersectionType: 'roundabout',
    hasCamera: false,
    hasPedestrianSignal: false,
    connectedNodes: ['vel-01', 'vel-03', 'vel-06'],
  },
  // ... more Vellore intersections
];
```

---

## 5. Map Integration Requirements

### 5.1 Map Provider Selection

| Option | Pros | Cons | Recommendation |
|:---|:---|:---|:---|
| **MapLibre GL JS** | Free, open-source, vector tiles, performant | Requires tile server or third-party tiles | ✅ **RECOMMENDED** |
| **Leaflet** | Simple, lightweight, raster tiles | Less performant for real-time updates | Acceptable fallback |
| **Google Maps** | Most accurate India data | API cost, vendor lock-in | Not recommended |
| **Mapbox** | Excellent DX, GL-based | Pricing above free tier | Not recommended |

### 5.2 OpenStreetMap Data for Vellore

Vellore is **reasonably well-mapped** in OSM. Key roads, hospitals, VIT campus, and major intersections are present. For SUMO integration:

1. Export area from OSM (bbox: 12.88,79.08,13.00,79.20)
2. Convert with `netconvert --osm-files vellore.osm -o vellore.net.xml`
3. Use `.net.xml` for SUMO simulation
4. Use OSM tile layer for MapLibre visualization

---

## 6. Emergency Services Mapping

### 6.1 Vellore Hospitals & Fire Stations

| Facility | Type | Location | Priority for Green Corridor |
|:---|:---|:---|:---|
| CMC Hospital (Main Campus) | Major Hospital | Ida Scudder Road | **HIGHEST** |
| CMC Hospital (Chittoor Campus) | Hospital Extension | Chittoor Road | HIGH |
| Government Vellore Medical College | Government Hospital | Adukkamparai | HIGH |
| Vellore Fire Station | Fire | Near Fort area | HIGH |
| Katpadi Fire Sub-station | Fire | Katpadi | MEDIUM |

### 6.2 Emergency Corridor Routes

For Vellore, priority green corridors should be pre-computed between:
- All fire stations → all major intersections
- CMC Hospital ↔ Katpadi Junction (ambulance route via NH48)
- Government Hospital → Sathuvachari (residential emergency access)

---

## 7. Weather Model Calibration for Vellore

### 7.1 Climate Impact Factors

| Weather | Frequency | Current Impact | Required Calibration |
|:---|:---|:---|:---|
| **Clear / Hot (35-42°C)** | Mar-Jun | No impact | Reduce pedestrian signal requests (people avoid walking) |
| **Monsoon Heavy Rain** | Oct-Dec | Speed × 0.75 | Speed × 0.50-0.60, flooding at known points, visibility reduction |
| **Light Rain** | Jul-Sep, Jan | Not modeled | Speed × 0.80 |
| **Dense Fog** | Dec-Feb mornings | Speed × 0.60 | Speed × 0.40 (severe in early morning) |
| **Flooding** | Oct-Dec after heavy rain | Not modeled | Road segments fully blocked, alternate routing required |

### 7.2 Monsoon-Specific Requirements

- **Waterlogging zones**: Certain Vellore roads flood during heavy rain. System must know which road segments become impassable.
- **Visibility reduction**: Fog + rain reduces CCTV effectiveness. System should degrade gracefully when CV confidence drops.
- **Two-wheeler vulnerability**: Motorcycles/scooters are most affected by rain. Speed reduction should be higher for 2-wheelers.

---

## 8. Localization Requirements

### 8.1 Language

- Primary UI: English (for competition/demo)
- Future: Tamil language support for citizen reports portal
- Road names: English transliteration of Tamil names

### 8.2 Units

| Measurement | Current | Required |
|:---|:---|:---|
| Speed | mph | km/h |
| Distance | miles | km |
| CO2 | Tons | Tonnes (or kg for daily) |
| Temperature | Not shown | °C |
| Time | 12h/24h US | 24h IST (UTC+5:30) |

### 8.3 Currency (Future)

If the system ever handles toll or parking: INR (₹), not USD.

---

## 9. Regulatory Compliance (Indian Context)

| Standard | Description | Impact on System |
|:---|:---|:---|
| IRC SP-41 | Guidelines for Design of At-Grade Intersections | Signal phase timing constraints |
| IRC 93:1985 | Guidelines for Design and Installation of Road Traffic Signals | Signal clearance intervals |
| MoRTH | Ministry of Road Transport standards | Vehicle classification |
| ANPR Standards | India uses different plate formats (state/district code) | License plate recognition format |
| IT Act 2000/2008 | Data privacy requirements | Citizen data handling |
| Motor Vehicles Act 2019 | Vehicle classification and traffic rules | Violation detection categories |

---

## 10. Feasibility Summary

### 10.1 What Can Be Reused (High Value)

| Component | Reusability | Notes |
|:---|:---|:---|
| Server architecture (Express + WS) | 90% | Add auth, validation |
| Traffic Engine core loop | 80% | Change units, add vehicle types |
| Agent Event Bus | 95% | Architecture is solid |
| Emergency corridor logic | 75% | Add Vellore routes, safety validation |
| Simulation history | 85% | Migrate from file to database |
| UI design system | 90% | Change content, keep components |
| TypeScript type definitions | 70% | Add new types, change units |
| Routing engine (BFS) | 60% | Need weighted graph for Vellore roads |

### 10.2 What Must Be Replaced Completely

| Component | Reason |
|:---|:---|
| All mock data (intersections, cameras, routes) | Western city, must be Vellore |
| CityMap.tsx (SVG visualization) | Must use MapLibre + real geography |
| Speed units (mph → km/h) | Every file that references speed |
| Vehicle type model | Must add motorcycle, auto-rickshaw |
| Landing page content | Must reference Vellore, not fictional city |
| Architecture page descriptions | Must be honest about implementation |

### 10.3 Effort Estimate

| Work Package | Estimated Effort |
|:---|:---|
| Unit conversion (mph → km/h) + data model changes | 2-3 days |
| Vellore intersection data creation (8-12 intersections) | 3-5 days |
| Indian vehicle types + simulation behaviors | 5-7 days |
| MapLibre + OSM integration | 5-7 days |
| Database setup + migration | 3-5 days |
| Authentication | 2-3 days |
| Weather model calibration for Vellore | 1-2 days |
| Emergency corridor mapping for Vellore | 2-3 days |
| **Total Phase 1 Estimate** | **23-35 working days** |
