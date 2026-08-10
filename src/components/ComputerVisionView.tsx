import React, { useState } from 'react';
import { CameraFeed } from '../types';
import { Video, Eye, ShieldAlert, Cpu, Activity, Camera, Scan, AlertTriangle, Layers } from 'lucide-react';

interface ComputerVisionViewProps {
  cameraFeeds: CameraFeed[];
}

export const ComputerVisionView: React.FC<ComputerVisionViewProps> = ({ cameraFeeds }) => {
  const [selectedCamId, setSelectedCamId] = useState<string>(cameraFeeds[0].id);
  const [visionMode, setVisionMode] = useState<'boxes' | 'thermal' | 'raw'>('boxes');

  const activeCam = cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>Computer Vision Edge Perception Stream</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time object classification, speed radar tracking, and vehicle counting pipeline</p>
        </div>

        {/* Vision Overlay Controls */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setVisionMode('boxes')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              visionMode === 'boxes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Bounding Boxes
          </button>
          <button
            onClick={() => setVisionMode('thermal')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              visionMode === 'thermal' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thermal Heat
          </button>
          <button
            onClick={() => setVisionMode('raw')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              visionMode === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw HD Feed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera View Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Camera Feed Backdrop Image */}
            <img
              src={activeCam.streamUrlPlaceholder}
              alt={activeCam.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                visionMode === 'thermal' ? 'hue-rotate-180 invert brightness-125 contrast-200' : ''
              }`}
            />

            {/* AI Bounding Box Canvas Overlay */}
            {visionMode === 'boxes' && (
              <div className="absolute inset-0 pointer-events-none p-6">
                {/* Simulated Bounding Box 1 - SUV */}
                <div className="absolute top-1/4 left-1/4 w-36 h-28 border-2 border-cyan-400/80 bg-cyan-500/10 rounded-xl shadow-lg shadow-cyan-500/20 animate-pulse">
                  <span className="absolute -top-5 left-0 px-2 py-0.5 bg-slate-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold rounded-md">
                    [SUV: 98.4%] 34mph
                  </span>
                </div>

                {/* Simulated Bounding Box 2 - Bus */}
                <div className="absolute bottom-1/3 right-1/3 w-48 h-32 border-2 border-purple-400/80 bg-purple-500/10 rounded-xl shadow-lg shadow-purple-500/20">
                  <span className="absolute -top-5 left-0 px-2 py-0.5 bg-slate-950 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold rounded-md">
                    [BRT Bus: 99.1%] Priority Lane
                  </span>
                </div>

                {/* Simulated Bounding Box 3 - Pedestrians */}
                <div className="absolute bottom-10 left-12 w-24 h-16 border-2 border-emerald-400/80 bg-emerald-500/10 rounded-xl">
                  <span className="absolute -top-5 left-0 px-2 py-0.5 bg-slate-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold rounded-md">
                    [Pedestrians: 3]
                  </span>
                </div>
              </div>
            )}

            {/* Live Camera Info Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold">{activeCam.title}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 font-bold">
              FPS: 60 | Latency: 12ms | 4K Edge Perception
            </div>
          </div>

          {/* Detections Breakdown bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Cars</span>
              <span className="text-xl font-extrabold font-mono text-cyan-400 mt-0.5 block">{activeCam.detections.cars}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Buses</span>
              <span className="text-xl font-extrabold font-mono text-purple-400 mt-0.5 block">{activeCam.detections.buses}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Trucks</span>
              <span className="text-xl font-extrabold font-mono text-amber-400 mt-0.5 block">{activeCam.detections.trucks}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Bicycles</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5 block">{activeCam.detections.bicycles}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Pedestrians</span>
              <span className="text-xl font-extrabold font-mono text-emerald-300 mt-0.5 block">{activeCam.detections.pedestrians}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Selector & Violation Stream */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Select Vision Feed</h3>

            <div className="space-y-2">
              {cameraFeeds.map((cam) => {
                const isSelected = cam.id === activeCam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamId(cam.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-950/40' 
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-white">
                      <span>{cam.title.split(':')[0]}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{cam.avgSpeedMph} mph</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{cam.district}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* License Plate & Speed Radar Stream */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Radar & Optical Scans</span>
              <Scan className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-300 font-sans">Total Plates Scanned Today:</span>
                <span className="text-cyan-400 font-bold text-sm">{activeCam.licensePlatesScanned.toLocaleString()}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-300 font-sans">Speed Violations Logged:</span>
                <span className="text-rose-400 font-bold text-sm">{activeCam.speedViolations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
