
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSelectorProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
  isLoading: boolean;
}

interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

const LocationSelector = ({ onLocationSelect, isLoading }: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // APPCB monitoring stations in Andhra Pradesh
  const appcbStations: City[] = [
    { name: 'Secretariat, Amaravati', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Anam Kala Kendram, Rajamahendravaram', state: 'Andhra Pradesh', lat: 17.0005, lng: 81.7773 },
    { name: 'GVM Corporation, Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    { name: 'Tirumala, Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
    { name: 'PWD Grounds, Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Gulzarpet, Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lng: 77.6006 },
    { name: 'Gangineni Cheruvu, Chittoor', state: 'Andhra Pradesh', lat: 13.2172, lng: 79.1003 },
    { name: 'Vaikuntapuram, Tirupathi', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
    { name: 'Kanuru, Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Yerramukkapalli, Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242 },
    { name: 'HB Colony, Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Rajiv Gandhi Park, Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Rajiv Nagar, Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  ];

  // Additional major cities for reference
  const majorCities: City[] = [
    { name: 'New York', state: 'United States', lat: 40.7128, lng: -74.0060 },
    { name: 'London', state: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', state: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Delhi', state: 'India', lat: 28.7041, lng: 77.1025 },
    { name: 'Mumbai', state: 'India', lat: 19.0760, lng: 72.8777 },
    { name: 'Hyderabad', state: 'India', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', state: 'India', lat: 13.0827, lng: 80.2707 },
    { name: 'Bangalore', state: 'India', lat: 12.9716, lng: 77.5946 },
  ];

  const allCities = [...appcbStations, ...majorCities];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a city or location name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log('Searching for:', searchQuery);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = allCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);

      if (filtered.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try searching for a different city or location",
        });
      }
    }, 800);
  };

  const handleLocationClick = (city: City) => {
    console.log('Location selected:', city);
    onLocationSelect({
      name: city.name,
      lat: city.lat,
      lng: city.lng,
    });
    
    toast({
      title: "Location Selected",
      description: `Loading AQI data for ${city.name}, ${city.state}`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            disabled={isLoading}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
          {searchResults.map((city, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-gray-200 hover:border-blue-300"
              onClick={() => handleLocationClick(city)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-muted-foreground">{city.state}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* APPCB Monitoring Stations */}
      {searchResults.length === 0 && !isSearching && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">APPCB Monitoring Stations (Andhra Pradesh)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {appcbStations.slice(0, 8).map((city, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLocationClick(city)}
                  disabled={isLoading}
                  className="justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-300"
                >
                  <div className="text-xs">
                    <div className="font-medium">{city.name}</div>
                    <div className="text-muted-foreground">APPCB Station</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Other Major Cities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {majorCities.slice(0, 6).map((city, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleLocationClick(city)}
                  disabled={isLoading}
                  className="justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-300"
                >
                  <div>
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-muted-foreground">{city.state}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading AQI data...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
