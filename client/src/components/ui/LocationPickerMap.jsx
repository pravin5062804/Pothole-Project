import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Navigation, MapPin, Maximize2, Minimize2, Loader2, Globe, Plus, Minus } from 'lucide-react';

// Custom SVG Pin Icon
const customMarkerIcon = L.divIcon({
  className: 'custom-civic-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab;">
      <div style="width: 38px; height: 38px; background: #059669; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(5,150,105,0.45); border: 2.5px solid #ffffff;">
        <div style="transform: rotate(45deg); color: white; font-size: 16px; font-weight: bold;">📍</div>
      </div>
      <div style="width: 12px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: 2px; filter: blur(1px);"></div>
    </div>
  `,
  iconSize: [38, 44],
  iconAnchor: [19, 42],
});

// Component to handle map clicks & location updates
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Component to programmatically re-center map when coords change
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], 16, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

// Custom in-map Zoom Buttons (avoiding default control collisions)
function CustomZoomControls() {
  const map = useMap();
  return (
    <div className="flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 pointer-events-auto">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          map.zoomIn();
        }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors font-bold text-xs cursor-pointer"
        title="Zoom In (or use 2 fingers on trackpad)"
      >
        <Plus size={14} />
      </button>
      <div className="w-full h-px bg-slate-200" />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          map.zoomOut();
        }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors font-bold text-xs cursor-pointer"
        title="Zoom Out (or use 2 fingers on trackpad)"
      >
        <Minus size={14} />
      </button>
    </div>
  );
}

export default function LocationPickerMap({ coords, onCoordsChange, onAddressChange }) {
  const [mapMode, setMapMode] = useState('default'); // 'default' | 'satellite'
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Default coordinate (Center of Delhi, India or current coords)
  const defaultCenter = coords || { lat: 28.6139, lng: 77.2090 };
  const currentPos = coords ? [coords.lat, coords.lng] : [defaultCenter.lat, defaultCenter.lng];

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        onAddressChange(data.display_name);
      } else {
        onAddressChange(`Location: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
      onAddressChange(`Location: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSelectLocation = (newCoords) => {
    onCoordsChange(newCoords);
    reverseGeocode(newCoords.lat, newCoords.lng);
  };

  const handleGPSLocate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          onCoordsChange(newCoords);
          reverseGeocode(newCoords.lat, newCoords.lng);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation failed:', err.message);
          setIsLocating(false);
          alert('Could not fetch precise GPS. You can click on the map to place your pin.');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported in this browser.');
    }
  };

  return (
    <div className="w-full">
      {/* Map Container Box */}
      <div
        className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 ${
          isExpanded ? 'h-[460px] ring-2 ring-emerald-500/20' : 'h-[320px]'
        }`}
      >
        {/* Top Floating Control Bar with Mode Selector & GPS */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none gap-2">
          {/* Map Layer Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 pointer-events-auto">
            <button
              type="button"
              onClick={() => setMapMode('default')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'default'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe size={13} />
              <span>Default Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers size={13} />
              <span>Satellite Mode</span>
            </button>
          </div>

          {/* Action Buttons: GPS + Expand */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={handleGPSLocate}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-emerald-600" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation size={13} className="text-emerald-600" />
                  <span>Use GPS</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 shadow-md transition-all cursor-pointer"
              title={isExpanded ? 'Collapse Map' : 'Expand Map'}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* Leaflet Map with Two-Finger Trackpad Zooming enabled */}
        <MapContainer
          center={currentPos}
          zoom={14}
          zoomControl={false} // Disable default controls to avoid collision with top bar
          scrollWheelZoom={true} // Enables 2-finger trackpad zoom and mouse wheel zoom
          touchZoom={true} // Enables mobile & trackpad pinch-to-zoom
          doubleClickZoom={true}
          className="w-full h-full z-0"
        >
          {/* Tile Layer Based on Mode */}
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

          {/* Click Handler & Smooth Center Adjuster */}
          <MapClickHandler onLocationSelect={handleSelectLocation} />
          <ChangeMapView coords={coords} />

          {/* Floating Custom Zoom Controls (Inside Map Context) */}
          <div className="absolute right-3 bottom-12 z-[1000] pointer-events-none">
            <CustomZoomControls />
          </div>

          {/* Draggable Marker */}
          {coords && (
            <Marker
              position={[coords.lat, coords.lng]}
              icon={customMarkerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  handleSelectLocation({ lat: position.lat, lng: position.lng });
                },
              }}
            />
          )}
        </MapContainer>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-2 left-3 right-3 z-[1000] flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-[11px] font-medium text-slate-700 shadow-sm pointer-events-none">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-emerald-600 shrink-0" />
            {coords ? (
              <span className="truncate">
                Pin: [{coords.lat.toFixed(4)}°, {coords.lng.toFixed(4)}°] &bull; Click, drag, or 2-finger zoom on laptop
              </span>
            ) : (
              <span>Click map to pin &bull; Use 2 fingers on laptop trackpad to zoom</span>
            )}
          </span>
          {isGeocoding && (
            <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0 ml-2">
              <Loader2 size={11} className="animate-spin" /> Fetching address...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
