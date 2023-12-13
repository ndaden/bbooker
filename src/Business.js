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
import useFetchBusinesses from "./hooks/useFetchBusinesses";
import { useParams } from "react-router-dom";
import useFetchServices from "./hooks/useFetchServices";
import { useNavigate } from "react-router-dom";

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
      <main className="container mx-auto max-w-6xl px-6 flex-grow">
        <div className="relative">
          <Card className="w-[90%] absolute z-50 -translate-x-1/2 -translate-y-1/2 left-[50%] top-[50%] text-center bg-opacity-90">
            <CardBody className="text-center">
              <p className="font-bold text-large">{businessToDisplay.name}</p>
              <p className="text-md my-3">
                {businessToDisplay.description}. Machin vous accueille dans son
                salon situé au centre ville de Niort et réalise toutes vos
                coupes et prestations favorites Bla Bla
                BlaBlaBlaBlaBlaBlaBlaBlaBla.
              </p>
              <p className="text-tiny font-bold">
                Ouvert du Lundi au Samedi - de 10h à 18h
              </p>
            </CardBody>
            <CardFooter className="text-center">
              <Button
                size="lg"
                fullWidth
                variant="solid"
                type="button"
                color="primary"
                className="font-bold"
                onClick={onClickTakeAppointment}
              >
                Prendre un rendez-vous
              </Button>
            </CardFooter>
          </Card>
          <Image src="/images/topform_banner.jpg" />
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
                  <TableCell>{service.price / 100} €</TableCell>
                  <TableCell>{service.duration} minutes</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    )
  );
};

export default Business;
