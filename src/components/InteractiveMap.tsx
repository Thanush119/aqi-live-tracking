
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

    console.log('Rendering map for location:', location);

    // Create enhanced map visualization with Andhra Pradesh focus
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = `
      <div class="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-200 rounded-lg overflow-hidden border">
        <!-- Andhra Pradesh map outline -->
        <div class="absolute inset-0 opacity-30">
          <svg viewBox="0 0 400 300" class="w-full h-full">
            <!-- Simplified Andhra Pradesh state outline -->
            <path d="M80 50 Q120 40 160 60 Q200 45 240 55 Q280 50 320 65 L340 90 Q330 130 310 160 Q290 190 270 210 Q240 230 200 240 Q160 245 120 235 Q90 220 70 190 Q60 160 65 130 Q70 100 80 50 Z" 
                  fill="#16a085" opacity="0.4" stroke="#0f766e" stroke-width="2"/>
            <!-- Coastal line -->
            <path d="M320 65 Q340 90 330 130 Q320 160 310 160" 
                  stroke="#2563eb" stroke-width="3" fill="none"/>
          </svg>
        </div>
        
        <!-- Location marker with accurate positioning -->
        <div class="absolute z-10" style="
          left: ${((location.lng - 77) / (84 - 77)) * 80 + 10}%; 
          top: ${((17.8 - location.lat) / (17.8 - 13)) * 70 + 15}%;
          transform: translate(-50%, -50%);
        ">
          <div class="relative">
            <!-- Pulsing animation -->
            <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="
              width: 20px; 
              height: 20px; 
              background-color: ${getAQIColor(location.currentAQI)};
            "></div>
            
            <!-- Main marker -->
            <div class="relative bg-white rounded-full p-1 shadow-lg border-2" style="border-color: ${getAQIColor(location.currentAQI)}">
              <div class="w-3 h-3 rounded-full" style="background-color: ${getAQIColor(location.currentAQI)}"></div>
            </div>
            
            <!-- AQI value tooltip -->
            <div class="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              <div class="text-center">
                <div class="font-bold">${location.name.split(',')[0]}</div>
                <div>AQI: ${location.currentAQI}</div>
              </div>
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black/90"></div>
            </div>
          </div>
        </div>
        
        <!-- Coordinates display -->
        <div class="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600">
          ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E
        </div>
        
        <!-- State label -->
        <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
          Andhra Pradesh
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
            <span className="font-medium">Station Details</span>
          </div>
          <div className="space-y-1 text-sm">
            <div><strong>Station:</strong> {location.name}</div>
            <div><strong>Coordinates:</strong> {location.lat.toFixed(6)}°N, {location.lng.toFixed(6)}°E</div>
            <div className="flex items-center gap-2">
              <strong>Air Quality:</strong>
              <Badge 
                className="text-white text-xs" 
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
