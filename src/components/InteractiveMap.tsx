
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  location: {
    name: string;
    lat: number;
    lng: number;
    currentAQI: number;
    pollutants: {
      pm25: number;
      pm10: number;
      no2: number;
      so2: number;
      co: number;
      o3: number;
    };
  };
}

const InteractiveMap = ({ location }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // Green
    if (aqi <= 100) return '#eab308'; // Yellow
    if (aqi <= 150) return '#f97316'; // Orange
    if (aqi <= 200) return '#ef4444'; // Red
    if (aqi <= 300) return '#8b5cf6'; // Purple
    return '#7f1d1d'; // Dark Red
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a simple map visualization
    // In production, you would integrate with Google Maps, Mapbox, or similar
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = `
      <div class="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" class="w-full h-full">
            <!-- Simplified world map paths -->
            <path d="M50 150 Q100 100 150 150 T250 140 Q300 120 350 150 L350 250 Q300 200 250 220 Q200 240 150 220 Q100 200 50 220 Z" 
                  fill="#3b82f6" opacity="0.3"/>
            <path d="M80 80 Q120 60 160 80 Q200 100 240 80 Q280 60 320 80 L320 120 Q280 140 240 120 Q200 140 160 120 Q120 140 80 120 Z" 
                  fill="#3b82f6" opacity="0.2"/>
          </svg>
        </div>
        
        <!-- Location marker -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div class="relative">
            <!-- Pulsing animation -->
            <div class="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" style="width: 24px; height: 24px;"></div>
            
            <!-- Main marker -->
            <div class="relative bg-white rounded-full p-2 shadow-lg border-2" style="border-color: ${getAQIColor(location.currentAQI)}">
              <div class="w-4 h-4 rounded-full" style="background-color: ${getAQIColor(location.currentAQI)}"></div>
            </div>
            
            <!-- AQI value tooltip -->
            <div class="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
              <div class="text-center">
                <div class="font-bold">${location.name}</div>
                <div>AQI: ${location.currentAQI}</div>
              </div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        </div>
        
        <!-- Coordinates display -->
        <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-gray-600">
          ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°
        </div>
      </div>
    `;
  }, [location]);

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="h-80 relative">
        <div ref={mapRef} className="w-full h-full"></div>
      </div>

      {/* Location Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Location Details</span>
          </div>
          <div className="space-y-1 text-sm">
            <div><strong>City:</strong> {location.name}</div>
            <div><strong>Coordinates:</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</div>
            <div className="flex items-center gap-2">
              <strong>Status:</strong>
              <Badge 
                className="text-white" 
                style={{ backgroundColor: getAQIColor(location.currentAQI) }}
              >
                {getAQILevel(location.currentAQI)}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="h-4 w-4 text-green-600" />
            <span className="font-medium">Key Pollutants</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>PM2.5:</span>
              <span className="font-medium">{location.pollutants.pm25} μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>PM10:</span>
              <span className="font-medium">{location.pollutants.pm10} μg/m³</span>
            </div>
            <div className="flex justify-between">
              <span>NO₂:</span>
              <span className="font-medium">{location.pollutants.no2} ppb</span>
            </div>
            <div className="flex justify-between">
              <span>O₃:</span>
              <span className="font-medium">{location.pollutants.o3} ppb</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Legend */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-red-50">
        <h4 className="font-medium mb-2 text-sm">AQI Color Scale</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Unhealthy (101-150)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-900"></div>
            <span>Hazardous (300+)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InteractiveMap;
