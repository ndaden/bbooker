import { Button, Card, CardBody, Input, Tooltip } from "@nextui-org/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Appointment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
  } = useForm();

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

  return (
    <main className="container mx-auto max-w-6xl px-6 flex-grow">
      <Card className="my-3">
        <CardBody>Votre rendez-vous pour :</CardBody>
      </Card>

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
    </main>
  );
};

export default Appointment;
