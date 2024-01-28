import { useState } from "react";
import { businessValidation } from "./businessValidation";
import useMutateBusiness from "../../hooks/useMutateBusiness";

interface Business {
  name: string;
  description: string;
  owner: string;
}

interface Prestation {
  name: string;
  description: string;
  durationInMinutes: number;
  price: number;
}

const useCreateBusinessAndService = (form, user) => {
  const { getValues, unregister, setValue, trigger } = form;
  const [displayPrestationForm, setDisplayPrestationForm] = useState(false);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const { mutateBusiness, data: businessCreated } = useMutateBusiness();
  // const { mutateService, data: serviceCreated } = useMutateService();

  const prestationFieldName = `prestations[${prestations.length}]`;
  const validation = businessValidation(prestations);

  const toDatabasePrestation = (values) => {
    const prestation = {
      serviceName: values.name,
      description: values.description,
      duration: values.durationInMinutes,
      price: values.price * 100,
    };

    return prestation;
  };

  const toDatabaseBusinessWithPrestations = (values) => {
    const businessWithPrestations = {
      name: values.businessName,
      description: values.businessDescription,
      owner: user ? user.user["_id"] : "",
      prestations: values.prestations.map((presta) =>
        toDatabasePrestation(presta)
      ),
    };

    return businessWithPrestations;
  };

  const addPrestationHandler = async () => {
    if (displayPrestationForm) {
      const isPrestationValid = await trigger([
        `${prestationFieldName}.name`,
        `${prestationFieldName}.description`,
        `${prestationFieldName}.durationInMinutes`,
        `${prestationFieldName}.price`,
      ]);

      if (isPrestationValid) {
        const formValues = getValues();
        setPrestations([...(formValues.prestations as Prestation[])]);
        setDisplayPrestationForm(false);
      }
    } else {
      setDisplayPrestationForm(true);
    }
  };

  const cancelAddPrestationHandler = () => {
    unregister(prestationFieldName);
    setDisplayPrestationForm(false);
  };

  const deletePrestationHandler = (index) => {
    const newPrestations = prestations.filter((prest, idx) => idx !== index);
    setPrestations((prev) => [...prev.filter((prest, idx) => idx !== index)]);
    setValue("prestations", newPrestations);
  };

  const createBusiness = async (values) => {
    // création du business
    mutateBusiness(toDatabaseBusinessWithPrestations(values));
  };

  return {
    deletePrestationHandler,
    cancelAddPrestationHandler,
    addPrestationHandler,
    createBusiness,
    validation,
    prestationFieldName,
    prestations,
    displayPrestationForm,
  };
};

export default useCreateBusinessAndService;
