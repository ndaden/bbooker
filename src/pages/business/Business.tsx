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
} from "@nextui-org/react";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import { useParams, useLocation } from "react-router-dom";
import useFetchServices from "../../hooks/useFetchServices";
import useFetchAppointments from "../../hooks/useFetchAppointments";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BusinessCalendar from "./BusinessCalendar";
import React from "react";

const Business = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isCalendarView = location.pathname.includes("/calendar");

  let businessToDisplay: any = null;

  const { businesses, isLoading: isLoadingBusiness } = useFetchBusinesses({
    id,
  });

  if (!isLoadingBusiness && businesses) {
    businessToDisplay = businesses.payload || businesses;
  }

  const onClickTakeAppointment = () => {
    navigate("/appointment", {
      state: { business: businessToDisplay },
    });
  };

  // Fetch appointments for calendar view
  const businessIdForCalendar = isCalendarView && id ? id : null;
  const { appointments, isLoading: isLoadingAppointments } = useFetchAppointments(
    businessIdForCalendar as any
  );

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
    !isLoadingBusiness &&
    businessToDisplay && (
      <Container>
        <div className="relative">
          <Card className="border-none ">
            <CardBody className="text-center p-0 m-0">
              <Image
                removeWrapper
                src={businessToDisplay.image ?? "/images/topform_banner.jpg"}
                className="object-cover max-h-[500px] "
              />
            </CardBody>
            <CardFooter className=" flex-col bg-black/70 before:bg-white/20 border-white/20 border-1 overflow-hidden absolute bottom-0 w-full shadow-small z-10">
              <div>
                <p className="font-bold text-large">{businessToDisplay.name}</p>
                <p className="text-tiny font-bold">
                  Ouvert du Lundi au Samedi - de 10h à 18h
                </p>
                <p className="text-md my-3 hidden sm:block">
                  {businessToDisplay.description}
                </p>
              </div>
              <div className="my-3">
                <Button
                  size="lg"
                  variant="solid"
                  type="button"
                  color="danger"
                  className="font-bold"
                  onClick={onClickTakeAppointment}
                >
                  Prendre un rendez-vous
                </Button>
              </div>
            </CardFooter>
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
    )
  );
};

export default Business;
