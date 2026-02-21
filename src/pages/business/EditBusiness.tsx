import React, { useEffect, useState } from "react";
import { useForm, Control, FieldValues } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Divider,
  Chip,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import Container from "../../components/Container";
import PageTitle from "../../components/PageTitle";
import ControlledInput from "../../components/ControlledInput";
import ControlledTextArea from "../../components/ControlledTextArea";
import ControlledFileInput from "../../components/ControlledFileInput";
import KeywordsInput from "../../components/form/KeywordsInput";
import { useAuth } from "../../contexts/UserContext";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import { Service } from "./steps/ServicesStep";
import { BsArrowLeft, BsCheckCircle, BsClock, BsCurrencyEuro } from "react-icons/bs";
import { businessService } from "../../lib/api/services";

const publicApiUrl = process.env.PUBLIC_API_URL;

interface EditBusinessFormData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessImage: File | null;
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
  const [keywords, setKeywords] = useState<string[]>([]);
  const [originalKeywords, setOriginalKeywords] = useState<string[]>([]);

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

        // Load existing keywords
        if (business.keywords) {
          setKeywords(business.keywords);
          setOriginalKeywords(business.keywords);
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
      // Always use FormData when we have image or other file upload
      const formData = new FormData();
      formData.append("name", data.businessName);
      formData.append("description", data.businessDescription);
      formData.append("address", data.businessAddress);
      formData.append("keywords", JSON.stringify(keywords));
      if (data.businessImage) {
        formData.append("image", data.businessImage);
      }

      const response = await businessService.update(id, formData);
      
      if (response.success) {
        addToast({
          title: "Succès",
          description: "Les informations ont été mises à jour avec succès",
          color: "success",
        });
        setSuccessMessage("Les informations ont été mises à jour avec succès");
        refetchBusinesses();
        // Clear dirty state by resetting form with current values, but don't reset image field
        const { businessImage, ...restData } = data;
        reset({ ...restData, businessImage: null });
        setOriginalKeywords([...keywords]);
      }
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        color: "danger",
      });
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

  const handleAddKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const hasServiceChanges = JSON.stringify(services) !== JSON.stringify(originalServices);
  const hasKeywordChanges = JSON.stringify(keywords) !== JSON.stringify(originalKeywords);

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
                        control={control as unknown as Control<FieldValues>}
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
                        control={control as unknown as Control<FieldValues>}
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
                        control={control as unknown as Control<FieldValues>}
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

                    <div className="flex gap-4 mb-6">
                      <div className="w-full">
                        <label className="text-sm font-medium mb-2 block">
                          Mots-clés
                        </label>
                        <KeywordsInput
                          control={control as unknown as Control<FieldValues>}
                          errors={errors}
                          keywords={keywords}
                          onAddKeyword={handleAddKeyword}
                          onRemoveKeyword={handleRemoveKeyword}
                        />
                      </div>
                    </div>

                    <ControlledFileInput
                      control={control as unknown as Control<FieldValues>}
                      name="businessImage"
                      type="file"
                      label="Photo de couverture"
                      rules={{
                        validate: (value: File | null) => {
                          if (!value || value.size === 0) return true;
                          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                          if (!validTypes.includes(value.type)) {
                            return "Format non supporté. Utilisez JPG, PNG ou WEBP";
                          }
                          if (value.size > 2 * 1024 * 1024) {
                            return "L'image ne doit pas dépasser 2MB";
                          }
                          return true;
                        },
                      }}
                    />
                    {business?.image && (
                      <div className="text-sm text-gray-500 mb-6">
                        Photo actuelle: <img src={business.image} alt="Photo de couverture" className="w-20 h-20 rounded-lg object-cover" />
                      </div>
                    )}

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
                        isDisabled={!isDirty && !hasKeywordChanges}
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
                <CardBody className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Prestations proposées</h3>
                    <p className="text-sm text-default-500">
                      Gérez les services que vous proposez à vos clients
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="group bg-default-100/50 rounded-lg p-4 border border-default-200 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) =>
                                handleUpdateService(index, "name", e.target.value)
                              }
                              className="flex-1 text-sm font-medium bg-transparent border-b border-transparent hover:border-default-300 focus:border-primary focus:outline-none transition-colors"
                              placeholder="Nom de la prestation"
                            />
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onClick={() => handleDeleteService(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity min-w-0 w-7 h-7"
                          >
                            ×
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="relative">
                            <label className="text-xs text-default-500 uppercase mb-1 block">
                              Prix
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
                                className="w-full p-2 px-3 bg-default-100 rounded border-0 text-sm focus:ring-1 focus:ring-primary/30 transition-all"
                                placeholder="0.00"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 text-xs">€</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-default-500 uppercase mb-1 block">
                              Durée
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="5"
                                step="5"
                                value={service.durationInMinutes}
                                onChange={(e) =>
                                  handleUpdateService(index, "durationInMinutes", e.target.value)
                                }
                                className="flex-1 p-2 px-3 bg-default-100 rounded border-0 text-sm text-center focus:ring-1 focus:ring-primary/30 transition-all"
                              />
                              <span className="text-xs text-default-500">min</span>
                            </div>
                          </div>

                          <div className="flex items-end">
                            <div className="flex items-center gap-1.5 text-default-500 text-xs">
                              <BsClock className="text-primary" size={14} />
                              <span>
                                {Math.floor(Number(service.durationInMinutes) / 60) > 0 && (
                                  <>{Math.floor(Number(service.durationInMinutes) / 60)}h </>
                                )}
                                {Number(service.durationInMinutes) % 60 > 0 && (
                                  <>{Number(service.durationInMinutes) % 60}min</>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-default-500 uppercase mb-1 block">
                            Description
                          </label>
                          <textarea
                            value={service.description}
                            onChange={(e) =>
                              handleUpdateService(index, "description", e.target.value)
                            }
                            className="w-full p-2 px-3 bg-default-100 rounded border-0 text-sm focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                            rows={2}
                            placeholder="Description de la prestation..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="flat"
                    color="primary"
                    onClick={handleAddService}
                    className="w-full mb-4 border border-dashed border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
                    size="sm"
                  >
                    <span className="flex items-center gap-1 text-sm">
                      <span className="text-lg">+</span>
                      Ajouter une prestation
                    </span>
                  </Button>

                  {services.length > 0 && (
                    <div className="bg-default-100 rounded-lg p-4 border border-default-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-default-200 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{services.length}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {services.length} prestation{services.length > 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-default-500">
                              Prix moyen: {(
                                services.reduce((sum, s) => sum + Number(s.price), 0) /
                                services.length
                              ).toFixed(2)}€
                            </p>
                          </div>
                        </div>
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<BsCurrencyEuro size={12} />}
                          className="font-medium"
                        >
                          {services.reduce((sum, s) => sum + Number(s.price), 0).toFixed(2)}€ total
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
