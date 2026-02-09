import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Divider,
  Chip,
} from "@nextui-org/react";
import Container from "../../components/Container";
import PageTitle from "../../components/PageTitle";
import ControlledInput from "../../components/ControlledInput";
import ControlledTextArea from "../../components/ControlledTextArea";
import { useAuth } from "../../contexts/UserContext";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import { Service } from "./steps/ServicesStep";
import { BsArrowLeft, BsCheckCircle, BsClock, BsCurrencyEuro } from "react-icons/bs";

const publicApiUrl = process.env.PUBLIC_API_URL;

interface EditBusinessFormData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
}

const EditBusiness: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [originalServices, setOriginalServices] = useState<Service[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { businesses, isLoading: isBusinessLoading, refetchBusinesses } = useFetchBusinesses({
    id,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditBusinessFormData>({
    mode: "onChange",
    defaultValues: {
      businessName: "",
      businessDescription: "",
      businessAddress: "",
    },
  });

  // Load business data when available
  useEffect(() => {
    if (businesses?.payload) {
      const business = Array.isArray(businesses.payload)
        ? businesses.payload[0]
        : businesses.payload;

      if (business) {
        reset({
          businessName: business.name || "",
          businessDescription: business.description || "",
          businessAddress: business.address || "",
        });

        // Load existing services
        if (business.services) {
          const loadedServices = business.services.map((s: any) => ({
            name: s.name,
            description: s.description,
            durationInMinutes: String(s.duration),
            price: String((s.price / 100).toFixed(2)),
          }));
          setServices(loadedServices);
          setOriginalServices(loadedServices);
        }
      }
    }
  }, [businesses, reset]);

  // Check if user is authorized to edit this business
  const business = businesses?.payload
    ? Array.isArray(businesses.payload)
      ? businesses.payload[0]
      : businesses.payload
    : null;

  const isOwner = user && business && business.accountId === user.id;

  const handleSaveGeneral = async (data: EditBusinessFormData) => {
    if (!id) return;

    setIsSaving(true);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${publicApiUrl}/business/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.businessName,
          description: data.businessDescription,
          address: data.businessAddress,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Les informations ont été mises à jour avec succès");
        refetchBusinesses();
        // Clear dirty state by resetting form with current values
        reset(data);
      } else {
        const error = await response.json();
        alert(error.message || "Une erreur est survenue lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      alert("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveServices = async () => {
    if (!id) return;

    setIsSaving(true);
    setSuccessMessage(null);

    try {
      // Convert services to API format
      const servicesData = services.map((service) => ({
        name: service.name,
        description: service.description,
        duration: Number.parseInt(service.durationInMinutes),
        price: Number.parseFloat(service.price) * 100, // Convert to cents
      }));

      const response = await fetch(`${publicApiUrl}/business/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          services: servicesData,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Les prestations ont été mises à jour avec succès");
        refetchBusinesses();
        setOriginalServices([...services]);
      } else {
        const error = await response.json();
        alert(error.message || "Une erreur est survenue lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating services:", error);
      alert("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = () => {
    const newService: Service = {
      name: "",
      description: "",
      durationInMinutes: "30",
      price: "0",
    };
    setServices([...services, newService]);
  };

  const handleUpdateService = (index: number, field: keyof Service, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleDeleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const hasServiceChanges = JSON.stringify(services) !== JSON.stringify(originalServices);

  if (isAuthLoading || isBusinessLoading) {
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
          <p className="text-xl">Vous devez être connecté pour modifier cet établissement</p>
          <Button color="primary" onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </div>
      </Container>
    );
  }

  if (!isOwner) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-xl">Vous n'êtes pas autorisé à modifier cet établissement</p>
          <Button color="primary" onClick={() => navigate(`/business/${id}`)}>
            Retour à l'établissement
          </Button>
        </div>
      </Container>
    );
  }

  if (!business) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-xl">Établissement non trouvé</p>
          <Button color="primary" onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto font-onest">
        <div className="p-4">
          {/* Back button */}
          <Button
            variant="light"
            startContent={<BsArrowLeft />}
            onClick={() => navigate(`/business/${id}`)}
            className="mb-4"
          >
            Retour à l'établissement
          </Button>

          <PageTitle title={`Modifier ${business.name}`} />

          {successMessage && (
            <div className="mb-4 bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
              <BsCheckCircle className="text-success text-xl" />
              <p className="text-success">{successMessage}</p>
            </div>
          )}

          <Tabs
            aria-label="Edit business tabs"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="general" title="Informations générales">
              <Card className="mt-4">
                <CardBody>
                  <form onSubmit={handleSubmit(handleSaveGeneral)}>
                    <div className="flex gap-4 mb-6">
                      <ControlledInput
                        control={control}
                        name="businessName"
                        rules={{
                          required: "Veuillez saisir la raison sociale.",
                        }}
                        type="text"
                        label="Raison sociale"
                        placeholder="Ex: Salon Belle Allure"
                        size="sm"
                      />
                    </div>

                    <div className="flex gap-4 mb-6">
                      <ControlledTextArea
                        control={control}
                        name="businessDescription"
                        rules={{
                          required: "Veuillez saisir la description de votre centre.",
                          minLength: {
                            value: 20,
                            message: "La description doit contenir au moins 20 caractères.",
                          },
                        }}
                        label="Description"
                        placeholder="Décrivez votre établissement, vos spécialités, votre ambiance..."
                        minRows={4}
                        size="sm"
                      />
                    </div>

                    <div className="flex gap-4 mb-6">
                      <ControlledInput
                        control={control}
                        name="businessAddress"
                        rules={{
                          required: "Veuillez saisir l'adresse de votre établissement.",
                        }}
                        type="text"
                        label="Adresse"
                        placeholder="Ex: 123 Rue de Paris, 75001 Paris, France"
                        size="sm"
                      />
                    </div>

                    <Divider className="my-6" />

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => navigate(`/business/${id}`)}
                        type="button"
                      >
                        Annuler
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        isLoading={isSaving}
                        isDisabled={!isDirty}
                      >
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="services" title="Prestations">
              <Card className="mt-4">
                <CardBody>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Prestations proposées</h3>
                    <p className="text-sm text-default-500">
                      Gérez les services que vous proposez à vos clients
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-default-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-xs text-default-500 uppercase mb-1 block">
                              Nom de la prestation
                            </label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) =>
                                handleUpdateService(index, "name", e.target.value)
                              }
                              className="w-full p-2 border rounded-md"
                              placeholder="Ex: Coupe homme"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-default-500 uppercase mb-1 block">
                              Prix (€)
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={service.price}
                                onChange={(e) =>
                                  handleUpdateService(index, "price", e.target.value)
                                }
                                className="w-full p-2 border rounded-md pr-8"
                                placeholder="0.00"
                              />
                              <span className="absolute right-3 top-2 text-default-400">€</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="text-xs text-default-500 uppercase mb-1 block">
                            Description
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              handleUpdateService(index, "description", e.target.value)
                            }
                            className="w-full p-2 border rounded-md"
                            rows={2}
                            placeholder="Décrivez cette prestation..."
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-default-500 uppercase">
                              Durée (minutes)
                            </label>
                            <input
                              type="number"
                              min="5"
                              step="5"
                              value={service.durationInMinutes}
                              onChange={(e) =>
                                handleUpdateService(index, "durationInMinutes", e.target.value)
                              }
                              className="w-20 p-1 border rounded-md text-center"
                            />
                          </div>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onClick={() => handleDeleteService(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    onClick={handleAddService}
                    className="w-full mb-6"
                  >
                    + Ajouter une prestation
                  </Button>

                  {services.length > 0 && (
                    <div className="bg-default-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {services.length} prestation{services.length > 1 ? "s" : ""}
                        </span>
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<BsCurrencyEuro size={12} />}
                        >
                          Prix moyen:{" "}
                          {(
                            services.reduce((sum, s) => sum + Number(s.price), 0) /
                            services.length
                          ).toFixed(2)}
                          €
                        </Chip>
                      </div>
                    </div>
                  )}

                  <Divider className="my-6" />

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/business/${id}`)}
                    >
                      Annuler
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSaveServices}
                      isLoading={isSaving}
                      isDisabled={!hasServiceChanges}
                    >
                      Enregistrer les prestations
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </Container>
  );
};

export default EditBusiness;
