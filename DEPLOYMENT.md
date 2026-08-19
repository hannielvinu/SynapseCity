# SynapseCity — Deployment Guide

SynapseCity is production-ready for deployment on any Node.js or Docker-compatible cloud platform (Render, Railway, Fly.io, Heroku, AWS, Google Cloud Run, Azure).

---

## ⚡ 1. Fast Deploy (Render / Railway / Heroku / PaaS)

### Option A: Standard Node.js Deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: (automatically set by hosting provider)
  - `GEMINI_API_KEY`: *(Optional)* If provided, enables live generative Gemini flash analysis. If omitted, the embedded traffic intelligence engine automatically generates high-fidelity heuristic recommendations.

### Option B: Docker Container Deployment
Use the included multi-stage `Dockerfile`:
```bash
docker build -t synapsecity:latest .
docker run -p 3000:3000 -e PORT=3000 synapsecity:latest
```

---

## 🧪 2. Pre-Deployment Validation Checklist

All checks pass with **0 errors**:
- **Lint Check**: `npm run lint` (`tsc --noEmit`) → ✅ Passed
- **Automated Tests**: `npm run test` (Safety boundaries, multi-agent engine, digital twin) → ✅ Passed
- **Production Build**: `npm run build` (Vite + esbuild standalone bundle) → ✅ Passed

---

## 🌐 3. Ports & WebSocket Architecture
- **Single Port Unification**: The Express server and WebSocket server share the same HTTP listener on `process.env.PORT || 3000`.
- **Dynamic WebSocket Connection**: Automatically switches between `ws://` and `wss://` based on `window.location.host`.
