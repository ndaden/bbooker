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
  Spinner,
  Chip,
  addToast,
} from "@heroui/react";
import { BsClock, BsCurrencyEuro } from "react-icons/bs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import ControlledRadio from "../../components/ControlledRadio";
import { capitalize } from "lodash";
import useMutateAppointment from "../../hooks/useMutateAppointment";
import useFetchFreeSlots from "../../hooks/useFetchFreeSlots";
import { useAuth } from "../../contexts/UserContext";

// Generate array of next 30 days starting from today, filtering out closed days
const generateDays = (startDate, count = 30, businessHours = []) => {
  const days = [];
  let currentDate = dayjs(startDate);
  let daysAdded = 0;
  
  // If no business hours configured, return all days
  if (!businessHours || businessHours.length === 0) {
    return Array.from({ length: count }, (_, i) => 
      dayjs(startDate).add(i, "day").format("YYYY-MM-DD")
    );
  }
  
  // Only include days that are not closed
  while (daysAdded < count) {
    const dayOfWeek = currentDate.day(); // 0=Sunday, 6=Saturday
    const dayHours = businessHours.find(h => h.day === dayOfWeek);
    
    // Include day if: no hours defined for this day (default open) OR hours exist and not closed
    if (!dayHours || !dayHours.closed) {
      days.push(currentDate.format("YYYY-MM-DD"));
      daysAdded++;
    }
    
    currentDate = currentDate.add(1, "day");
  }
  
  return days;
};

