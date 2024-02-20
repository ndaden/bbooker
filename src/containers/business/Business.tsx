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
import { useParams } from "react-router-dom";
import useFetchServices from "../../hooks/useFetchServices";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import React from "react";

const Business = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  let businessToDisplay;

  const { businesses, isLoading: isLoadingBusiness } = useFetchBusinesses(id);
  const { services, isLoading: isLoadingServices } = useFetchServices(
    undefined,
    id
  );

  if (!isLoadingBusiness) {
    businessToDisplay = businesses[0];
  }

  const onClickTakeAppointment = () => {
    navigate("/appointment", {
      state: { business: businessToDisplay, services: services },
    });
  };
  return (
    !isLoadingBusiness &&
    !isLoadingServices && (
      <Container>
        <div className="relative">
          <Card className="border-none ">
            <CardBody className="text-center p-0 m-0">
              <Image
                removeWrapper
                src={businessToDisplay.imageUrl ?? "/images/topform_banner.jpg"}
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
                  {businessToDisplay.description}. Machin vous accueille dans
                  son salon situé au centre ville de Niort et réalise toutes vos
                  coupes et prestations favorites Bla Bla
                  BlaBlaBlaBlaBlaBlaBlaBlaBla.
                </p>
              </div>
              <div className="my-3">
                <Button
                  size="lg"
                  variant="solid"
                  type="button"
                  color="danger"
                  variant="shadow"
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
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.serviceName}</TableCell>
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
