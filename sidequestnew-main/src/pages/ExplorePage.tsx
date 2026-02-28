import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Loader2 } from 'lucide-react';
import { NavigatorMode, Spot } from '@/types';
import BottomTabBar from '@/components/BottomTabBar';
import { Geolocation } from '@capacitor/geolocation';
import { loadGoogleMaps } from '@/utils/maps';

const filters: { id: NavigatorMode | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'adventure', label: '🧭 Adventure' },
  { id: 'foodie', label: '🍜 Foodie' },
  { id: 'nature', label: '🌿 Nature' },
  { id: 'culture', label: '🎭 Culture' },
  { id: 'mystery', label: '🔮 Mystery' },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<NavigatorMode | 'all'>('all');
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapObj = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    async function fetchSpots(lat: number, lng: number) {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/navigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat,
            lng,
            theme: activeFilter === 'all' ? 'Adventure' : activeFilter,
            travelMode: 'walk',
            stops: 6
          })
        });

        if (!res.ok) throw new Error('Failed to fetch spots');

        const data = await res.json();

        const fetchedSpots: Spot[] = data.waypoints.map((wp: any, index: number) => ({
          id: `exp_${Date.now()}_${index}`,
          name: wp.name,
          category: wp.description.split(' ')[0] || 'Landmark',
          shortDescription: wp.description,
          lat: wp.lat,
          lng: wp.lng,
          images: [],
          modeTags: [activeFilter === 'all' ? 'adventure' : activeFilter],
          travelTags: ['walking'],
        }));

        setSpots(fetchedSpots);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const initExplore = async () => {
      try {
        // Request permissions first
        const perm = await Geolocation.requestPermissions();
        if (perm.location !== 'granted' && perm.location !== 'prompt-with-rationale') {
          throw new Error('Location permission not granted');
        }

        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
        let { latitude: lat, longitude: lng } = pos.coords;

        // Call fetchSpots outside the await so its errors don't trigger the catch block
        fetchSpots(lat, lng);
      } catch (err: any) {
        console.warn("Geolocation failed", err);
        setError("Location access required to explore nearby spots.");
        setLoading(false);
      }
    };
    initExplore();
  }, [activeFilter]);

  // Handle map
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        const configRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/config`);
        const config = await configRes.json();
        const googleMaps = await loadGoogleMaps(config.googleMapsApiKey);

        if (!googleMapObj.current) {
          googleMapObj.current = new googleMaps.Map(mapRef.current!, {
            center: { lat: 43.5479, lng: -79.6609 }, // fallback to UTM
            zoom: 14,
            disableDefaultUI: true,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#0f0f0f' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f0f' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#555' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
              { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111' }] }
            ]
          });
        }

        const map = googleMapObj.current;

        // Clear old markers
        markersRef.current.forEach((m: any) => m.setMap(null));
        markersRef.current = [];

        if (spots.length > 0) {
          const bounds = new googleMaps.LatLngBounds();
          spots.forEach((spot, i) => {
            const marker = new googleMaps.Marker({
              position: { lat: spot.lat, lng: spot.lng },
              map,
              title: spot.name,
              label: { text: (i + 1).toString(), color: '#000', fontWeight: 'bold' },
              icon: {
                path: googleMaps.SymbolPath.CIRCLE,
                fillColor: '#39ff14',
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
                scale: 14
              }
            });
            bounds.extend({ lat: spot.lat, lng: spot.lng });
            markersRef.current.push(marker);

            marker.addListener('click', () => {
              navigate('/stop/' + spot.id, { state: { spot } });
            });
          });
          map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
        }
      } catch (err: any) {
        console.error("Map load error:", err?.message || String(err));
      }
    };

    if (spots.length > 0) {
      initMap();
    }
  }, [spots, navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Map */}
      <div className="h-64 bg-secondary/15 relative">
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Filters */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="px-5 py-6 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 size={18} className="animate-spin" /> Fetching local spots...
        </div>
      )}

      {error && (
        <div className="px-5 py-6">
          <div className="ios-card p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Spot list */}
      {!loading && !error && (
        <div className="px-5 space-y-3">
          {spots.map((spot, i) => (
            <button
              key={spot.id}
              onClick={() => navigate('/stop/' + spot.id, { state: { spot } })}
              className="w-full ios-card p-4 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{spot.name}</p>
                <p className="text-[11px] text-muted-foreground">{spot.category}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{spot.shortDescription}</p>
              </div>
            </button>
          ))}
          {spots.length === 0 && <p className="text-sm text-muted-foreground text-center pt-4">No spots found.</p>}
        </div>
      )}

      <BottomTabBar />
    </div>
  );
}
