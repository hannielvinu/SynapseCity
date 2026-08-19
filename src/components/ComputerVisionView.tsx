import React, { useState } from 'react';
import { CameraFeed } from '../types';
import { Video, Eye, ShieldAlert, Cpu, Activity, Camera, Scan, AlertTriangle, Layers, Info } from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-cyan-400" />
              <span>Live Traffic Monitoring</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">No camera feeds available.</p>
          </div>
        </div>
        <div className="w-full h-[420px] bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-400 text-xs">
          No active camera feeds loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Sub-Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span>Live Traffic Camera Interface</span>
          </h2>
          <div className="mt-2 flex items-start gap-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 max-w-3xl">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>DISCLAIMER:</strong> Coimbatore public CCTV feeds are not currently available to this demonstration. Following mentor guidance, an external New York City live traffic camera is integrated as a reference feed to demonstrate the live-camera monitoring interface. 
              <br/><br/>
              The external video is a demonstration/reference input, not a pretended municipal CCTV connection. Coimbatore operational state remains the application's simulation/canonical traffic state.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera View Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col pointer-events-auto">
            {/* YouTube Stream */}
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/z-jYdOIKcTQ?autoplay=1&mute=1&controls=0" 
              title="External Reference Feed - New York City" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>

            {/* Live Camera Info Overlay */}
            <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-500/30 text-xs text-rose-200 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold uppercase tracking-wider">EXTERNAL REFERENCE FEED / NEW YORK CITY</span>
            </div>
            
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-300 font-bold">
              STREAM ACTIVE | DEMONSTRATION UI
            </div>
          </div>

          {/* Detections Breakdown bar - using canonical state to show we track simulation objects, not video objects */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Cars (Simulated)</span>
              <span className="text-xl font-extrabold font-mono text-cyan-400 mt-0.5 block">{activeCam.detections.cars}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Buses (Simulated)</span>
              <span className="text-xl font-extrabold font-mono text-purple-400 mt-0.5 block">{activeCam.detections.buses}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Motorcycles (Sim)</span>
              <span className="text-xl font-extrabold font-mono text-blue-400 mt-0.5 block">{activeCam.detections.motorcycles}</span>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 block text-[11px] font-semibold">Auto Rickshaws (Sim)</span>
              <span className="text-xl font-extrabold font-mono text-yellow-400 mt-0.5 block">{activeCam.detections.auto_rickshaws}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Camera Selector & Violation Stream */}
        <div className="space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Select Intersection</h3>

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
                      <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{cam.title.split(':')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Intersection Data (Simulated)</span>
              <Scan className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-300 font-sans">Avg Speed:</span>
                <span className="text-cyan-400 font-bold text-sm">{activeCam.avgSpeedKmh} km/h</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-300 font-sans">Speed Violations:</span>
                <span className="text-rose-400 font-bold text-sm">{activeCam.speedViolations}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

