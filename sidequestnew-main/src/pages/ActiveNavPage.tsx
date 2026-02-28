import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, SkipForward, CheckCircle, X, Volume2, Loader as LoaderIcon, Navigation } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { useApp } from '@/context/AppContext';
import { loadGoogleMaps } from '@/utils/maps';
import MemoryCaptureSheet from '@/components/MemoryCaptureSheet';
import RouteCompletionSheet from '@/components/RouteCompletionSheet';

export default function ActiveNavPage() {
  const navigate = useNavigate();
  const { currentRoute, addPoints, incrementStreak, setCurrentRoute, routeConfig } = useApp();
  const [currentStopIdx, setCurrentStopIdx] = useState(0);
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set());
  const [showMemorySheet, setShowMemorySheet] = useState(false);
  const [showCompletionSheet, setShowCompletionSheet] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapObj = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!currentRoute || !mapRef.current) return;

    const initMap = async () => {
      try {
        const configRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/config`);
        const config = await configRes.json();
        const googleMaps = await loadGoogleMaps(config.googleMapsApiKey);

        if (!googleMaps) throw new Error("Google Maps failed to load.");

        const map = new googleMaps.Map(mapRef.current!, {
          center: { lat: currentRoute.stops[currentStopIdx].lat, lng: currentRoute.stops[currentStopIdx].lng },
          zoom: 16,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0f0f0f' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f0f' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#555' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
            { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111' }] }
          ]
        });
        googleMapObj.current = map;

        const ds = new googleMaps.DirectionsService();
        const dr = new googleMaps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          polylineOptions: { strokeColor: '#39ff14', strokeWeight: 4 }
        });

        const stops = currentRoute.stops;
        if (stops.length > 0) {
          try {
            // Request permissions first
            const perm = await Geolocation.requestPermissions();
            if (perm.location !== 'granted' && perm.location !== 'prompt-with-rationale') {
              throw new Error('Location permission not granted');
            }

            const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
            let { latitude: lat, longitude: lng } = pos.coords;

            const origin = { lat, lng };
            const destination = { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng };
            const waypoints = stops.slice(0, -1).map((s: any) => ({
              location: { lat: s.lat, lng: s.lng },
              stopover: true
            }));

            const req: any = {
              origin,
              destination,
              waypoints,
              travelMode: currentRoute.travelType === 'driving' ? googleMaps.TravelMode.DRIVING : googleMaps.TravelMode.WALKING
            };

            ds.route(req, (result: any, status: any) => {
              if (status === 'OK') dr.setDirections(result);
            });
          } catch (err: any) {
            console.warn("Geolocation failed, using mock origin:", err.message);
            // Fallback to UTM
            const origin = { lat: 43.5479, lng: -79.6609 };
            const destination = { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng };
            const waypoints = stops.slice(0, -1).map((s: any) => ({
              location: { lat: s.lat, lng: s.lng },
              stopover: true
            }));

            const req: any = {
              origin,
              destination,
              waypoints,
              travelMode: currentRoute.travelType === 'driving' ? googleMaps.TravelMode.DRIVING : googleMaps.TravelMode.WALKING
            };

            ds.route(req, (result: any, status: any) => {
              if (status === 'OK') dr.setDirections(result);
            });
          }
        }
      } catch (err: any) {
        console.error("Map load error:", err?.message || String(err));
      }
    };

    initMap();
  }, [currentRoute]);

  // Center map when step changes
  useEffect(() => {
    if (googleMapObj.current && currentRoute) {
      googleMapObj.current.panTo({
        lat: currentRoute.stops[currentStopIdx].lat,
        lng: currentRoute.stops[currentStopIdx].lng
      });
    }
  }, [currentStopIdx, currentRoute]);

  if (!currentRoute) {
    navigate('/home');
    return null;
  }

  const currentStop = currentRoute.stops[currentStopIdx];
  const isLastStop = currentStopIdx >= currentRoute.stops.length - 1;

  const handleCheckIn = () => {
    setCheckedIn(prev => new Set(prev).add(currentStopIdx));
    addPoints(25);
  };

  const handleSkip = () => {
    if (isLastStop) {
      setShowCompletionSheet(true);
    } else {
      setCurrentStopIdx(prev => prev + 1);
    }
  };

  const handleEndRoute = () => {
    incrementStreak();
    setCurrentRoute(null);
    navigate('/home');
  };

  const playVoice = async () => {
    if (voicePlaying) return;
    setVoicePlaying(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentStop.shortDescription,
          mode: currentRoute.mode || 'Adventure',
          travelType: currentRoute.travelType === 'driving' ? 'Driving' : 'Walking'
        })
      });

      if (!res.ok) throw new Error('Failed to load voice');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => setVoicePlaying(false);
      audio.onerror = () => setVoicePlaying(false);

      await audio.play();
    } catch (err) {
      console.error(err);
      setVoicePlaying(false);
      // fallback mock behavior
      setVoicePlaying(true);
      setTimeout(() => setVoicePlaying(false), 2000);
    }
  };

  const openAppleMaps = () => {
    // Generate an Apple Maps URL for turn-by-turn navigation (directions)
    // daddr = destination address/coordinates, dirflg=d means Driving (w for walking)
    const travelDir = currentRoute.travelType === 'driving' ? 'd' : 'w';
    const url = `maps://?daddr=${currentStop.lat},${currentStop.lng}&dirflg=${travelDir}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Map area */}
      <div className="h-[55vh] bg-secondary/15 relative z-0">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" style={{ minHeight: '100%' }} />

        <button
          onClick={() => setShowCompletionSheet(true)}
          className="absolute top-12 right-4 w-9 h-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-ios z-10"
        >
          <X size={18} className="text-foreground" />
        </button>

        {/* Stop progress */}
        <div className="absolute top-12 left-4 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur shadow-ios z-10">
          <span className="text-xs font-semibold text-foreground">{currentStopIdx + 1}/{currentRoute.stops.length} stops</span>
        </div>

        {/* Floating Voice Agent UI */}
        <button
          onClick={playVoice}
          disabled={voicePlaying}
          className={`absolute bottom-6 right-4 w-14 h-14 rounded-full shadow-ios-lg z-10 flex items-center justify-center transition-all duration-300 ${voicePlaying ? 'bg-primary scale-110 ring-4 ring-primary/30' : 'bg-card/95 backdrop-blur-md'}`}
        >
          {voicePlaying ? (
            <div className="flex gap-1 items-center justify-center h-5">
              <motion.div className="w-1.5 bg-primary-foreground rounded-full" animate={{ height: ["6px", "18px", "6px"] }} transition={{ repeat: Infinity, duration: 0.5 }} />
              <motion.div className="w-1.5 bg-primary-foreground rounded-full" animate={{ height: ["10px", "22px", "10px"] }} transition={{ repeat: Infinity, duration: 0.7 }} />
              <motion.div className="w-1.5 bg-primary-foreground rounded-full" animate={{ height: ["6px", "18px", "6px"] }} transition={{ repeat: Infinity, duration: 0.6 }} />
            </div>
          ) : (
            <Volume2 size={24} className="text-primary" />
          )}
        </button>
      </div>

      {/* Next stop card */}
      <div className="px-5 -mt-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStopIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="ios-card p-5 shadow-ios-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Next Stop</p>
                <h3 className="text-lg font-display text-foreground mt-1">{currentStop.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{currentStop.category}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{currentStop.shortDescription}</p>

            <div className="flex gap-2">
              <button
                onClick={handleCheckIn}
                disabled={checkedIn.has(currentStopIdx)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${checkedIn.has(currentStopIdx) ? 'bg-secondary/15 text-secondary' : 'bg-primary text-primary-foreground active:scale-[0.98]'}`}
              >
                <CheckCircle size={16} /> {checkedIn.has(currentStopIdx) ? 'Checked In ✓' : 'Check In'}
              </button>
              <button
                onClick={() => setShowMemorySheet(true)}
                className="py-3 px-4 rounded-xl bg-muted text-foreground text-sm font-medium flex items-center gap-2"
              >
                <Camera size={16} />
              </button>
              <button
                onClick={handleSkip}
                className="py-3 px-4 rounded-xl bg-muted text-muted-foreground text-sm font-medium flex items-center gap-2"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <button
              onClick={openAppleMaps}
              className="mt-3 w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-blue-500 text-white shadow-md active:scale-[0.98] transition-all"
            >
              <Navigation size={16} fill="white" /> Open Route in Apple Maps
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Memory capture sheet */}
      <AnimatePresence>
        {showMemorySheet && (
          <MemoryCaptureSheet
            spotId={currentStop.id}
            spotName={currentStop.name}
            onClose={() => setShowMemorySheet(false)}
          />
        )}
      </AnimatePresence>

      {/* Route completion sheet */}
      <AnimatePresence>
        {showCompletionSheet && (
          <RouteCompletionSheet
            pointsEarned={checkedIn.size * 25}
            stopsVisited={checkedIn.size}
            totalStops={currentRoute.stops.length}
            onDone={handleEndRoute}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
