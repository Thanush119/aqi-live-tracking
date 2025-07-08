
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
  lat: number;
  lng: number;
}

const LocationSelector = ({ onLocationSelect, isLoading }: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Updated APPCB monitoring stations with correct coordinates
  const appcbStations: City[] = [
    { name: 'Secretariat, Amaravati - APPCB', lat: 16.5150833, lng: 80.5181667 },
    { name: 'Anam Kala Kendram, Rajamahendravaram - APPCB', lat: 16.9872867, lng: 81.7363176 },
    { name: 'GVM Corporation, Visakhapatnam - APPCB', lat: 17.722682, lng: 83.308197 },
    { name: 'Tirumala, Tirupati - APPCB', lat: 13.67, lng: 79.35 },
    { name: 'PWD Grounds, Vijayawada - APPCB', lat: 16.507014, lng: 80.627767 },
    { name: 'Gulzarpet, Anantapur - APPCB', lat: 14.675886, lng: 77.593027 },
    { name: 'Gangineni Cheruvu, Chittoor - APPCB', lat: 13.20488, lng: 79.097889 },
    { name: 'Vaikuntapuram, Tirupathi - APPCB', lat: 13.615387, lng: 79.40923 },
    { name: 'Kanuru, Vijayawada - APPCB', lat: 16.486692, lng: 80.699436 },
    { name: 'Yerramukkapalli, Kadapa - APPCB', lat: 14.465052, lng: 78.824187 },
    { name: 'HB Colony, Vijayawada - APPCB', lat: 16.536107, lng: 80.594233 },
    { name: 'Rajiv Gandhi Park, Vijayawada - APPCB', lat: 16.509717, lng: 80.612222 },
    { name: 'Rajiv Nagar, Vijayawada - APPCB', lat: 16.554731, lng: 80.64911 },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a location name",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log('Searching for:', searchQuery);

    // Simulate API call delay
    setTimeout(() => {
      const filtered = appcbStations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
      setIsSearching(false);

      if (filtered.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try searching for a different APPCB monitoring station",
        });
      }
    }, 800);
  };

  const handleLocationClick = (station: City) => {
    console.log('Location selected:', station);
    onLocationSelect({
      name: station.name,
      lat: station.lat,
      lng: station.lng,
    });
    
    toast({
      title: "Location Selected",
      description: `Loading AQI data for ${station.name}`,
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
            placeholder="Search for APPCB monitoring stations..."
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
          {searchResults.map((station, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-gray-200 hover:border-blue-300"
              onClick={() => handleLocationClick(station)}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">{station.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {station.lat.toFixed(6)}, {station.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Popular Stations */}
      {searchResults.length === 0 && !isSearching && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">APPCB Monitoring Stations</h3>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {appcbStations.slice(0, 8).map((station, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleLocationClick(station)}
                disabled={isLoading}
                className="justify-start h-auto p-3 text-left hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="w-full">
                  <div className="font-medium text-sm">{station.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {station.lat.toFixed(6)}, {station.lng.toFixed(6)}
                  </div>
                </div>
              </Button>
            ))}
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
