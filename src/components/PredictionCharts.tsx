
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface PredictionChartsProps {
  data: {
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

const PredictionCharts = ({ data }: PredictionChartsProps) => {
  const aqiData = data.hourly.map(item => ({
    time: item.time,
    aqi: item.aqi,
  }));

  const pollutantData = data.hourly.slice(0, 12).map(item => ({
    time: item.time,
    PM25: item.pollutants.pm25,
    PM10: item.pollutants.pm10,
    NO2: item.pollutants.no2,
    O3: item.pollutants.o3,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* AQI Trend Chart */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">24-Hour AQI Forecast</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aqiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="aqi" 
                stroke="url(#aqiGradient)" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pollutant Levels Chart */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">12-Hour Pollutant Forecast</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pollutantData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="PM25" fill="#ef4444" name="PM2.5" radius={[2, 2, 0, 0]} />
              <Bar dataKey="PM10" fill="#f97316" name="PM10" radius={[2, 2, 0, 0]} />
              <Bar dataKey="NO2" fill="#eab308" name="NO₂" radius={[2, 2, 0, 0]} />
              <Bar dataKey="O3" fill="#22c55e" name="O₃" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">AI Predictions Insights</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Peak AQI expected around {aqiData.reduce((max, item) => item.aqi > max.aqi ? item : max).time}</p>
          <p>• Best air quality window: {aqiData.reduce((min, item) => item.aqi < min.aqi ? item : min).time}</p>
          <p>• Predictions based on advanced ML models trained on historical and real-time data</p>
          <p>• Updated every hour with latest atmospheric conditions</p>
        </div>
      </Card>
    </div>
  );
};

export default PredictionCharts;
