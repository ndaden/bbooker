import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "@heroui/react";
import Container from "../../components/Container";
import PageTitle from "../../components/PageTitle";
import Stepper from "../../components/Stepper";
import GeneralInfoStep from "./steps/GeneralInfoStep";
import ServicesStep, { Service } from "./steps/ServicesStep";
import PreviewStep from "./steps/PreviewStep";
import SuccessStep from "./steps/SuccessStep";
import useMutateBusiness from "../../hooks/useMutateBusiness";
import { useAuth } from "../../contexts/UserContext";
import { businessService } from "../../lib/api/services";
import { addToast } from "@heroui/react";

interface BusinessFormData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  keywords: string[];
  businessImage: File | null;
}

const CreateBusinessNew: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<BusinessFormData>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      businessDescription: "",
      businessAddress: "",
      keywords: [],
      businessImage: null,
    },
  });

  const { mutateBusiness, isLoading: isCreating } = useMutateBusiness() as any;

  const steps = [
    { label: "Informations", description: "Détails de base" },
    { label: "Prestations", description: "Services proposés" },
    { label: "Aperçu", description: "Vérification" },
    { label: "Confirmation", description: "Succès" },
  ];

  const handleNext = async () => {
    let isValid = true;

    if (currentStep === 0) {
      // Validate general info
      isValid = await trigger(["businessName", "businessDescription", "businessAddress"]);
    } else if (currentStep === 1) {
      // Validate services
      isValid = services.length > 0;
      if (!isValid) {
        alert("Veuillez ajouter au moins une prestation");
      }
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const handleDeleteService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords((prev) => [...prev, keyword]);
      setValue("keywords", [...keywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keywordToRemove));
    setValue(
      "keywords",
      keywords.filter((k) => k !== keywordToRemove)
    );
  };

  const handleCreateBusiness = async () => {
    if (services.length === 0) {
      alert("Veuillez ajouter au moins une prestation");
      return;
    }

    const formData = getValues();
    const formDataForUpload = new FormData();
    formDataForUpload.append("name", formData.businessName);
    formDataForUpload.append("description", formData.businessDescription);
    formDataForUpload.append("address", formData.businessAddress);
    formDataForUpload.append("keywords", JSON.stringify(keywords));
    if (formData.businessImage) {
      formDataForUpload.append("image", formData.businessImage);
    }
    formDataForUpload.append("services", JSON.stringify(services.map((service) => ({
      name: service.name,
      description: service.description,
      duration: Number.parseInt(service.durationInMinutes),
      price: Number.parseFloat(service.price) * 100,
    }))));

    setIsSubmitting(true);
    try {
      const response = await businessService.create(formDataForUpload);
      
      if (response?.success && response?.payload?.id) {
        addToast({
          title: "Succès",
          description: "Votre établissement a été créé",
          color: "success",
        });
        setCreatedBusinessId(response.payload.id);
        setCurrentStep(3);
      }
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <p>Chargement...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-xl">Vous devez être connecté pour créer un établissement</p>
          <Button color="primary" onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto font-onest">
        <div className="p-4">
          <PageTitle title="Créer votre établissement" />
          <p>
            Configurez votre établissement en quelques étapes simples
          </p>

          <div className="my-5">
            {/* Stepper */}
            <Stepper steps={steps} currentStep={currentStep} className="mb-6" />

            {/* Form */}
            <Card>
              <CardBody>
                <div>
                  <div className="min-h-[400px]">
                    {/* Step 0: General Info */}
                    {currentStep === 0 && (
                      <GeneralInfoStep
                        control={control}
                        errors={errors}
                        keywords={keywords}
                        onAddKeyword={handleAddKeyword}
                        onRemoveKeyword={handleRemoveKeyword}
                      />
                    )}

                    {/* Step 1: Services */}
                    {currentStep === 1 && (
                      <ServicesStep
                        services={services}
                        onAddService={handleAddService}
                        onDeleteService={handleDeleteService}
                      />
                    )}

                    {/* Step 2: Preview */}
                    {currentStep === 2 && (
                      <PreviewStep
                        businessName={getValues("businessName")}
                        businessDescription={getValues("businessDescription")}
                        businessAddress={getValues("businessAddress")}
                        keywords={keywords}
                        services={services}
                      />
                    )}

                    {/* Step 3: Success */}
                    {currentStep === 3 && (
                      <SuccessStep
                        businessName={getValues("businessName")}
                        businessDescription={getValues("businessDescription")}
                        services={services}
                        businessId={createdBusinessId || undefined}
                        onGoToHome={() => navigate("/")}
                        onGoToBusiness={() => createdBusinessId && navigate(`/business/${createdBusinessId}`)}
                      />
                    )}
                  </div>

                  {/* Navigation Buttons - Hide on success step */}
                  {currentStep !== 3 && (
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button
                        variant="flat"
                        onClick={handleBack}
                        isDisabled={currentStep === 0}
                        type="button"
                      >
                        Retour
                      </Button>

                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => navigate("/")}
                          type="button"
                        >
                          Annuler
                        </Button>

                        {currentStep < 2 ? (
                          <Button
                            color="primary"
                            onClick={handleNext}
                            type="button"
                          >
                            Continuer
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            onClick={handleCreateBusiness}
                            isLoading={isSubmitting}
                            type="button"
                          >
                            Créer mon établissement
                          </Button>
  )}

                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateBusinessNew;
