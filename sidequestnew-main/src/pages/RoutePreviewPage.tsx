import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, MapPin, Sparkles, Play, Settings, Bookmark } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { useApp } from '@/context/AppContext';
import { loadGoogleMaps } from '@/utils/maps';
import { Route, Spot } from '@/types';

export default function RoutePreviewPage() {
  const navigate = useNavigate();
  const { routeConfig, setCurrentRoute } = useApp();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapObj = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    async function fetchRoute(lat: number, lng: number) {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/navigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat,
            lng,
            theme: routeConfig.mode || 'Adventure',
            travelMode: routeConfig.travelType === 'walking' ? 'walk' : 'car',
            stops: routeConfig.stopCount
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to generate route');
        }

        const data = await res.json();

        // Transform backend waypoints into frontend Spot objects
        const stops: Spot[] = data.waypoints.map((wp: any, index: number) => ({
          id: `wp_${index}`,
          name: wp.name,
          category: wp.description.split(' ')[0] || 'Landmark',
          shortDescription: wp.description,
          lat: wp.lat,
          lng: wp.lng,
          images: [],
          modeTags: [routeConfig.mode || 'adventure'],
          travelTags: [routeConfig.travelType],
        }));

        const generatedRoute: Route = {
          id: 'r_' + Date.now(),
          mode: routeConfig.mode || 'adventure',
          travelType: routeConfig.travelType,
          detourLevel: routeConfig.detourLevel,
          stopCount: stops.length,
          origin: routeConfig.destination && !routeConfig.exploreAroundMe ? routeConfig.destination : 'Current Location',
          destination: undefined,
          stops,
          estTime: stops.length * 15,
          estDetourTime: stops.length * 5,
          estPoints: stops.length * 25,
        };

        setRoute(generatedRoute);
      } catch (err: any) {
        console.error("Error fetching route:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function resolveLocationAndFetch() {
      // 1. If explore around me, or no destination string is given
      if (routeConfig.exploreAroundMe || !routeConfig.destination) {
        const initRoute = async () => {
          try {
            // Request permissions first
            const perm = await Geolocation.requestPermissions();
            if (perm.location !== 'granted' && perm.location !== 'prompt-with-rationale') {
              throw new Error('Location permission not granted');
            }

            const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
            let { latitude: lat, longitude: lng } = pos.coords;

            fetchRoute(lat, lng);
          } catch (err: any) {
            console.warn("Geolocation failed:", err.message);
            setError("Please allow location access to explore around you.");
            setLoading(false);
          }
        };
        initRoute();
      } else {
        // 2. Geocode the text destination
        try {
          const configRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/config`);
          const config = await configRes.json();
          await loadGoogleMaps(config.googleMapsApiKey);

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: routeConfig.destination }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const loc = results[0].geometry.location;
              fetchRoute(loc.lat(), loc.lng());
            } else {
              setError(`Could not find location for "${routeConfig.destination}"`);
              setLoading(false);
            }
          });
        } catch (err: any) {
          setError("Failed to load map services for geocoding.");
          setLoading(false);
        }
      }
    }

    resolveLocationAndFetch();
  }, [routeConfig]);

  // Load and draw map once route is generated
  useEffect(() => {
    if (!route || !mapRef.current) return;

    const initMap = async () => {
      try {
        const configRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/config`);
        const config = await configRes.json();
        const googleMaps = await loadGoogleMaps(config.googleMapsApiKey);
        let lat = 43.5479;
        let lng = -79.6609;
        const map = new googleMaps.Map(mapRef.current!, {
          center: { lat: lat, lng: lng }, // Fallback to UofT Mississauga
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0f0f0f' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f0f' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#555' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] }
          ]
        });
        googleMapObj.current = map;

        const ds = new googleMaps.DirectionsService();
        const dr = new googleMaps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#39ff14', strokeWeight: 3 }
        });

        const stops = route.stops;
        if (stops.length > 0) {
          const origin = { lat: 43.5479, lng: -79.6609 };
          const destination = { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng };
          const waypoints = stops.slice(0, -1).map(s => ({
            location: { lat: s.lat, lng: s.lng },
            stopover: true
          }));

          const req: google.maps.DirectionsRequest = {
            origin,
            destination,
            waypoints,
            travelMode: route.travelType === 'driving' ? google.maps.TravelMode.DRIVING : google.maps.TravelMode.WALKING
          };

          ds.route(req, (result, status) => {
            if (status === 'OK') dr.setDirections(result);
          });
        }
      } catch (err: any) {
        console.error("Map load error:", err?.message || String(err));
      }
    };

    initMap();
  }, [route]);

  const handleStart = () => {
    if (route) {
      setCurrentRoute(route);
      navigate('/active-nav');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Map layer */}
      <div className="relative h-56 bg-secondary/20">
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        <button onClick={() => navigate('/route-setup')} className="absolute top-12 left-4 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-ios z-10">
          <ChevronLeft size={20} className="text-foreground" />
        </button>
      </div>

      {loading && (
        <div className="px-5 -mt-6 relative z-10">
          <div className="ios-card p-5 shadow-ios-lg text-center animate-pulse">
            <p className="text-[17px] font-medium text-primary italic" style={{ fontFamily: 'Georgia, serif' }}>SideQuest is planning your trip...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="px-5 -mt-6 relative z-10">
          <div className="ios-card p-5 shadow-ios-lg bg-red-500/10 border-red-500/20">
            <p className="text-sm font-medium text-red-500 break-words whitespace-pre-wrap mt-2 overflow-hidden overflow-wrap-anywhere">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Route info */}
      {!loading && !error && route && (
        <div className="px-5 -mt-6 relative z-10">
          <div className="ios-card p-5 shadow-ios-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg capitalize font-display text-foreground">{route.mode} Route</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase">{route.detourLevel}</span>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={14} /> {route.estTime} min
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <Sparkles size={14} /> +{route.estDetourTime} min detour
              </div>
              <div className="flex items-center gap-1.5 text-xs text-accent">
                <Sparkles size={14} /> ~{route.estPoints} pts
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-3">
              {route.stops.map((stop, i) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate('/stop/' + stop.id, { state: { spot: stop } })}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{stop.name}</p>
                    <p className="text-[11px] text-muted-foreground">{stop.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 mt-6 space-y-3">
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-ios-lg"
            >
              <Play size={18} /> Start Route
            </button>
            <div className="flex gap-3">
              <button onClick={() => navigate('/route-setup')} className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-medium text-sm flex items-center justify-center gap-2">
                <Settings size={16} /> Customize
              </button>
              <button className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-medium text-sm flex items-center justify-center gap-2">
                <Bookmark size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
