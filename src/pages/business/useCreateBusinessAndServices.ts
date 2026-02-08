import { useEffect, useState } from "react";
import { businessValidation } from "./businessValidation";
import useMutateBusiness from "../../hooks/useMutateBusiness";


interface Prestation {
  name: string;
  description: string;
  durationInMinutes: number;
  price: number;
}

const useCreateBusinessAndService = (form) => {
  const { getValues, unregister, setValue, trigger, reset } = form;
  const [displayPrestationForm, setDisplayPrestationForm] = useState(false);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [isPrestationValid, setIsPrestationValid] = useState(false);
  const { mutateBusiness } = useMutateBusiness();
  const [prestationFieldName, setPrestationFieldName] = useState(
    `prestations[${prestations.length}]`
  );

  const BUSINESS_DATA_KEY = "new_business_data";

  // Safely parse sessionStorage data with validation
  const parseStoredData = () => {
    try {
      const stored = sessionStorage.getItem(BUSINESS_DATA_KEY);
      if (!stored) return {};
      
      const parsed = JSON.parse(stored);
      // Validate that parsed data is an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        console.warn("Invalid session storage data format, clearing...");
        sessionStorage.removeItem(BUSINESS_DATA_KEY);
        return {};
      }
      return parsed;
    } catch (error) {
      console.error("Error parsing session storage:", error);
      sessionStorage.removeItem(BUSINESS_DATA_KEY);
      return {};
    }
  };

  const [savedBusinessData, setSavedBusinessData] = useState(parseStoredData());

  useEffect(() => {
    console.log("initial effect");
    setValue("businessName", savedBusinessData?.businessName);
    setValue("businessDescription", savedBusinessData?.businessDescription);
    setValue("businessImage", savedBusinessData?.businessImage);

    const savedPrestations = (savedBusinessData?.prestations || []).filter(
      (p) => !isEmptyPrestation(p)
    );

    if (savedPrestations.length > 0) {
      setDisplayPrestationForm(true);
      const currentSavedPrestations = Object.assign(
        [],
        savedPrestations as Prestation[]
      ) as Prestation[];

      currentSavedPrestations.map((p, idx) => {
        setValue(`prestations[${idx}].name`, p.name);
        setValue(`prestations[${idx}].description`, p.description);
        setValue(`prestations[${idx}].durationInMinutes`, p.durationInMinutes);
        setValue(`prestations[${idx}].price`, p.price);
      });

      setPrestations(currentSavedPrestations);
      setPrestationFieldName(`prestations[${currentSavedPrestations.length}]`);
    }
  }, []);

  useEffect(() => {
    if (savedBusinessData) {
      sessionStorage.setItem(
        BUSINESS_DATA_KEY,
        JSON.stringify(savedBusinessData)
      );
    }
  }, [savedBusinessData]);

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
    !prestation ||
    prestation.name.trim() === "" ||
    prestation.description.trim() === "" ||
    !prestation.durationInMinutes ||
    !prestation.price;

  const toDatabaseBusinessWithPrestations = (values) => {
    // TODO : implement image upload
    // formData.append("image", values.businessImage);

    const prestationsToCreate = values.prestations
      .filter((p) => !isEmptyPrestation(p))
      .map((presta) => {
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
      const formValues = Object.assign({}, getValues());
      setSavedBusinessData({
        businessName: formValues.businessName,
        businessDescription: formValues.businessDescription,
        businessImage: formValues.businessImage,
      });
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

        setSavedBusinessData((prevSavedBusinessData) => ({
          ...prevSavedBusinessData,
          prestations: Object.assign(
            [],
            formValues.prestations as Prestation[]
          ),
        }));
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

    sessionStorage.removeItem(BUSINESS_DATA_KEY);
  };

  const goToPreviewBusiness = () => {
    cancelAddPrestationHandler();
  };

  return {
    deletePrestationHandler,
    cancelAddPrestationHandler,
    goToPreviewBusiness,
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
