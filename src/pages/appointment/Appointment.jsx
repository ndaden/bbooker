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
} from "@heroui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import ControlledRadio from "../../components/ControlledRadio";
import { capitalize, last } from "lodash";
import useMutateAppointment from "../../hooks/useMutateAppointment";
import useFetchFreeSlots from "../../hooks/useFetchFreeSlots";

const genererSemaine = (dateDebut) => {
  return [1, 2, 3, 4, 5, 6, 7].map((i) => {
    return dayjs(dateDebut, "YYYY-MM-DD")
      .add(i - 1, "day")
      .format("YYYY-MM-DD");
  });
};

const Appointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [semaine, setSemaine] = useState([]);

  useEffect(() => {
    if (!state) {
      navigate(-1);
    }

    setSemaine(genererSemaine(dayjs()));
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
  // const values = watch();
  const date = dayjs(getValues("date")).format("YYYY-MM-DD");

  const nextWeekHandler = () => {
    setSemaine((prevSemaine) => genererSemaine(last(prevSemaine)));
  };

  const lastWeekHandler = () => {
    setSemaine((prevSemaine) =>
      genererSemaine(dayjs(prevSemaine[0]).subtract(7, "days"))
    );
  };

  const serviceId = getValues("service");
  const selectedService = serviceId
    ? state.business.services.find((s) => s.id === serviceId)
    : undefined;

  const {
    isLoading: isLoadingFreeSlots,
    refetchFreeSlots,
    freeSlots,
  } = useFetchFreeSlots({
    businessId: state.business.id,
    startTimeInterval: getValues("date")
      ? dayjs(getValues("date")).unix()
      : undefined,
    endTimeInterval: getValues("date")
      ? dayjs(getValues("date")).add(1, "day").unix()
      : undefined,
    slotDurationInMinutes: selectedService?.duration,
  });

  const [createAppointmentResult, setCreateAppointmentResult] = useState();
  const {
    mutateAppointment,
    isLoading: isCreatingAppointment,
    isError,
    data,
  } = useMutateAppointment();

  const mapFormDataToApi = ({ service, heure }) => {
    return { serviceId: service, startTime: `${dayjs(heure).format()}` };
  };

  const submitDateAppointment = async (values) => {
    if (isValid) {
      await mutateAppointment(mapFormDataToApi(values));
    }
  };

  useEffect(() => {
    const setResult = async () =>
      setCreateAppointmentResult(await data?.json());

    setResult();
  }, [data]);

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
          {!serviceId && (
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
                          "inline-flex m-0 bg-content1 items-center justify-between",
                          "flex-row max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-default hover:border-primary",
                          ""
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
          {serviceId && (
            <Card className="my-3">
              <CardBody>{selectedService.name}</CardBody>
            </Card>
          )}

          {serviceId && !getFieldState("date").isDirty && (
            <Card className="my-3">
              <CardHeader>Pour quelle date ?</CardHeader>
              <CardBody className="">
                <ControlledRadio
                  name="date"
                  control={control}
                  rules={{ required: { value: true } }}
                  orientation="horizontal"
                >
                  {semaine.map((jour) => (
                    <Radio
                      key={jour}
                      value={jour}
                      classNames={{
                        control: "hidden",
                        wrapper: "hidden",
                        base: cn(
                          "inline-flex m-0 bg-content1 items-center justify-between ",
                          "flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent ",
                          "hover:border-primary border-default "
                        ),
                      }}
                    >
                      {capitalize(dayjs(jour).format("ddd DD/MM/YYYY"))}
                    </Radio>
                  ))}
                </ControlledRadio>
                <div className="flex justify-between my-4">
                  <Button onClick={lastWeekHandler}>Semaine précédente</Button>
                  <Button onClick={nextWeekHandler}>Semaine suivante</Button>
                </div>
              </CardBody>
            </Card>
          )}
          {getValues("date") && (
            <Card>
              <CardBody>
                {capitalize(dayjs(getValues("date")).format("dddd DD/MM/YYYY"))}
              </CardBody>
            </Card>
          )}

          {serviceId &&
            getValues("date") &&
            !getFieldState("heure").isDirty && (
              <Card className="my-3">
                <CardHeader>
                  Le {dayjs(getValues("date")).format("DD/MM/YYYY")},&nbsp;à
                  quelle heure ?
                </CardHeader>
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
                        {freeSlots?.payload?.map((creneau, idx) => (
                          <Tooltip
                            key={idx}
                            content={
                              creneau.free
                                ? "Ce créneau est disponible"
                                : "Ce créneau n'est pas disponible"
                            }
                          >
                            <Radio
                              value={creneau.startTime}
                              className="m-3"
                              isDisabled={!creneau.free}
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
                              <p
                                className={`${
                                  !creneau.free ? "line-through" : ""
                                }`}
                              >
                                {dayjs(creneau.startTime).format("HH:mm")}&nbsp;
                                <span className="text-tiny text-secondary-500">
                                  ( jusqu'à
                                  {dayjs(creneau.endTime).format("HH:mm")} )
                                </span>
                              </p>
                            </Radio>
                          </Tooltip>
                        ))}
                      </ControlledRadio>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          {getValues("heure") && (
            <Card className="my-3">
              <CardBody>à {dayjs(getValues("heure")).format("HH:mm")}</CardBody>
            </Card>
          )}

          {isValid && isDirty && (
            <Button
              type="submit"
              fullWidth
              size="lg"
              color="primary"
              isLoading={isCreatingAppointment}
            >
              Prendre RDV
            </Button>
          )}
        </form>
        {createAppointmentResult && createAppointmentResult.success && (
          <p>Merci d'avoir pris rendez-vous.</p>
        )}
        {createAppointmentResult && !createAppointmentResult.success && (
          <p>
            Nous sommes désolés, nous ne pouvons pas vous attribuer ce
            rendez-vous.
          </p>
        )}
      </Container>
    )
  );
};

export default Appointment;
