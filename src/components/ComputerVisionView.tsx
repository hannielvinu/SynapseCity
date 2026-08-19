import React, { useState } from 'react';
import { CameraFeed } from '../types';
import { Video, Scan, Info } from 'lucide-react';

interface ComputerVisionViewProps {
  cameraFeeds: CameraFeed[];
}

export const ComputerVisionView: React.FC<ComputerVisionViewProps> = ({ cameraFeeds = [] }) => {
  const [selectedCamId, setSelectedCamId] = useState<string>(cameraFeeds.length > 0 ? cameraFeeds[0].id : '');

  const activeCam = cameraFeeds.length > 0 
    ? (cameraFeeds.find(c => c.id === selectedCamId) || cameraFeeds[0])
    : null;

  if (!activeCam) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-600" />
              <span>Live Traffic Monitoring</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">No camera feeds available.</p>
          </div>
        </div>
        <div className="w-full h-[420px] bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs italic">
          No active camera feeds loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Header Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-cyan-600" />
          <span>Live Traffic Camera Interface</span>
        </h2>
        <div className="mt-3 flex items-start gap-2.5 bg-cyan-50/70 p-3.5 rounded-xl border border-cyan-200 max-w-4xl">
          <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-cyan-950 font-bold">DISCLAIMER:</strong> Coimbatore municipal CCTV streams are not publicly available for this demonstration. An external New York City live traffic camera is integrated as a reference demonstration feed to illustrate the live-camera monitoring UI. The external video is a reference input; Coimbatore operational state remains simulated/canonical.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera View Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-[420px] bg-slate-950 rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
            {/* Clean YouTube Stream Container with Header Clipping */}
            <div className="relative w-full h-full overflow-hidden">
              <iframe 
                className="w-full h-[120%] -mt-[8%] scale-105 pointer-events-none"
                src="https://www.youtube-nocookie.com/embed/z-jYdOIKcTQ?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&loop=1&playlist=z-jYdOIKcTQ" 
                title="External Reference Feed - New York City" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              />
            </div>

            {/* Live Camera Info Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/40 text-xs text-white flex items-center space-x-2 shadow-sm pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold uppercase tracking-wider text-[11px]">EXTERNAL REF FEED / NYC</span>
            </div>
            
            <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold shadow-sm pointer-events-none">
              STREAM ACTIVE | DEMO UI
            </div>
          </div>

          {/* Detections Breakdown bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Cars (Sim)</span>
              <span className="text-2xl font-black font-mono text-cyan-700 mt-1 block">{activeCam.detections.cars}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Buses (Sim)</span>
              <span className="text-2xl font-black font-mono text-purple-700 mt-1 block">{activeCam.detections.buses}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Motorcycles</span>
              <span className="text-2xl font-black font-mono text-blue-700 mt-1 block">{activeCam.detections.motorcycles}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-slate-500 block text-[11px] font-bold uppercase tracking-wider">Auto Rickshaws</span>
              <span className="text-2xl font-black font-mono text-amber-700 mt-1 block">{activeCam.detections.auto_rickshaws}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Selector & Violation Stream */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Select Intersection</h3>

            <div className="space-y-2">
              {cameraFeeds.map((cam) => {
                const isSelected = cam.id === activeCam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamId(cam.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-cyan-50 border-cyan-400 shadow-xs ring-1 ring-cyan-400' 
                        : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                      <span>{cam.title.split(':')[0]}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono text-[10px] font-extrabold">ACTIVE</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 font-medium">{cam.title.split(':')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Intersection Data (Simulated)</span>
              <Scan className="w-4 h-4 text-cyan-600" />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span className="text-slate-600 font-sans font-medium">Avg Speed:</span>
                <span className="text-cyan-800 font-extrabold text-sm">{activeCam.avgSpeedKmh} km/h</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono">
                <span className="text-slate-600 font-sans font-medium">Speed Violations:</span>
                <span className="text-rose-700 font-extrabold text-sm">{activeCam.speedViolations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
