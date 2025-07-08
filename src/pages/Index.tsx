import { useState } from 'react';
import LocationSelector from '@/components/LocationSelector';
import AQIDisplay from '@/components/AQIDisplay';
import PredictionCharts from '@/components/PredictionCharts';
import InteractiveMap from '@/components/InteractiveMap';
import { Card } from '@/components/ui/card';
import { MapPin, Eye, Thermometer } from 'lucide-react';

interface LocationData {
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
  predictions: {
    hourly: Array<{
      time: string;
      aqi: number;
      pollutants: {
        pm25: number;
        pm10: number;
        no2: number;
        so2: number;
        co: number;
        o3: number;
      };
    }>;
  };
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (location: { name: string; lat: number; lng: number }) => {
    setIsLoading(true);
    console.log('Selected location:', location);
    
    // Simulate API call to get current AQI and predictions
    // In real implementation, this would call your trained model API
    setTimeout(() => {
      const mockData: LocationData = {
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        currentAQI: Math.floor(Math.random() * 300) + 50,
        pollutants: {
          pm25: Math.floor(Math.random() * 100) + 10,
          pm10: Math.floor(Math.random() * 150) + 20,
          no2: Math.floor(Math.random() * 80) + 5,
          so2: Math.floor(Math.random() * 60) + 2,
          co: Math.floor(Math.random() * 40) + 1,
          o3: Math.floor(Math.random() * 120) + 10,
        },
        predictions: {
          hourly: Array.from({ length: 24 }, (_, i) => ({
            time: `${i}:00`,
            aqi: Math.floor(Math.random() * 200) + 50,
            pollutants: {
              pm25: Math.floor(Math.random() * 80) + 10,
              pm10: Math.floor(Math.random() * 120) + 20,
              no2: Math.floor(Math.random() * 60) + 5,
              so2: Math.floor(Math.random() * 40) + 2,
              co: Math.floor(Math.random() * 30) + 1,
              o3: Math.floor(Math.random() * 100) + 10,
            },
          })),
        },
      };
      
      setSelectedLocation(mockData);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-500 to-blue-700 p-2 rounded-lg">
              <img 
                src="/lovable-uploads/4debacc3-8adc-42fb-9117-b7c2b2080131.png" 
                alt="AQI Horizon Mapper Logo" 
                className="h-8 w-8 object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">
                AQI Horizon Mapper
              </h1>
              <p className="text-sm text-muted-foreground">APPCB Air Quality Monitoring & Prediction</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Location Selection */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Select Location</h2>
          </div>
          <LocationSelector onLocationSelect={handleLocationSelect} isLoading={isLoading} />
        </Card>

        {selectedLocation && (
          <>
            {/* Current AQI Display */}
            <AQIDisplay data={selectedLocation} />

            {/* Map and Predictions Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Interactive Map */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold">Location Map</h2>
                </div>
                <InteractiveMap location={selectedLocation} />
              </Card>

              {/* Prediction Charts */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold">24-Hour Predictions</h2>
                </div>
                <PredictionCharts data={selectedLocation.predictions} />
              </Card>
            </div>
          </>
        )}

        {!selectedLocation && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-2xl inline-block">
              <Wind className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Select a Location to Begin
              </h3>
              <p className="text-gray-600">
                Choose a city or location to view real-time AQI data and hourly predictions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
