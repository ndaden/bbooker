import {
  Button,
  Card,
  CardBody,
  Tooltip,
  CardHeader,
  cn,
  Radio,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import ControlledRadio from "../../components/ControlledRadio";

const Appointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }
  }, []);

  const {
    register,
    control,
    handleSubmit,
    getFieldState,
    formState: { errors = {}, isValid, isDirty },
    getValues,
    watch,
    trigger,
    reset,
  } = useForm();

  const date = dayjs().format("YYYY-MM-DD");
  const heureOuverture = "10:00";
  const heureFermeture = "18:00";

  let debut = dayjs(`${date} ${heureOuverture}`);
  let fin = dayjs(`${date} ${heureFermeture}`);

  const genererSemaine = (dateDebut) => {
    return [1, 2, 3, 4, 5, 6, 7].map((i) => {
      return dayjs(dateDebut, "YYYY-MM-DD")
        .add(i - 1, "day")
        .format("YYYY-MM-DD");
    });
  };

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
    if (isValid) {
      console.log(data);
    }
  };

  const values = watch();

  const selectedService = values.service
    ? state.business.services.find((s) => s.id === values.service)
    : undefined;

  return (
    state && (
      <Container>
        <Card className="my-3">
          <CardBody>
            <div className="">
              <Breadcrumbs>
                <BreadcrumbItem>Beauty Booker</BreadcrumbItem>
                <BreadcrumbItem>Rendez-vous</BreadcrumbItem>
                <BreadcrumbItem>{state.business.name}</BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </CardBody>
        </Card>
        <form
          name="appointmentForm"
          onSubmit={handleSubmit(submitDateAppointment)}
        >
          {!values.service && (
            <Card className="my-3">
              <CardHeader>
                Pour quelle prestation souhaitez-vous un RDV ?
              </CardHeader>
              <CardBody>
                <ControlledRadio
                  name="service"
                  control={control}
                  rules={{ required: { value: true } }}
                >
                  {state.business.services.map((service) => (
                    <Radio
                      key={service.id}
                      value={service.id}
                      classNames={{
                        control: "hidden",
                        wrapper: "hidden",
                        base: cn(
                          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                          "flex-row max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                          "data-[selected=true]:border-primary"
                        ),
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-medium">{service.name}</p>
                        <p className="text-tiny text-default-400">
                          {service.description}
                        </p>
                        <p className="text-tiny text-default-400">
                          {service.duration} minutes - {service.price / 100} €
                        </p>
                      </div>
                    </Radio>
                  ))}
                </ControlledRadio>
              </CardBody>
            </Card>
          )}
          {values.service && (
            <Card className="my-3">
              <CardBody>{selectedService.name}</CardBody>
            </Card>
          )}

          {values.service && !getFieldState("date").isDirty && (
            <Card className="my-3">
              <CardHeader>Pour quelle date ?</CardHeader>
              <CardBody className="">
                <ControlledRadio
                  name="date"
                  control={control}
                  rules={{ required: { value: true } }}
                  orientation="horizontal"
                >
                  {genererSemaine(date).map((jour) => (
                    <Radio
                      key={jour}
                      value={jour}
                      classNames={{
                        control: "hidden",
                        wrapper: "hidden",
                        base: cn(
                          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between ",
                          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent ",
                          "data-[selected=true]:border-primary"
                        ),
                      }}
                    >
                      {jour}
                    </Radio>
                  ))}
                </ControlledRadio>
              </CardBody>
            </Card>
          )}
          {values.date && (
            <Card>
              <CardBody>{values.date}</CardBody>
            </Card>
          )}

          {values.service && values.date && !getFieldState("heure").isDirty && (
            <Card className="my-3">
              <CardHeader>Le {values.date}, à quelle heure ?</CardHeader>
              <CardBody>
                <div>
                  <label>Voici les créneaux disponibles :</label>
                  <div>
                    <ControlledRadio
                      name="heure"
                      control={control}
                      rules={{ required: { value: true } }}
                      orientation="horizontal"
                    >
                      {creneaux.map((creneau, idx) => (
                        <Tooltip
                          key={idx}
                          content={
                            creneau.free
                              ? "Ce créneau est disponible"
                              : "Ce créneau n'est pas disponible"
                          }
                        >
                          <Radio
                            value={creneau.debut}
                            className="m-3"
                            isDisabled={!creneau.free}
                            color={creneau.free ? "primary" : "default"}
                            classNames={{
                              control: "hidden",
                              wrapper: "hidden",
                              base: cn(
                                "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between ",
                                "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent ",
                                "data-[selected=true]:border-primary"
                              ),
                            }}
                          >
                            {dayjs(creneau.debut).format("HH:mm")}-
                            {dayjs(creneau.fin).format("HH:mm")}
                          </Radio>
                        </Tooltip>
                      ))}
                    </ControlledRadio>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
          {values.heure && (
            <Card className="my-3">
              <CardBody>
                {dayjs.unix(values.heure / 1000).format("HH:mm")}
              </CardBody>
            </Card>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            color="primary"
            isDisabled={!isValid || !isDirty}
          >
            Prendre RDV
          </Button>
        </form>
      </Container>
    )
  );
};

export default Appointment;
