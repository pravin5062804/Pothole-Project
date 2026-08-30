import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Globe,
  Layers,
  MapPin,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  Zap,
  UserCheck,
  Loader2,
  Truck,
  Wrench,
  ShieldCheck,
} from 'lucide-react';

const CATEGORY_MAP_CONFIG = {
  pothole: {
    label: 'Pothole / Road Damage',
    color: '#ea580c', // orange-600
    icon: '🚗',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  garbage: {
    label: 'Garbage & Waste',
    color: '#059669', // emerald-600
    icon: '🗑️',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  streetlight: {
    label: 'Streetlight / Power',
    color: '#d97706', // amber-600
    icon: '💡',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  drainage: {
    label: 'Drainage & Sewage',
    color: '#0284c7', // sky-600
    icon: '💧',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  water: {
    label: 'Water Pipe Leak',
    color: '#06b6d4', // cyan-600
    icon: '🚰',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  other: {
    label: 'General Civil Hazard',
    color: '#7c3aed', // violet-600
    icon: '⚠️',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

const getCategoryConfig = (category) => {
  if (!category) return CATEGORY_MAP_CONFIG.other;
  const lower = category.toLowerCase();
  for (const [key, cfg] of Object.entries(CATEGORY_MAP_CONFIG)) {
    if (lower.includes(key)) return cfg;
  }
  return CATEGORY_MAP_CONFIG.other;
};

const createCategoryMarkerIcon = (
  cfg,
  severity = 'medium',
  isSelected = false,
  isUnassigned = false,
  isAssigned = false,
  isInProgress = false
) => {
  const isCritical = severity === 'critical';
  const size = isSelected ? 42 : isCritical ? 36 : 32;

  const crewBadgeHtml = isInProgress
    ? `<span style="position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; background: #f59e0b; border: 2px solid white; border-radius: 50%; font-size: 9px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">⚡</span>`
    : isAssigned
    ? `<span style="position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; background: #10b981; border: 2px solid white; border-radius: 50%; font-size: 9px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">👷</span>`
    : '';

  return L.divIcon({
    className: 'custom-admin-category-pin',
    html: `
      <div style="position: relative;">
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size}px;
          height: ${size}px;
          background: ${cfg.color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: ${isUnassigned ? '2.5px dashed #f59e0b' : '2.5px solid white'};
          box-shadow: 0 ${isSelected ? '6px 16px' : '4px 10px'} rgba(0,0,0,${isSelected ? '0.45' : '0.3'});
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          <div style="transform: rotate(45deg); font-size: ${isSelected ? '18px' : isCritical ? '15px' : '13px'}; line-height: 1;">
            ${cfg.icon}
          </div>
        </div>
        ${crewBadgeHtml}
      </div>
    `,
    iconSize: [size, size + 6],
    iconAnchor: [size / 2, size + 4],
  });
};

// Auto fit map bounds to current DB issue coordinates
function AutoFitBounds({ issues }) {
  const map = useMap();

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    const validCoords = issues
      .filter((i) => i.location?.coordinates && i.location.coordinates.length === 2)
      .map((i) => [i.location.coordinates[1], i.location.coordinates[0]]);

    if (validCoords.length > 0) {
      if (validCoords.length === 1) {
        map.setView(validCoords[0], 14, { animate: true });
      } else {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
      }
    }
  }, [issues, map]);

  return null;
}

export default function AdminHeatmapView({
  issues = [],
  onOpenStatusModal,
  onAutoDispatchSingle,
  onBatchAutoDispatch,
  isDispatching = false,
}) {
  const [mapMode, setMapMode] = useState('default');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [crewFilter, setCrewFilter] = useState('All'); // 'All' | 'assigned' | 'unassigned'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [dispatchingIssueId, setDispatchingIssueId] = useState(null);

  // Compute live counts from current DB issues
  const counts = {
    All: issues.length,
    pothole: issues.filter((i) => (i.category || '').toLowerCase().includes('pothole')).length,
    drainage: issues.filter((i) => (i.category || '').toLowerCase().includes('drainage')).length,
    garbage: issues.filter((i) => (i.category || '').toLowerCase().includes('garbage')).length,
    streetlight: issues.filter((i) => (i.category || '').toLowerCase().includes('streetlight')).length,
    water: issues.filter((i) => (i.category || '').toLowerCase().includes('water')).length,
  };

  const unassignedCount = issues.filter((i) =>
    ['reported', 'verified', 'reopened'].includes(i.status)
  ).length;

  const assignedCount = issues.filter((i) =>
    ['assigned', 'in_progress', 'pending_confirmation'].includes(i.status)
  ).length;

  // Filter issues based on category, crew dispatch status, and optional text search
  const filteredIssues = issues.filter((issue) => {
    const catLower = (issue.category || '').toLowerCase();
    const matchesCategory =
      categoryFilter === 'All' || catLower.includes(categoryFilter.toLowerCase());

    const isUnassigned = ['reported', 'verified', 'reopened'].includes(issue.status);
    const matchesCrew =
      crewFilter === 'All' ||
      (crewFilter === 'unassigned' && isUnassigned) ||
      (crewFilter === 'assigned' && !isUnassigned);

    const titleLower = (issue.title || '').toLowerCase();
    const addressLower = (issue.address || '').toLowerCase();
    const ticketLower = (issue.ticketId || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      titleLower.includes(query) ||
      addressLower.includes(query) ||
      ticketLower.includes(query);

    return matchesCategory && matchesCrew && matchesSearch;
  });

  const handleSingleDispatch = async (e, issueId) => {
    e.stopPropagation();
    if (!onAutoDispatchSingle) return;
    setDispatchingIssueId(issueId);
    try {
      await onAutoDispatchSingle(issueId);
    } finally {
      setDispatchingIssueId(null);
    }
  };

  // Calculate default center
  const defaultCenter =
    issues.length > 0 && issues[0].location?.coordinates
      ? [issues[0].location.coordinates[1], issues[0].location.coordinates[0]]
      : [19.076, 72.8777];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
      {/* Top Header & Map Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-700">
              Live Field Dispatch & Crew Tracking ({issues.length} Incidents Plotted)
            </span>
          </div>
          <h3 className="font-primary text-xl font-black text-slate-900">
            Geospatial Crew Dispatch & Live Incident Tracking
          </h3>
          <p className="text-xs text-slate-500">
            Monitor real-time repair crew dispatches, assigned field technicians, and unassigned complaint hotspots on the city map.
          </p>
        </div>

        {/* Map Layer Mode Switcher & Auto-Dispatch Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          {onBatchAutoDispatch && unassignedCount > 0 && (
            <button
              type="button"
              onClick={onBatchAutoDispatch}
              disabled={isDispatching}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDispatching ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Zap size={13} className="text-amber-200" />
              )}
              <span>Auto-Dispatch All on Map ({unassignedCount})</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setMapMode('default')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'default'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe size={13} />
              <span>Default Street Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers size={13} />
              <span>Satellite Aerial View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Crew Dispatch Status Filter & Category Filters */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Dispatch Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setCrewFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                crewFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Dispatches
            </button>
            <button
              type="button"
              onClick={() => setCrewFilter('assigned')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                crewFilter === 'assigned' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>👷 Dispatched ({assignedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setCrewFilter('unassigned')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                crewFilter === 'unassigned' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>⚡ Unassigned ({unassignedCount})</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Category Quick Filter Pills */}
          {[
            { id: 'All', label: 'All Types', icon: '📍' },
            { id: 'pothole', label: 'Potholes', icon: '🚗' },
            { id: 'drainage', label: 'Drainage', icon: '💧' },
            { id: 'garbage', label: 'Garbage', icon: '🗑️' },
            { id: 'streetlight', label: 'Streetlights', icon: '💡' },
            { id: 'water', label: 'Water Leaks', icon: '🚰' },
          ].map((f) => {
            const isSelected = categoryFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Map Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map by title or street..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
          />
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="h-[560px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* Dynamic Auto Fit Bounds to Database Issues */}
          <AutoFitBounds issues={filteredIssues} />

          {mapMode === 'default' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {filteredIssues.map((issue) => {
            const coords = issue.location?.coordinates;
            const lat = coords && coords.length === 2 ? coords[1] : 19.076;
            const lng = coords && coords.length === 2 ? coords[0] : 72.8777;

            const cfg = getCategoryConfig(issue.category);
            const isSelected = selectedIssueId === issue._id;
            const isUnassigned = ['reported', 'verified', 'reopened'].includes(issue.status);
            const isAssigned = ['assigned', 'in_progress', 'pending_confirmation'].includes(issue.status);
            const isInProgress = issue.status === 'in_progress';

            const crewName =
              issue.assignedCrewName ||
              issue.assignedWorker?.name ||
              (issue.timeline?.find((t) => t.note?.includes('to Ward') || t.note?.includes('to Field'))?.note?.replace(/.*to\s/, '').replace(/\..*/, '')) ||
              '';

            return (
              <span key={issue._id}>
                {issue.recurrenceCount > 1 && (
                  <Circle
                    center={[lat, lng]}
                    radius={75}
                    pathOptions={{
                      color: cfg.color,
                      fillColor: cfg.color,
                      fillOpacity: 0.15,
                      weight: 2,
                      dashArray: '4, 6',
                    }}
                  />
                )}
                <Marker
                  position={[lat, lng]}
                  icon={createCategoryMarkerIcon(
                    cfg,
                    issue.severity,
                    isSelected,
                    isUnassigned,
                    isAssigned,
                    isInProgress
                  )}
                  eventHandlers={{
                    click: () => setSelectedIssueId(issue._id),
                  }}
                >
                  <Popup>
                    <div className="p-1.5 font-sans max-w-[280px]">
                      {/* Badge header */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cfg.badge}`}>
                          {cfg.icon} {issue.category?.toUpperCase() || 'CIVIC ISSUE'}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          #{issue.ticketId || issue._id.substring(0, 8)}
                        </span>
                      </div>

                      {/* Title & description */}
                      <p className="font-bold text-xs text-slate-900 mb-1 leading-snug">
                        {issue.title}
                      </p>
                      <p className="text-[11px] text-slate-600 mb-2 line-clamp-2 leading-relaxed">
                        {issue.description || 'No additional details provided.'}
                      </p>

                      {/* Location & Status details */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-2.5 text-[10px] space-y-1.5">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin size={11} className="text-red-500 shrink-0" />
                          <span className="truncate">{issue.address || `GPS [${lat.toFixed(4)}, ${lng.toFixed(4)}]`}</span>
                        </div>

                        {/* Live Crew Dispatch & Field Tracking Card */}
                        {crewName || isAssigned ? (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Dispatched Crew:
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                isInProgress ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isInProgress ? '⚡ Repairing' : '🚚 En Route'}
                              </span>
                            </div>
                            <p className="font-bold text-[11px] text-slate-900 leading-tight flex items-center gap-1">
                              <UserCheck size={12} className="text-emerald-600 shrink-0" />
                              <span className="truncate">{crewName || 'Ward Field Maintenance Unit'}</span>
                            </p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5 text-[10px] text-amber-800 font-semibold flex items-center gap-1.5">
                            <Clock size={12} className="text-amber-600 shrink-0" />
                            <span>Unassigned — Awaiting Queue Dispatch</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Auto-Assign & Manual Modal */}
                      <div className="space-y-1.5">
                        {isUnassigned && onAutoDispatchSingle && (
                          <button
                            type="button"
                            onClick={(e) => handleSingleDispatch(e, issue._id)}
                            disabled={dispatchingIssueId === issue._id}
                            className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {dispatchingIssueId === issue._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Zap size={12} />
                            )}
                            <span>⚡ Auto-Dispatch Nearest Crew</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => onOpenStatusModal(e, issue)}
                          className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={13} />
                          <span>Update Status & Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </span>
            );
          })}
        </MapContainer>

        {/* Floating Category Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1.5 max-sm:hidden">
          <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Field Dispatch Status:
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">👷 Dispatched ({assignedCount})</span>
            <span className="flex items-center gap-1.5">⚡ Queue Pending ({unassignedCount})</span>
            <span className="flex items-center gap-1.5">🚗 Potholes ({counts.pothole})</span>
            <span className="flex items-center gap-1.5">💧 Drainage ({counts.drainage})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
