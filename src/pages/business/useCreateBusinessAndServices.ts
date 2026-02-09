import { useEffect, useState } from "react";
import { businessValidation } from "./businessValidation";
import useMutateBusiness from "../../hooks/useMutateBusiness";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface Prestation {
  name: string;
  description: string;
  durationInMinutes: string;
  price: string;
}

interface DatabasePrestation {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface BusinessFormData {
  businessName: string;
  businessDescription: string;
  businessImage?: File;
  prestations: Prestation[];
}

type FormMethods = Pick<UseFormReturn<FieldValues>, 'getValues' | 'unregister' | 'setValue' | 'trigger' | 'reset'> & {
  isSubmitSuccessful: boolean;
};

const useCreateBusinessAndService = (form: FormMethods) => {
  const { getValues, unregister, setValue, trigger, reset, isSubmitSuccessful } = form;
  const [displayPrestationForm, setDisplayPrestationForm] = useState(false);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [isPrestationValid, setIsPrestationValid] = useState(false);
  const { mutateBusiness } = useMutateBusiness();
  const [prestationFieldName, setPrestationFieldName] = useState(
    `prestations[${prestations.length}]`
  );

  const BUSINESS_DATA_KEY = "new_business_data";

  // Safely parse sessionStorage data with validation
  const parseStoredData = (): Record<string, unknown> => {
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
      return parsed as Record<string, unknown>;
    } catch (error) {
      console.error("Error parsing session storage:", error);
      sessionStorage.removeItem(BUSINESS_DATA_KEY);
      return {};
    }
  };

  const [savedBusinessData, setSavedBusinessData] = useState<Record<string, unknown>>(parseStoredData());

  useEffect(() => {
    console.log("initial effect");
    setValue("businessName", savedBusinessData?.businessName);
    setValue("businessDescription", savedBusinessData?.businessDescription);
    setValue("businessImage", savedBusinessData?.businessImage);

    const savedPrestations = ((savedBusinessData?.prestations as Prestation[]) || []).filter(
      (p: Prestation) => !isEmptyPrestation(p)
    );

    if (savedPrestations.length > 0) {
      setDisplayPrestationForm(true);
      const currentSavedPrestations = Object.assign(
        [],
        savedPrestations as Prestation[]
      ) as Prestation[];

      currentSavedPrestations.map((p: Prestation, idx: number) => {
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

  const toDatabasePrestation = (values: Prestation): DatabasePrestation => {
    const prestation = {
      name: values.name,
      description: values.description,
      duration: Number.parseInt(values.durationInMinutes),
      price: Number.parseFloat(values.price) * 100,
    };

    return prestation;
  };

  const isEmptyPrestation = (prestation: Prestation | null | undefined): boolean =>
    !prestation ||
    prestation.name.trim() === "" ||
    prestation.description.trim() === "" ||
    !prestation.durationInMinutes ||
    !prestation.price;

  const toDatabaseBusinessWithPrestations = (values: BusinessFormData) => {
    // TODO : implement image upload
    // formData.append("image", values.businessImage);

    const prestationsToCreate = values.prestations
      .filter((p: Prestation) => !isEmptyPrestation(p))
      .map((presta: Prestation) => {
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
      const formValues = Object.assign({}, getValues()) as BusinessFormData;
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
        const formValues = Object.assign({}, getValues()) as BusinessFormData;
        setPrestations([...(formValues.prestations as Prestation[])]);

        setSavedBusinessData((prevSavedBusinessData: Record<string, unknown>) => ({
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

  const deletePrestationHandler = (index: number) => {
    const newPrestations = prestations.filter((prest: Prestation, idx: number) => idx !== index);
    setPrestations((prev: Prestation[]) => [...prev.filter((prest: Prestation, idx: number) => idx !== index)]);
    setValue("prestations", newPrestations);
    setPrestationFieldName(`prestations[${prestations.length - 1}]`);
  };

  const createBusiness = async (values: BusinessFormData) => {
    // création du business
    mutateBusiness(toDatabaseBusinessWithPrestations(values) as unknown as Parameters<typeof mutateBusiness>[0]);

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
