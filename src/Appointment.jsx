import {
  Button,
  Card,
  CardBody,
  Input,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

const Appointment = () => {
  const { state } = useLocation();
  const { business, services } = state;
  console.log("business:", business);
  console.log("services: ", services);
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
  } = useForm();

  const [chosenService, setChosenService] = useState(new Set([]));
  const [chosenDateAndTime, setChosenDateAndTime] = useState();

  const date = "2023-09-21";
  const heureOuverture = "10:00";
  const heureFermeture = "18:00";

  let debut = dayjs(`${date} ${heureOuverture}`);
  let fin = dayjs(`${date} ${heureFermeture}`);

  const genererCreneaux = (dateTimeDebut, dateTimeFin) => {
    let result = [];
    let pointer = dateTimeDebut;
    let free = true;

    while (pointer.isBefore(dateTimeFin)) {
      free = !free;
      result.push({
        debut: pointer,
        fin: pointer.add(30, "minutes"),
        free: free,
      });

      pointer = pointer.add(30, "minutes");
    }
    return result;
  };

  const creneaux = genererCreneaux(debut, fin);

  const submitDateAppointment = (data) => {
    console.log(data);
  };

  const onSelectService = (e) => {
    console.log(e);
    setChosenService(new Set(e));
  };

  return (
    <main className="container mx-auto max-w-6xl px-6 flex-grow">
      <Card className="my-3">
        <CardBody>
          <div className="font-bold text-large">
            Votre rendez-vous chez <a href="">{business.name}</a>
          </div>
        </CardBody>
      </Card>
      <Card className="my-3">
        <CardBody>
          <div>
            <Select
              label="Choisissez une prestation"
              onSelectionChange={onSelectService}
              defaultSelectedKey={[]}
              selectedKeys={chosenService}
            >
              {services.map((service) => (
                <SelectItem
                  key={service._id}
                  value={service._id}
                  textValue={` ${service.serviceName} - ${service.duration} minutes`}
                >
                  {service.serviceName} - {service.duration} minutes
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {chosenService.size === 1 && (
        <Card className="my-3">
          <CardBody className="">
            <form
              name="appointmentForm"
              onSubmit={handleSubmit(submitDateAppointment)}
            >
              <Input
                {...register("appointmentDate", {
                  required: {
                    value: true,
                    message: "Vous devez selectionner une date",
                  },
                })}
                labelPlacement="outside"
                label="Choisissez une date"
                type="date"
              />
            </form>
          </CardBody>
        </Card>
      )}

      {chosenDateAndTime && (
        <Card className="my-3">
          <CardBody>
            <div>
              <label>Voici les créneaux disponibles pour le </label>
              <div>
                {creneaux.map((creneau, idx) => (
                  <Tooltip
                    key={idx}
                    content={
                      creneau.free
                        ? "Ce créneau est disponible"
                        : "Ce créneau n'est pas disponible"
                    }
                  >
                    <Button
                      className="m-3"
                      disabled={!creneau.free}
                      color={creneau.free ? "primary" : "default"}
                    >
                      {dayjs(creneau.debut).format("HH:mm")}-
                      {dayjs(creneau.fin).format("HH:mm")}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </main>
  );
};

export default Appointment;
