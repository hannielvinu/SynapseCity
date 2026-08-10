import React, { useState, useEffect } from 'react';
import { IntersectionNode, EmergencyUnit, CameraFeed } from '../types';
import { Siren, Video, Radio, Layers, Eye, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CityMapProps {
  nodes: IntersectionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  emergencyUnits: EmergencyUnit[];
  cameraFeeds: CameraFeed[];
  isSimulating: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  emergencyUnits,
  cameraFeeds,
  isSimulating
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showCameras, setShowCameras] = useState(true);
  const [showEmergencyPath, setShowEmergencyPath] = useState(true);
  const [showAvLanes, setShowAvLanes] = useState(true);

  // Animated vehicle positions
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Find active emergency paths
  const activeEmergencyUnit = emergencyUnits.find(u => u.greenWaveActive && u.status === 'en_route');

  // Helper to get node by ID
  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="relative w-full h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-lg text-xs text-slate-300">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Map Layers:
        </span>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            showHeatmap ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Density Heatmap
        </button>

        <button
          onClick={() => setShowCameras(!showCameras)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            showCameras ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'
          }`}
        >
          AI Vision Cams
        </button>

        <button
          onClick={() => setShowEmergencyPath(!showEmergencyPath)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            showEmergencyPath ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Emergency Corridors
        </button>

        <button
          onClick={() => setShowAvLanes(!showAvLanes)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            showAvLanes ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
          }`}
        >
          AV Dedicated Lanes
        </button>
      </div>

      {/* Map Legend Overlay Right */}
      <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-lg">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500"></span>
          <span>Clear Signal</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
          <span>Moderate Queue</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
          <span>Congested</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Emergency Lock</span>
        </div>
      </div>

      {/* Interactive Map SVG Canvas */}
      <div className="relative flex-1 w-full h-full bg-[#0b0f19] cursor-crosshair overflow-hidden">
        {/* Dark Grid Lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <svg className="w-full h-full absolute inset-0 z-0">
          <defs>
            {/* Glow filters */}
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emergency" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <linearGradient id="emergency-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Heatmap Nodes if enabled */}
          {showHeatmap && nodes.map((node) => {
            const radius = Math.max(25, node.densityScore * 0.7);
            const opacity = Math.min(0.35, node.densityScore / 200);
            const color = node.densityScore > 70 ? '#f43f5e' : node.densityScore > 40 ? '#f59e0b' : '#06b6d4';
            return (
              <circle
                key={`heat-${node.id}`}
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={radius}
                fill={color}
                opacity={opacity}
                className="transition-all duration-700"
              />
            );
          })}

          {/* Render Road Connections */}
          {nodes.map((source) => {
            return source.connectedNodes.map((targetId) => {
              const target = getNode(targetId);
              if (!target) return null;

              // Check if part of emergency corridor
              const isEmergencySegment = activeEmergencyUnit && showEmergencyPath &&
                activeEmergencyUnit.pathNodeIds.includes(source.id) &&
                activeEmergencyUnit.pathNodeIds.includes(target.id);

              return (
                <g key={`edge-${source.id}-${target.id}`}>
                  {/* Road Base Track */}
                  <line
                    x1={`${source.x}%`}
                    y1={`${source.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={isEmergencySegment ? '#ef4444' : '#334155'}
                    strokeWidth={isEmergencySegment ? '6' : '3'}
                    strokeDasharray={isEmergencySegment ? '8 4' : undefined}
                    className={isEmergencySegment ? 'animate-pulse' : ''}
                    opacity="0.8"
                  />

                  {/* AV Dedicated Lane overlay */}
                  {showAvLanes && (source.id === 'node-3' || source.id === 'node-1') && (
                    <line
                      x1={`${source.x}%`}
                      y1={`${source.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke="#a855f7"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity="0.6"
                    />
                  )}

                  {/* Animated Vehicles on road segment */}
                  {isSimulating && [0.2, 0.5, 0.8].map((offset, i) => {
                    const progress = ((tick * 1.5 + offset * 100) % 100) / 100;
                    const vx = source.x + (target.x - source.x) * progress;
                    const vy = source.y + (target.y - source.y) * progress;
                    return (
                      <circle
                        key={`veh-${source.id}-${target.id}-${i}`}
                        cx={`${vx}%`}
                        cy={`${vy}%`}
                        r={isEmergencySegment ? '3.5' : '2'}
                        fill={isEmergencySegment ? '#38bdf8' : '#38bdf8'}
                        opacity="0.9"
                      />
                    );
                  })}
                </g>
              );
            });
          })}

          {/* Render Active Emergency Corridor Animated Unit */}
          {activeEmergencyUnit && showEmergencyPath && (
            <g>
              {/* Emergency vehicle position animation */}
              {(() => {
                const nodeA = getNode(activeEmergencyUnit.pathNodeIds[0]);
                const nodeB = getNode(activeEmergencyUnit.pathNodeIds[1]);
                if (!nodeA || !nodeB) return null;

                const progress = activeEmergencyUnit.currentProgress / 100;
                const ex = nodeA.x + (nodeB.x - nodeA.x) * progress;
                const ey = nodeA.y + (nodeB.y - nodeA.y) * progress;

                return (
                  <g className="animate-bounce">
                    <circle
                      cx={`${ex}%`}
                      cy={`${ey}%`}
                      r="16"
                      fill="#ef4444"
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={`${ex}%`}
                      cy={`${ey}%`}
                      r="8"
                      fill="#3b82f6"
                      filter="url(#glow-emergency)"
                    />
                  </g>
                );
              })()}
            </g>
          )}

          {/* Render Intersection Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isEmergency = node.signalMode === 'emergency_corridor' || node.signalState === 'emergency_override';

            let nodeColor = '#10b981'; // Green
            if (isEmergency) nodeColor = '#38bdf8'; // Cyan/Emergency
            else if (node.signalState === 'yellow') nodeColor = '#f59e0b';
            else if (node.signalState === 'red' || node.densityScore > 75) nodeColor = '#f43f5e';

            return (
              <g
                key={`node-${node.id}`}
                onClick={() => onSelectNode(node.id)}
                className="cursor-pointer group"
              >
                {/* Outer Selection Highlight Ring */}
                {isSelected && (
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin"
                  />
                )}

                {/* Outer Pulsing Aura */}
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={isEmergency ? '16' : '12'}
                  fill={nodeColor}
                  opacity={isEmergency ? '0.4' : '0.2'}
                  className={isEmergency ? 'animate-ping' : 'group-hover:scale-125 transition-all'}
                />

                {/* Node Center Icon */}
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="8"
                  fill="#0f172a"
                  stroke={nodeColor}
                  strokeWidth="2.5"
                  filter="url(#glow-green)"
                />

                {/* Text Label */}
                <text
                  x={`${node.x}%`}
                  y={`${node.y + 4.5}%`}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  className="pointer-events-none drop-shadow-md font-sans"
                >
                  {node.name.split('&')[0]}
                </text>

                {/* Density Badge */}
                <text
                  x={`${node.x}%`}
                  y={`${node.y - 3.5}%`}
                  textAnchor="middle"
                  fill={node.densityScore > 70 ? '#f43f5e' : '#38bdf8'}
                  fontSize="9"
                  fontWeight="bold"
                  className="pointer-events-none font-mono"
                >
                  {node.densityScore}%
                </text>
              </g>
            );
          })}

          {/* Render Camera Markers if enabled */}
          {showCameras && cameraFeeds.map((cam) => {
            const targetNode = getNode(cam.intersectionId);
            if (!targetNode) return null;
            return (
              <g key={`cam-marker-${cam.id}`} transform={`translate(${targetNode.x + 2}, ${targetNode.y - 2})`}>
                <rect
                  x={`${targetNode.x + 1.5}%`}
                  y={`${targetNode.y - 3.5}%`}
                  width="18"
                  height="14"
                  rx="3"
                  fill="#1e1b4b"
                  stroke="#818cf8"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Node Quick Info Drawer on Map */}
        {selectedNodeId && (() => {
          const selectedNode = getNode(selectedNodeId);
          if (!selectedNode) return null;
          return (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 shadow-xl z-30 text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    selectedNode.signalState === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></span>
                  <h4 className="font-bold text-slate-100">{selectedNode.name}</h4>
                </div>
                <button
                  onClick={() => onSelectNode('')}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2 text-[11px]">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Density Score</span>
                  <strong className="text-cyan-400 text-sm font-mono">{selectedNode.densityScore}%</strong>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Vehicle Count</span>
                  <strong className="text-slate-100 text-sm font-mono">{selectedNode.vehicleCount} cars</strong>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">Current Phase</span>
                  <strong className="text-amber-300 text-[10px] line-clamp-1">{selectedNode.currentPhase}</strong>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">AI Confidence</span>
                  <strong className="text-emerald-400 text-sm font-mono">{selectedNode.aiConfidence}%</strong>
                </div>
              </div>

              {selectedNode.incidentAlert && (
                <div className="mt-2 p-1.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-[10px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{selectedNode.incidentAlert}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
