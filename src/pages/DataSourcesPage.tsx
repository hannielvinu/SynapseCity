import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { 
  Database, 
  ExternalLink, 
  Map, 
  Video, 
  Train, 
  CloudSun, 
  Navigation, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Data Sources, External Integrations & Citations"
        subtitle="Transparent documentation of third-party geospatial, railway, weather, and camera reference sources utilized across the SynapseCity platform."
        badgeText="TRANSPARENT ATTRIBUTION"
        badgeType="cyan"
      />

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OpenStreetMap & Leaflet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">OpenStreetMap & CARTO Basemaps</h3>
                  <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.2 rounded border border-cyan-200 font-bold uppercase">
                    GEOSPATIAL TILES
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Open-source geographic map tiles and vector geometry providing accurate Coimbatore street network topology, arterial roads (Avinashi, Trichy, Sathy, Mettupalayam), and landmark coordinates.
            </p>
          </div>
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-700 hover:text-cyan-800 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100"
          >
            <span>Visit OpenStreetMap.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* OSRM Routing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">OSRM (Open Source Routing Machine)</h3>
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200 font-bold uppercase">
                    ROUTING ENGINE
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Heuristic routing engine calculating lowest-impedance emergency vehicle paths, dynamic travel times, and incident penalty recalculations with local simulation graph fallback.
            </p>
          </div>
          <a
            href="http://project-osrm.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100"
          >
            <span>Visit Project-OSRM.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* eRail.in Coimbatore Junction */}
        <div className="bg-white rounded-2xl border border-amber-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">eRail.in — Coimbatore Junction (CBE)</h3>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-200 font-bold uppercase">
                    RAILWAY SCHEDULE REFERENCE
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Third-party live train schedule reference for Coimbatore Junction (CBE) utilized to model railway crossing delay constraints and departure bottlenecks.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
              <strong>Mandatory Disclaimer:</strong> "Railway information: eRail.in — Coimbatore Junction (CBE). Third-party railway information source; verify critical information with official railway sources."
            </div>
          </div>
          <a
            href="https://erail.in/station-live/coimbatore-jn-CBE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100"
          >
            <span>View Live eRail.in Coimbatore Junction Schedule</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* New York Live Traffic Camera Feed */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">New York City Live Traffic Feed</h3>
                  <span className="text-[10px] text-purple-800 bg-purple-50 px-2 py-0.2 rounded border border-purple-200 font-bold uppercase">
                    EXTERNAL REFERENCE FEED
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              YouTube live video stream demonstrating the operational video interface and vehicle detection UI.
            </p>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 font-medium">
              <strong>Mandatory Mentor Note:</strong> "Coimbatore public traffic CCTV feeds are not currently publicly available to us. Following mentor guidance, an external New York City live traffic camera is integrated for demonstration of the live-camera monitoring interface."
            </div>
          </div>
          <a
            href="https://www.youtube.com/live/z-jYdOIKcTQ?si=jFfQmmkF94YWU1NP"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-800 hover:text-purple-900 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100"
          >
            <span>Open External YouTube Camera Feed</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Open-Meteo Weather API */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm flex flex-col justify-between md:col-span-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Open-Meteo Weather Integration</h3>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 font-bold uppercase">
                    METEOROLOGICAL DATA
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Open-Meteo weather forecasts for Coimbatore (Latitude 11.0168° N, Longitude 76.9558° E) providing live rainfall, friction factors, and visibility parameters to simulate bad-weather traffic deceleration.
            </p>
          </div>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-100"
          >
            <span>Visit Open-Meteo.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
