import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
} from "@heroui/react";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import { useParams, useLocation } from "react-router-dom";
import useFetchAppointments from "../../hooks/useFetchAppointments";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BusinessCalendar from "./BusinessCalendar";
import { useAuth } from "../../contexts/UserContext";
import { BsGeoAlt, BsPencil, BsClock, BsChevronDown, BsChevronUp } from "react-icons/bs";
import type { BusinessHours } from "../../components/BusinessHoursInput";
import React from "react";

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const Business = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isCalendarView = location.pathname.includes("/calendar");
  const { user } = useAuth();
  const [showHours, setShowHours] = React.useState(false);

  const { businesses, isLoading: isLoadingBusiness, isError, error } = useFetchBusinesses({
    id,
  });

  // Get business data
  const businessToDisplay = businesses?.payload || businesses;

  // Check if current user is the owner
  const isOwner = user && businessToDisplay && (
    businessToDisplay.ownerId === user.id || 
    businessToDisplay.owner?._id === user.id ||
    businessToDisplay.owner?.id === user.id ||
    businessToDisplay.accountId === user.id
  );

  const onClickTakeAppointment = () => {
    navigate("/appointment", {
      state: { business: businessToDisplay },
    });
  };

  const onClickGoThere = () => {
    if (businessToDisplay?.address) {
      const encodedAddress = encodeURIComponent(businessToDisplay.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const onClickEdit = () => {
    navigate(`/business/${id}/edit`);
  };

  // Fetch appointments for calendar view
  const businessIdForCalendar = isCalendarView && id ? id : null;
  const { appointments, isLoading: isLoadingAppointments } = useFetchAppointments(
    businessIdForCalendar as any
  );

  // Show loading state while data is being fetched
  if (isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg text-default-500">Chargement du centre...</p>
      </div>
    );
  }

  // Show error state if request failed
  if (isError || !businessToDisplay) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-lg text-red-500 font-bold">Erreur</p>
          <p className="text-default-500">Le centre n'a pas pu être chargé.</p>
          {error && <p className="text-sm text-default-400 mt-2">{String(error)}</p>}
          <Button 
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (isCalendarView) {
    // Transform appointments data for the calendar
    const calendarAppointments = appointments?.payload?.map((apt: any) => ({
      id: apt._id,
      startTime: apt.startTime,
      endTime: apt.endTime,
      serviceName: apt.service?.serviceName || "Service",
      clientName: apt.client?.username || apt.client?.profile?.firstName || "Client",
    })) || [];

    return (
      <Container>
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/business/${id}`)}
          >
            ← Retour au centre
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {businessToDisplay?.name} - Calendrier
        </h1>
        <BusinessCalendar appointments={calendarAppointments} />
      </Container>
    );
  }

  return (
      <Container>
        {/* Hero Image */}
        <div className="relative w-full sm:rounded-xl overflow-hidden">
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px]">
            <Image
              removeWrapper
              src={businessToDisplay.image ?? "/images/topform_banner.jpg"}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        </div>

        {/* Business Info Card */}
        <Card className="-mt-16 relative z-10">
          <CardBody className="p-4 sm:p-6">
            {/* Title and Edit Button */}
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold flex-1">
                {businessToDisplay.name}
              </h1>
              {isOwner && (
                <Button
                  size="sm"
                  variant="flat"
                  color="warning"
                  onClick={onClickEdit}
                  isIconOnly
                  className="ml-2"
                >
                  <BsPencil size={16} />
                </Button>
              )}
            </div>

            {/* Description */}
            <p className="text-default-600 text-sm sm:text-base mb-4">
              {businessToDisplay.description}
            </p>

            {/* Keywords */}
            {businessToDisplay.keywords && businessToDisplay.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {businessToDisplay.keywords.map((keyword: string, index: number) => (
                  <Chip key={`${keyword}-${index}`} size="sm" variant="flat" color="primary">
                    {keyword}
                  </Chip>
                ))}
              </div>
            )}

            {/* Address */}
            {businessToDisplay.address && (
              <div className="flex items-start gap-2 mb-4 text-default-600">
                <BsGeoAlt className="mt-1 flex-shrink-0" size={16} />
                <p className="text-sm">{businessToDisplay.address}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                size="lg"
                color="primary"
                className="font-semibold py-6 flex-1"
                onClick={onClickTakeAppointment}
              >
                Réserver
              </Button>
              {businessToDisplay.address && (
                <Button
                  size="sm"
                  variant="light"
                  className="text-primary underline underline-offset-2 hover:underline-offset-4 transition-all"
                  onClick={onClickGoThere}
                  startContent={<BsGeoAlt />}
                >
                  Voir l'itinéraire
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Business Hours Section */}
        <div className="mt-6">
          <Card>
            <CardBody className="p-4">
              <button
                onClick={() => setShowHours(!showHours)}
                className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <BsClock className="text-primary" size={20} />
                  <h3 className="text-lg font-semibold">Horaires d'ouverture</h3>
                </div>
                {showHours ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
              </button>
              
              {showHours && (
                <div className="mt-4 space-y-2">
                  {businessToDisplay.businessHours && Array.isArray(businessToDisplay.businessHours) && businessToDisplay.businessHours.length > 0 ? (
                    // Sort days starting from Monday (1)
                    [...(businessToDisplay.businessHours as BusinessHours)]
                      .sort((a, b) => {
                        const orderA = a.day === 0 ? 7 : a.day;
                        const orderB = b.day === 0 ? 7 : b.day;
                        return orderA - orderB;
                      })
                      .map((dayHours) => (
                        <div
                          key={dayHours.day}
                          className="flex justify-between items-center py-2 border-b border-default-200 last:border-0"
                        >
                          <span className="font-medium text-default-700">
                            {DAYS_FR[dayHours.day]}
                          </span>
                          <span className={dayHours.closed ? "text-default-400 italic" : "text-default-600"}>
                            {dayHours.closed ? "Fermé" : `${dayHours.openTime} - ${dayHours.closeTime}`}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="text-default-400 italic">Horaires non configurés</p>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableColumn>Prestation</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Tarif</TableColumn>
              <TableColumn>Durée</TableColumn>
            </TableHeader>
            <TableBody>
              {businessToDisplay.services?.map((service: any) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell width="70">{service.price / 100} €</TableCell>
                  <TableCell width="70">{service.duration} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    );
};

export default Business;
