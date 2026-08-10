# SynapseCity AI Design System Inventory

This design system is the visual source of truth from the Google AI Studio implementation. All engineering changes must preserve these specifications.

---

## 1. Typography & Fonts
- **Primary Display & Body Font**: Satoshi (Sans-serif display & body font). Falls back to standard system sans-serif.
- **Monospace Font**: Standard monospace font (used for latencies, neural grids, coordinates, and raw telemetry text).

---

## 2. Color Palette

The theme uses a Dark Slate Canvas background paired with distinct, high-contrast feedback accents.

| Accent Category | Colors & HSL / Hex Equivalents | Usage / Context |
| :--- | :--- | :--- |
| **Canvas Background** | `#070B12` / `bg-slate-950` | Primary application backgrounds |
| **Containers & Sidebar**| `#0A0E17` / `#0b0f19` | Cards, sidebar, modal backgrounds |
| **Borders** | `border-slate-800/80` / `border-slate-900` | Grid hairlines, separator lines |
| **Cyan / Blue** | `text-cyan-400`, `bg-cyan-500/20` | Edge feeds, AI indicators, 4K cameras |
| **Emerald / Green** | `text-emerald-400`, `bg-emerald-500/20` | Optimal states, green wave corridors, carbon savings |
| **Amber / Yellow** | `text-amber-400`, `bg-amber-500/20`| Warnings, density surges, sandbox parameters |
| **Rose / Red** | `text-rose-400`, `bg-rose-500/20` | Emergency dispatch, critical incidents |
| **Purple / Violet** | `text-purple-400`, `bg-purple-500/20` | Transit priority lanes, AV lanes |

---

## 3. UI Component Specifications

### Cards
- **Structure**: 1px hairline borders (`border-slate-800`), dark translucent background (`bg-slate-900/90`), subtle backdrop blurs (`backdrop-blur-md`), and rounded corners (`rounded-2xl` / `rounded-xl`).
- **Glow Effects**: Drop shadows with light glow filters (e.g., `shadow-lg shadow-cyan-950/40`, `shadow-2xl`).

### Buttons
- **Primary Action**: Dense colors matching the state context (e.g., `bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950`).
- **Secondary Action**: Bordered/translucent shapes (`bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200`).
- **Pills**: Compact rounded-full sizes for toggles.

### Badges
- **Status badges**: Light pulses and color highlights (e.g., `animate-pulse` or `animate-ping` indicators for emergency corridors).
- **Text style**: Bold uppercase text with custom font sizing (`text-[10px]`, `tracking-wider`).

### Maps
- **Style**: Dark base map canvas (`#0b0f19`) with a subtle line grid. Node intersections connected by road path lines with pulsing overlays during emergency green waves.

### Navigation
- **Sidebar**: Vertical left panel with navigation tabs, live counters for active incidents, and grid status footer.
- **Top Header**: Horizontal top bar displaying system notifications, quick action toggles for AI operator helper, and simulation configs.

---

## 4. Responsive Breakpoints
- **Mobile / Tablet**: Sidebar collapses into a drawer triggered by header buttons.
- **Responsive Classes**: Multi-column layouts use Tailwind's responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
