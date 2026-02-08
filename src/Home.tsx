import { useState, useEffect, useCallback } from "react";
import { Pagination, Button, Chip } from "@nextui-org/react";
import QAutoComplete from "./components/QAutocomplete";
import BusinessCard from "./components/BusinessCard";
import useFetchBusinesses from "./hooks/useFetchBusinesses";
import useSearchBusinesses from "./hooks/useSearchBusinesses";
import Container from "./components/Container";
import { IoLocationOutline, IoClose } from "react-icons/io5";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationPermissionState, setLocationPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
  
  // Fetch all businesses as default
  const { businesses: allBusinesses, isLoading: isLoadingAll, isError: isErrorAll } = useFetchBusinesses({});
  
  // Search businesses (by query and/or location)
  const { businesses: searchResults, isLoading: isLoadingSearch } = useSearchBusinesses({
    query: searchQuery,
    lat: userLocation?.lat,
    lng: userLocation?.lng,
    radius: 10, // 10km radius
  });

  // Request location permission on mount
  useEffect(() => {
    // Check if we've already asked for permission
    const hasAskedForLocation = sessionStorage.getItem("location_permission_asked");
    
    if (!hasAskedForLocation) {
      setShowLocationPrompt(true);
    } else {
      // If already asked, try to get cached location or check permission
      checkLocationPermission();
    }
  }, []);

  const checkLocationPermission = async () => {
    if ("permissions" in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
        setLocationPermissionState(permissionStatus.state as "prompt" | "granted" | "denied");
        
        if (permissionStatus.state === "granted") {
          getUserLocation();
        }
        
        // Listen for permission changes
        permissionStatus.onchange = () => {
          setLocationPermissionState(permissionStatus.state as "prompt" | "granted" | "denied");
          if (permissionStatus.state === "granted") {
            getUserLocation();
          }
        };
      } catch (error) {
        console.log("Permission API not supported");
      }
    }
  };

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
        setShowLocationPrompt(false);
        sessionStorage.setItem("location_permission_asked", "true");
      },
      (error) => {
        let errorMessage = "Impossible d'obtenir votre position";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à votre position";
            setLocationPermissionState("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        setLocationError(errorMessage);
        setShowLocationPrompt(false);
        sessionStorage.setItem("location_permission_asked", "true");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const handleAcceptLocation = () => {
    getUserLocation();
  };

  const handleDeclineLocation = () => {
    setShowLocationPrompt(false);
    sessionStorage.setItem("location_permission_asked", "true");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationClick = () => {
    getUserLocation();
  };

  // Determine which businesses to display
  const displayBusinesses = searchQuery || userLocation 
    ? searchResults?.payload || searchResults || []
    : allBusinesses?.payload || allBusinesses || [];

  const isLoading = isLoadingAll || isLoadingSearch;
  const isError = isErrorAll;

  return (
    <Container>
      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="my-4 p-4 bg-primary-100 dark:bg-primary-900 rounded-lg border border-primary-300 dark:border-primary-700">
          <div className="flex items-start gap-3">
            <IoLocationOutline className="text-2xl text-primary-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Activer la localisation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Autorisez l'accès à votre position pour découvrir les centres près de chez vous.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  color="primary" 
                  onClick={handleAcceptLocation}
                  startContent={<IoLocationOutline />}
                >
                  Autoriser
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleDeclineLocation}
                >
                  Plus tard
                </Button>
              </div>
            </div>
            <button 
              onClick={handleDeclineLocation}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}

      {/* Location Status */}
      {userLocation && (
        <div className="my-2 flex items-center gap-2">
          <Chip 
            size="sm" 
            color="success" 
            variant="flat"
            startContent={<IoLocationOutline />}
          >
            Localisation active
          </Chip>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setUserLocation(null)}
          >
            Désactiver
          </Button>
        </div>
      )}

      {locationError && !showLocationPrompt && (
        <div className="my-2">
          <Chip 
            size="sm" 
            color="danger" 
            variant="flat"
            startContent={<IoLocationOutline />}
          >
            {locationError}
          </Chip>
        </div>
      )}

      {/* Search Bar */}
      <div className="my-3">
        <QAutoComplete 
          onSearch={handleSearch}
          onLocationClick={handleLocationClick}
          searchQuery={searchQuery}
        />
      </div>

      {/* Results Count */}
      {(searchQuery || userLocation) && !isLoading && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {displayBusinesses.length} résultat{displayBusinesses.length > 1 ? 's' : ''} 
          {searchQuery && ` pour "${searchQuery}"`}
          {userLocation && " à proximité"}
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
            {userLocation && (
              <Button 
                className="mt-4" 
                variant="ghost" 
                onClick={() => setUserLocation(null)}
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
            />
          ))}
      </div>
      
      {/* Pagination - only show when not searching */}
      {!searchQuery && !userLocation && displayBusinesses.length > 0 && (
        <div className="my-4 mx-auto">
          <Pagination total={10} initialPage={1} />
        </div>
      )}
    </Container>
  );
}

export default Home;
