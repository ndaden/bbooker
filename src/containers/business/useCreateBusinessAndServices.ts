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
      serviceName: values.name,
      description: values.description,
      duration: values.durationInMinutes,
      price: values.price * 100,
    };

    return prestation;
  };

  const toDatabaseBusinessWithPrestations = (values) => {
    const formData = new FormData();
    formData.append("name", values.businessName);
    formData.append("description", values.businessDescription);
    formData.append("owner", user ? user.user["_id"] : "");
    formData.append("image", values.businessImage);

    const prestationsToCreate = values.prestations.map((presta, idx) => {
      return toDatabasePrestation(presta);

      /* formData.append(
        `prestations[${idx}].description`,
        toDatabasePrestation(presta).description
      );

      formData.append(
        `prestations[${idx}].duration`,
        toDatabasePrestation(presta).duration
      );
      formData.append(
        `prestations[${idx}].price`,
        toDatabasePrestation(presta).price
      );*/
    });

    formData.append(`prestations`, JSON.stringify(prestationsToCreate));

    return formData;
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
    console.log(toDatabaseBusinessWithPrestations(values));
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