const Appointment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [availableDays] = useState(() => 
    generateDays(dayjs(), 30, state?.business?.businessHours)
  );
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors = {}, isValid, isDirty },
    getValues,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"), // Default to today
    },
  });

  useEffect(() => {
    // Try to restore state from sessionStorage if available
    const savedState = sessionStorage.getItem('appointmentState');
    if (savedState) {
      try {
        const { business, formData } = JSON.parse(savedState);
        // Restore form values
        if (formData) {
          Object.keys(formData).forEach(key => {
            if (formData[key]) setValue(key, formData[key]);
          });
        }
        sessionStorage.removeItem('appointmentState');
      } catch (e) {
        console.error('Failed to restore appointment state:', e);
      }
    }
    
    if (!state && !savedState) {
      navigate(-1);
    }
  }, [state, navigate, setValue]);

  const serviceId = watch("service");
  const selectedDate = watch("date");
  const selectedTime = watch("heure");

  const selectedService = serviceId
    ? state?.business?.services?.find((s) => s.id === serviceId)
    : undefined;

  const {
    isLoading: isLoadingFreeSlots,
    freeSlots,
  } = useFetchFreeSlots({
    businessId: state?.business?.id,
    startTimeInterval: selectedDate
      ? dayjs(selectedDate).unix()
      : undefined,
    endTimeInterval: selectedDate
      ? dayjs(selectedDate).add(1, "day").unix()
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
      // Check if user is authenticated before submitting
      if (!isAuthenticated) {
        setShowAuthPrompt(true);
        return;
      }
      await mutateAppointment(mapFormDataToApi(values));
    }
  };

  const handleLogin = () => {
    // Save current appointment state to sessionStorage
    sessionStorage.setItem('appointmentState', JSON.stringify({
      business: state?.business,
      formData: getValues(),
    }));
    navigate('/login', { state: { returnTo: '/appointment' } });
  };

  const handleSignup = () => {
    // Save current appointment state to sessionStorage
    sessionStorage.setItem('appointmentState', JSON.stringify({
      business: state?.business,
      formData: getValues(),
    }));
    navigate('/signup', { state: { returnTo: '/appointment' } });
  };

  // Handle redirect after successful appointment creation
  useEffect(() => {
    if (createAppointmentResult?.success) {
      addToast({
        title: "Rendez-vous confirmé",
        description: "Votre rendez-vous a été créé avec succès",
        color: "success",
      });
      // Redirect to profile with appointments tab active after a short delay
      setTimeout(() => {
        navigate("/profile", { state: { activeTab: "appointments" } });
      }, 1500);
    }
  }, [createAppointmentResult, navigate]);

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
          {/* Responsive layout */}
          <div className="flex flex-col gap-4 my-4">
            {/* Service Selection - Always visible */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col w-full">
                  <h3 className="text-lg font-semibold">1. Choisir une prestation</h3>
                  {selectedService && (
                    <Chip size="sm" color="primary" className="mt-2">
                      {selectedService.name} - {selectedService.duration} min - {selectedService.price / 100} €
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                <ControlledRadio
                  name="service"
                  control={control}
                  rules={{ required: { value: true } }}
                >
                  {state?.business?.services?.map((service) => (
                    <Radio
                      key={service.id}
                      value={service.id}
                      classNames={{
                        control: "hidden",
                        wrapper: "hidden",
                        base: cn(
                          "group relative inline-flex m-0 items-start",
                          "flex-row w-full cursor-pointer rounded-xl gap-4 p-4 mb-3 border-2 transition-all duration-200",
                          "bg-gradient-to-br from-content1 to-content2 border-default",
                          "hover:border-primary hover:shadow-lg hover:scale-[1.02]",
                          "data-[selected=true]:border-primary data-[selected=true]:shadow-xl",
                          "data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-primary/20 data-[selected=true]:to-primary/5"
                        ),
                      }}
                    >
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-start justify-between">
                          <p className="text-base font-semibold group-data-[selected=true]:text-primary">
                            {service.name}
                          </p>
                          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary opacity-0 group-data-[selected=true]:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                        <p className="text-xs text-default-500 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-default-100 text-xs font-medium">
                            <BsClock className="text-sm" />
                            {service.duration} min
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-xs font-semibold text-primary">
                            <BsCurrencyEuro className="text-sm" />
                            {service.price / 100}
                          </span>
                        </div>
                      </div>
                    </Radio>
                  ))}
                </ControlledRadio>
              </CardBody>
            </Card>

            {/* Date Selection - Visible after service selected */}
            <Card className={cn(!serviceId && "opacity-50 pointer-events-none")}>
              <CardHeader className="pb-2">
                <div className="flex flex-col w-full">
                  <h3 className="text-lg font-semibold">2. Choisir une date</h3>
                  {selectedDate && (
                    <Chip size="sm" color="primary" className="mt-2">
                      {capitalize(dayjs(selectedDate).format("dddd DD/MM/YYYY"))}
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                {!serviceId ? (
                  <p className="text-sm text-default-400 text-center py-4">
                    Sélectionnez d'abord une prestation
                  </p>
                ) : (
                  <div>
                    <p className="text-xs text-default-500 mb-3 flex items-center gap-1">
                      <span>←</span>
                      <span>Faites défiler pour voir plus de dates</span>
                      <span>→</span>
                    </p>
                    <div className="overflow-x-auto pb-2 scrollbar-hide">
                      <div className="flex gap-2 min-w-max">
                      {availableDays.map((day) => {
                        const isToday = dayjs(day).isSame(dayjs(), "day");
                        const isSelected = selectedDate === day;
                        const dayOfWeek = capitalize(dayjs(day).format("ddd"));
                        const dayNumber = dayjs(day).format("DD");
                        const monthName = capitalize(dayjs(day).format("MMM"));
                        
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setValue("date", day)}
                            className={cn(
                              "flex flex-col items-center justify-center",
                              "min-w-[70px] p-3 rounded-lg border-2 transition-all",
                              "hover:border-primary hover:bg-primary/5",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-default bg-content1"
                            )}
                          >
                            <span className="text-xs text-default-500 uppercase">
                              {dayOfWeek}
                            </span>
                            <span className={cn(
                              "text-2xl font-bold mt-1",
                              isSelected && "text-primary"
                            )}>
                              {dayNumber}
                            </span>
                            <span className="text-xs text-default-400 mt-1">
                              {monthName}
                            </span>
                            {isToday && (
                              <span className="text-xs text-primary font-semibold mt-1">
                                Aujourd'hui
                              </span>
                            )}
                          </button>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Time Slots - Visible after date selected */}
            <Card className={cn(!selectedDate && "opacity-50 pointer-events-none")}>
              <CardHeader className="pb-2">
                <div className="flex flex-col w-full">
                  <h3 className="text-lg font-semibold">3. Choisir l'heure</h3>
                  {selectedTime && (
                    <Chip size="sm" color="primary" className="mt-2">
                      {dayjs(selectedTime).format("HH:mm")}
                    </Chip>
                  )}
                </div>
              </CardHeader>
              <CardBody className="pt-2">
                {!selectedDate ? (
                  <p className="text-sm text-default-400 text-center py-4">
                    Sélectionnez d'abord une date
                  </p>
                ) : isLoadingFreeSlots ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : !freeSlots?.payload || freeSlots.payload.length === 0 ? (
                  <p className="text-sm text-default-400 text-center py-4">
                    Aucun créneau disponible pour cette date
                  </p>
                ) : (
                  <ControlledRadio
                    name="heure"
                    control={control}
                    rules={{ required: { value: true } }}
                  >
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {freeSlots.payload.map((creneau, idx) => {
                        const startTime = dayjs(creneau.startTime).format("HH:mm");
                        const endTime = dayjs(creneau.endTime).format("HH:mm");
                        const isAvailable = creneau.free;
                        
                        return (
                          <Tooltip
                            key={idx}
                            content={
                              isAvailable
                                ? `Disponible: ${startTime} - ${endTime}`
                                : "Créneau non disponible"
                            }
                          >
                            <Radio
                              value={creneau.startTime}
                              isDisabled={!isAvailable}
                              classNames={{
                                control: "hidden",
                                wrapper: "hidden",
                                base: cn(
                                  "group relative inline-flex m-0 items-center justify-center",
                                  "cursor-pointer rounded-xl p-4 border-2 transition-all duration-200",
                                  "min-h-[80px]",
                                  isAvailable
                                    ? "bg-gradient-to-br from-content1 to-content2 border-default hover:border-primary hover:shadow-lg hover:scale-105"
                                    : "bg-default-100 border-default-200 opacity-50 cursor-not-allowed",
                                  "data-[selected=true]:border-primary data-[selected=true]:shadow-xl",
                                  "data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-primary/20 data-[selected=true]:to-primary/5",
                                  "data-[selected=true]:scale-105"
                                ),
                              }}
                            >
                              <div className="flex flex-col items-center gap-1">
                                {/* Main time display */}
                                <div className={cn(
                                  "text-lg font-bold transition-colors",
                                  isAvailable ? "text-foreground" : "text-default-400 line-through",
                                  "group-data-[selected=true]:text-primary"
                                )}>
                                  {startTime}
                                </div>
                                
                                {/* Separator */}
                                <div className={cn(
                                  "w-8 h-px transition-colors",
                                  isAvailable ? "bg-default-300" : "bg-default-200",
                                  "group-data-[selected=true]:bg-primary"
                                )} />
                                
                                {/* End time */}
                                <div className={cn(
                                  "text-xs transition-colors",
                                  isAvailable ? "text-default-500" : "text-default-400",
                                  "group-data-[selected=true]:text-primary/80"
                                )}>
                                  {endTime}
                                </div>
                                
                                {/* Selection indicator */}
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary opacity-0 group-data-[selected=true]:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">✓</span>
                                </div>
                              </div>
                            </Radio>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </ControlledRadio>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Submit Button */}
          {isValid && isDirty && (
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                size="lg"
                color="primary"
                isLoading={isCreatingAppointment}
              >
                Confirmer le rendez-vous
              </Button>
            </div>
          )}

          {/* Authentication Prompt */}
          {showAuthPrompt && (
            <Card className="mt-6 border-2 border-primary">
              <CardBody className="text-center p-6">
                <h3 className="text-xl font-semibold mb-3">Authentification requise</h3>
                <p className="text-default-600 mb-6">
                  Pour finaliser votre réservation, vous devez vous connecter ou créer un compte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    color="primary"
                    className="flex-1 sm:flex-none"
                    onClick={handleLogin}
                  >
                    Se connecter
                  </Button>
                  <Button
                    size="lg"
                    variant="bordered"
                    color="primary"
                    className="flex-1 sm:flex-none"
                    onClick={handleSignup}
                  >
                    Créer un compte
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </form>
        
        {/* Success/Error messages */}
        {createAppointmentResult && (
          <Card className="mt-4" style={{ borderColor: createAppointmentResult.success ? '#22c55e' : '#ef4444' }}>
            <CardBody className="text-center">
              {createAppointmentResult.success ? (
                <div>
                  <p className="text-lg font-semibold text-success mb-2">✓ Rendez-vous confirmé</p>
                  <p className="text-default-600">Merci d'avoir pris rendez-vous. Vous recevrez une confirmation par email.</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-danger mb-2">✗ Erreur</p>
                  <p className="text-default-600">
                    Nous sommes désolés, nous ne pouvons pas vous attribuer ce rendez-vous.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </Container>
    )
  );
};

export default Appointment;
