import { useEffect, useState } from "react";
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

const useCreateBusinessAndService = (form, user, setNbPrestations) => {
  const { getValues, unregister, setValue, trigger, reset } = form;
  const [displayPrestationForm, setDisplayPrestationForm] = useState(false);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [isPrestationValid, setIsPrestationValid] = useState(false);
  const { mutateBusiness, data: businessCreated } = useMutateBusiness();
  const [prestationFieldName, setPrestationFieldName] = useState(
    `prestations[${prestations.length}]`
  );

  useEffect(() => {
    if (isPrestationValid) {
      // reset
      reset({
        ...getValues(),
        prestations: [
          ...prestations,
          {
            name: "",
            description: "",
            durationInMinutes: "",
            price: "",
          },
        ],
      });
    } else {
      setIsPrestationValid(false);
    }
  }, [prestationFieldName]);

  const validation = businessValidation(prestations);

  const toDatabasePrestation = (values) => {
    const prestation = {
      name: values.name,
      description: values.description,
      duration: Number.parseInt(values.durationInMinutes),
      price: Number.parseFloat(values.price) * 100,
    };

    return prestation;
  };

  const isEmptyPrestation = (prestation) =>
    prestation.name.trim() === "" ||
    prestation.description.trim() === "" ||
    !prestation.durationInMinutes ||
    !prestation.price;

  const toDatabaseBusinessWithPrestations = (values) => {
    // TODO : implement image upload
    // formData.append("image", values.businessImage);

    const prestationsToCreate = values.prestations
      .filter((p) => !isEmptyPrestation(p))
      .map((presta, idx) => {
        return toDatabasePrestation(presta);
      });

    return {
      name: values.businessName,
      description: values.businessDescription,
      services: prestationsToCreate,
    };
  };

  const goToPrestationsStep = async () => {
    const isBusinessValid = await trigger([
      `businessName`,
      `businessDescription`,
      `businessImage`,
    ]);

    if (isBusinessValid) {
      setDisplayPrestationForm(true);
    }
  };

  const addPrestationHandler = async () => {
    if (displayPrestationForm) {
      const prestationValid = await trigger([
        `${prestationFieldName}.name`,
        `${prestationFieldName}.description`,
        `${prestationFieldName}.durationInMinutes`,
        `${prestationFieldName}.price`,
      ]);

      if (prestationValid) {
        setPrestationFieldName(`prestations[${prestations.length + 1}]`);
        setIsPrestationValid(true);
        const formValues = Object.assign({}, getValues());
        setPrestations([...(formValues.prestations as Prestation[])]);
      }
    }
  };

  const cancelAddPrestationHandler = () => {
    unregister(`prestations[${prestations.length}]`);
  };

  const deletePrestationHandler = (index) => {
    const newPrestations = prestations.filter((prest, idx) => idx !== index);
    setPrestations((prev) => [...prev.filter((prest, idx) => idx !== index)]);
    setValue("prestations", newPrestations);
    setPrestationFieldName(`prestations[${prestations.length - 1}]`);
  };

  const createBusiness = async (values) => {
    // création du business
    mutateBusiness(toDatabaseBusinessWithPrestations(values));
  };

  return {
    deletePrestationHandler,
    cancelAddPrestationHandler,
    addPrestationHandler,
    goToPrestationsStep,
    createBusiness,
    validation,
    prestationFieldName,
    prestations,
    displayPrestationForm,
  };
};

export default useCreateBusinessAndService;
