import { useState, useEffect, useCallback } from "react";
import { Pagination, Button, Switch } from "@heroui/react";
import QAutoComplete from "./components/QAutocomplete";
import BusinessCard from "./components/BusinessCard";
import useFetchBusinesses from "./hooks/useFetchBusinesses";
import useSearchBusinesses from "./hooks/useSearchBusinesses";
import Container from "./components/Container";
import { IoLocationOutline } from "react-icons/io5";

type LocationMode = "all" | "nearby";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationMode, setLocationMode] = useState<LocationMode>(() => {
    // Restore from localStorage if available
    const saved = localStorage.getItem("location_mode");
    return (saved as LocationMode) || "all";
  });
  
  // Fetch all businesses as default
  const { businesses: allBusinesses, isLoading: isLoadingAll, isError: isErrorAll } = useFetchBusinesses({});
  
  // Search businesses (by query and/or location)
  const { businesses: searchResults, isLoading: isLoadingSearch } = useSearchBusinesses({
    query: searchQuery,
    lat: locationMode === "nearby" ? userLocation?.lat : undefined,
    lng: locationMode === "nearby" ? userLocation?.lng : undefined,
    radius: 10, // 10km radius
  });

  // Get user location when nearby mode is activated
  useEffect(() => {
    if (locationMode === "nearby" && !userLocation) {
      getUserLocation();
    }
  }, [locationMode]);

  // Persist location mode
  useEffect(() => {
    localStorage.setItem("location_mode", locationMode);
  }, [locationMode]);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        let errorMessage = "Impossible d'obtenir votre position";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à votre position";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationModeChange = (isSelected: boolean) => {
    setLocationMode(isSelected ? "nearby" : "all");
    if (isSelected && !userLocation) {
      getUserLocation();
    }
  };

  // Determine which businesses to display
  const displayBusinesses = searchQuery || locationMode === "nearby"
    ? searchResults?.payload || searchResults || []
    : allBusinesses?.payload || allBusinesses || [];

  const isLoading = isLoadingAll || isLoadingSearch;
  const isError = isErrorAll;

  return (
    <Container>
      {/* Location Mode Switch */}
      <div className="my-6 p-4 bg-default-100 dark:bg-default-50/10 rounded-lg border border-default-200">
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center gap-3">
            <IoLocationOutline className="text-2xl text-primary" />
            <div>
              <h3 className="font-semibold text-sm">Mode d'affichage</h3>
              <p className="text-xs text-default-500">
                {locationMode === "nearby" ? "Établissements proches de vous" : "Tous les établissements disponibles"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-3 w-full md:w-auto justify-center md:justify-end">
            <span className={`text-sm font-medium whitespace-nowrap transition-colors ${!locationMode || locationMode === "all" ? "text-primary" : "text-default-400"}`}>
              Voir tous
            </span>
            <Switch
              isSelected={locationMode === "nearby"}
              onValueChange={handleLocationModeChange}
              size="lg"
              color="primary"
              aria-label="Basculer entre voir tous les établissements ou seulement ceux à proximité"
            />
            <span className={`text-sm font-medium whitespace-nowrap transition-colors ${locationMode === "nearby" ? "text-primary" : "text-default-400"}`}>
              À proximité
            </span>
          </div>
        </div>
        
        {locationMode === "nearby" && locationError && (
          <div className="mt-3 p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
            <p className="text-sm text-danger flex items-center gap-2">
              <IoLocationOutline />
              {locationError}
            </p>
            <Button 
              size="sm" 
              variant="ghost" 
              color="primary"
              className="mt-2"
              onClick={getUserLocation}
            >
              Réessayer
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="my-3">
        <QAutoComplete 
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
      </div>

      {/* Results Count */}
      {(searchQuery || locationMode === "nearby") && !isLoading && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {displayBusinesses.length} résultat{displayBusinesses.length > 1 ? 's' : ''} 
          {searchQuery && ` pour "${searchQuery}"`}
          {locationMode === "nearby" && " à proximité"}
        </div>
      )}

      {/* Businesses List */}
      <div className="flex flex-col">
        {isError && (
          <div className="p-4 bg-danger-100 text-danger-700 rounded-lg">
            Impossible de récupérer les données. Veuillez réessayer ultérieurement
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && !isError && displayBusinesses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">Aucun résultat trouvé</p>
            <p className="text-sm">
              {searchQuery 
                ? `Essayez avec d'autres termes de recherche`
                : `Aucun centre disponible pour le moment`
              }
            </p>
            {locationMode === "nearby" && (
              <Button 
                className="mt-4" 
                variant="light" 
                onClick={() => setLocationMode("all")}
              >
                Voir tous les centres
              </Button>
            )}
          </div>
        )}
        
        {!isLoading &&
          !isError &&
          displayBusinesses.map((business: any) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
              image={business.imageUrl ?? business.image ?? "/images/topform_banner.jpg"}
              growOnHover
              isOwner={false}
              distance={business.distance}
              keywords={business.keywords}
            />
          ))}
      </div>
      
      {/* Pagination - only show when not searching */}
      {!searchQuery && locationMode === "all" && displayBusinesses.length > 0 && (
        <div className="my-4 mx-auto">
          <Pagination total={10} initialPage={1} />
        </div>
      )}
    </Container>
  );
}

export default Home;
