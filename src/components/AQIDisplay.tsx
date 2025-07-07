
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wind, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AQIDisplayProps {
  data: {
    name: string;
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

const AQIDisplay = ({ data }: AQIDisplayProps) => {
  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: 'bg-green-500', textColor: 'text-green-700', icon: CheckCircle };
    if (aqi <= 100) return { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700', icon: AlertTriangle };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', textColor: 'text-orange-700', icon: AlertTriangle };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700', icon: XCircle };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700', icon: XCircle };
    return { level: 'Hazardous', color: 'bg-red-900', textColor: 'text-red-900', icon: XCircle };
  };

  const aqiInfo = getAQILevel(data.currentAQI);
  const IconComponent = aqiInfo.icon;

  const pollutantInfo = [
    { name: 'PM2.5', value: data.pollutants.pm25, unit: 'μg/m³', description: 'Fine Particles' },
    { name: 'PM10', value: data.pollutants.pm10, unit: 'μg/m³', description: 'Coarse Particles' },
    { name: 'NO₂', value: data.pollutants.no2, unit: 'ppb', description: 'Nitrogen Dioxide' },
    { name: 'SO₂', value: data.pollutants.so2, unit: 'ppb', description: 'Sulfur Dioxide' },
    { name: 'CO', value: data.pollutants.co, unit: 'ppm', description: 'Carbon Monoxide' },
    { name: 'O₃', value: data.pollutants.o3, unit: 'ppb', description: 'Ozone' },
  ];

  return (
    <div className="space-y-6">
      {/* Main AQI Display */}
      <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Wind className="h-5 w-5" />
            <span className="text-lg font-medium">Current Air Quality in {data.name}</span>
          </div>
          
          <div className={`inline-flex items-center gap-4 p-6 rounded-2xl ${aqiInfo.color} bg-opacity-10 border border-current border-opacity-20`}>
            <IconComponent className={`h-12 w-12 ${aqiInfo.textColor}`} />
            <div>
              <div className="text-5xl font-bold text-gray-800">{data.currentAQI}</div>
              <div className="text-sm font-medium text-muted-foreground">AQI INDEX</div>
            </div>
          </div>
          
          <Badge 
            className={`${aqiInfo.color} text-white px-4 py-2 text-sm font-medium`}
          >
            {aqiInfo.level}
          </Badge>
        </div>
      </Card>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutantInfo.map((pollutant, index) => (
          <Card key={index} className="p-4 bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{pollutant.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{pollutant.value}</div>
                  <div className="text-xs text-muted-foreground">{pollutant.unit}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{pollutant.description}</div>
              
              {/* Visual indicator bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((pollutant.value / 100) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AQIDisplay;
