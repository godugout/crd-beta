import { useState, useEffect } from 'react';

// Stadium location data
const STADIUMS = [
  {
    id: 'oakland-coliseum',
    name: 'Oakland Coliseum',
    location: 'Oakland, CA',
    team: 'Oakland Athletics',
    coordinates: { 
      lat: 37.7516, 
      lng: -122.2005 
    },
    sections: {
      // Mapping coordinates to sections
      '37.7518,-122.2010': '116',
      '37.7520,-122.2008': '115',
      '37.7516,-122.2000': '117',
      // More would be added in a real implementation
    },
    todayGame: {
      opponent: 'Angels',
      date: '2024-04-07',
      time: '1:05 PM',
      isHomeGame: true,
    }
  },
  // Other stadiums would be added here
];

// Calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find nearest stadium based on coordinates
const findNearestStadium = (lat: number, lng: number) => {
  // Consider stadiums within 1km as "at the stadium"
  const MAX_DISTANCE = 1.0; 
  
  let nearest = null;
  let smallestDistance = Infinity;
  
  for (const stadium of STADIUMS) {
    const distance = calculateDistance(lat, lng, stadium.coordinates.lat, stadium.coordinates.lng);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearest = stadium;
    }
  }
  
  // Only return if we're close enough
  return smallestDistance <= MAX_DISTANCE ? nearest : null;
};

// Find section based on coordinates within a stadium
const findStadiumSection = (stadium: any, lat: number, lng: number) => {
  // Simplified version - in reality, would use more precise polygon mapping
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  // Check if we have an exact match for the section
  if (stadium.sections[key]) {
    return stadium.sections[key];
  }
  
  // Otherwise, find the closest section
  let nearestSection = null;
  let smallestDistance = Infinity;
  
  for (const [coordStr, section] of Object.entries(stadium.sections)) {
    const [sectionLat, sectionLng] = coordStr.split(',').map(Number);
    const distance = calculateDistance(lat, lng, sectionLat, sectionLng);
    
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestSection = section;
    }
  }
  
  // Only return if we're within a reasonable distance (50m)
  return smallestDistance <= 0.05 ? nearestSection : null;
};

export const useLocationService = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyStadium, setNearbyStadium] = useState<any>(null);
  const [stadiumSection, setStadiumSection] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, let's simulate finding the Coliseum location
    // In production, we would use the browser's geolocation API
    
    const simulateLocation = () => {
      setIsLocating(true);
      setLocationError(null);
      
      // Simulate a delay in getting location
      setTimeout(() => {
        // Simulate success - coordinates near Oakland Coliseum
        const simulatedLat = 37.7516;
        const simulatedLng = -122.2005;
        
        setLocation({ lat: simulatedLat, lng: simulatedLng });
        
        // Find the nearest stadium
        const stadium = findNearestStadium(simulatedLat, simulatedLng);
        setNearbyStadium(stadium);
        
        // If at a stadium, determine the section
        if (stadium) {
          const section = findStadiumSection(stadium, simulatedLat, simulatedLng);
          setStadiumSection(section);
        }
        
        setIsLocating(false);
      }, 1500);
    };
    
    // Uncomment this for real implementation
    /*
    const getActualLocation = () => {
      setIsLocating(true);
      setLocationError(null);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            
            // Find the nearest stadium
            const stadium = findNearestStadium(latitude, longitude);
            setNearbyStadium(stadium);
            
            // If at a stadium, determine the section
            if (stadium) {
              const section = findStadiumSection(stadium, latitude, longitude);
              setStadiumSection(section);
            }
            
            setIsLocating(false);
          },
          (error) => {
            setLocationError(error.message);
            setIsLocating(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser');
        setIsLocating(false);
      }
    };
    */
    
    // Call the simulation function for demo purposes
    simulateLocation();
    // For production: getActualLocation();
    
    // Cleanup
    return () => {
      // Cleanup would cancel any pending location requests
    };
  }, []);

  // Refresh location periodically or on demand
  const refreshLocation = () => {
    // Same implementation as above
    setIsLocating(true);
    
    // Simulate for demo
    setTimeout(() => {
      setIsLocating(false);
      // Location updated...
    }, 1500);
  };

  return {
    location,
    nearbyStadium,
    stadiumSection,
    isLocating,
    locationError,
    refreshLocation
  };
};
