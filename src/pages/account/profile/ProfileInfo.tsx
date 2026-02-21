import React, { useState, useEffect } from "react";
import { User } from "../../../types/auth";
import { Input, Button, Card, CardBody, Tabs, Tab } from "@heroui/react";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import AccountBusinesses from "../AccountBusinesses";
import UserAppointments from "../UserAppointments";
import ControlledFileInput from "../../../components/ControlledFileInput";
import ControlledInput from "../../../components/ControlledInput";
import dayjs from "dayjs";
import { authService } from "../../../lib/api/services";
import { useDeleteProfileImage } from "../../../hooks/useDeleteProfileImage";
import { FaTrash } from "react-icons/fa";

interface ProfileInfoProps {
  user: User;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  profileImage: File | null;
}

interface PasswordFormData {
  password: string;
  newPassword: string;
  newPasswordAgain: string;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("infos");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const isOwner = user.role === "OWNER";

  // Handle active tab from navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setSelectedTab(location.state.activeTab);
      // Clear the state to prevent tab staying active on subsequent visits
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { mutate: deleteProfileImage, isPending: isDeletingImage } = useDeleteProfileImage();

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user.profile?.firstName || "",
      lastName: user.profile?.lastName || "",
      birthDate: dayjs(user.profile?.birthDate).format("YYYY-MM-DD") || "",
      address: user.profile?.address || "",
      phoneNumber: user.profile?.phoneNumber || "",
      profileImage: null,
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>({
    defaultValues: {
      password: "",
      newPassword: "",
      newPasswordAgain: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("profile", JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }));
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      await authService.updateProfile(formData);
      addToast({
        title: "Succès",
        description: "Votre profil a été mis à jour",
        color: "success",
      });
      await queryClient.invalidateQueries({ queryKey: ["AUTHENTICATED_USER"] });
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        color: "danger",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const newPasswordAgain = watch("newPasswordAgain");

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("newPassword", data.newPassword);
      formData.append("newPasswordAgain", data.newPasswordAgain);

      await authService.updateProfile(formData);
      addToast({
        title: "Succès",
        description: "Votre mot de passe a été mis à jour",
        color: "success",
      });
      resetPassword();
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        color: "danger",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteProfileImage = () => {
    deleteProfileImage(undefined, {
      onSuccess: () => {
        addToast({
          title: "Succès",
          description: "Photo de profil supprimée",
          color: "success",
        });
      },
      onError: (error: any) => {
        addToast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          color: "danger",
        });
      },
    });
  };

  return (
    <div>
      <Card>
        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            fullWidth
            size="sm"
            className="mb-6"
          >
            <Tab key="infos" title="Informations">
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6 min-h-[400px]">
                <ControlledInput
                  control={profileControl}
                  name="firstName"
                  label="Prénom"
                  placeholder="Votre prénom"
                  size="sm"
                />
                <ControlledInput
                  control={profileControl}
                  name="lastName"
                  label="Nom"
                  placeholder="Votre nom"
                  size="sm"
                />
                <ControlledInput
                  control={profileControl}
                  name="birthDate"
                  type="date"
                  label="Date de naissance"
                  size="sm"
                />
                <ControlledInput
                  control={profileControl}
                  name="address"
                  label="Adresse"
                  placeholder="Votre adresse complète"
                  size="sm"
                />
                <ControlledInput
                  control={profileControl}
                  name="phoneNumber"
                  label="Téléphone"
                  placeholder="Votre numéro de téléphone"
                  size="sm"
                />
                <ControlledFileInput
                  control={profileControl}
                  name="profileImage"
                  type="file"
                  label="Photo de profil"
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
                {user.profile?.profileImage && (
                  <div className="flex items-center gap-4 mt-4">
                    <div className="text-sm">
                      <p className="text-gray-600 mb-2">Photo actuelle:</p>
                      <img src={user.profile.profileImage} alt="Photo de profil" className="w-20 h-20 rounded-lg object-cover" />
                    </div>
                    <Button
                      color="danger"
                      variant="light"
                      isDisabled={isDeletingImage}
                      onPress={handleDeleteProfileImage}
                      startContent={<FaTrash />}
                    >
                      {isDeletingImage ? "Suppression..." : "Supprimer la photo"}
                    </Button>
                  </div>
                )}
                <Input
                  label="Email"
                  value={user.email}
                  isReadOnly
                  size="sm"
                  description="Votre adresse email ne peut pas être modifiée"
                />
                <Button color="primary" type="submit" fullWidth isLoading={isSavingProfile}>
                  Enregistrer les modifications
                </Button>
              </form>
            </Tab>

            <Tab key="security" title="Sécurité">
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6 min-h-[400px]">
                <ControlledInput
                  control={passwordControl}
                  name="password"
                  type="password"
                  label="Mot de passe actuel"
                  placeholder="Entrez votre mot de passe actuel"
                  size="sm"
                />
                <ControlledInput
                  control={passwordControl}
                  name="newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                  placeholder="Entrez votre nouveau mot de passe"
                  size="sm"
                  rules={{
                    minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" },
                  }}
                />
                <ControlledInput
                  control={passwordControl}
                  name="newPasswordAgain"
                  type="password"
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre nouveau mot de passe"
                  size="sm"
                  rules={{
                    validate: (value) => value === newPasswordAgain || "Les mots de passe ne correspondent pas",
                  }}
                />
                <Button color="primary" type="submit" fullWidth isLoading={isChangingPassword}>
                  Changer le mot de passe
                </Button>
              </form>
            </Tab>

            <Tab key="appointments" title="Mes rendez-vous">
              <div className="min-h-[400px]">
                <p className="mb-4 text-gray-600">
                  Consultez et gérez tous vos rendez-vous passés et à venir
                </p>
                <UserAppointments user={user} />
              </div>
            </Tab>

            {isOwner && (
              <Tab key="centres" title="Centres">
                <div className="min-h-[400px]">
                  <p className="mb-4 text-gray-600">
                    Gérez vos établissements et créez de nouveaux centres
                  </p>
                  <Button
                    color="primary"
                    onClick={() => navigate("/new-business")}
                    className="mb-6"
                  >
                    + Créer un nouveau centre
                  </Button>
                  <AccountBusinesses user={user} />
                </div>
              </Tab>
            )}
          </Tabs>

          <Button
            className="mt-4"
            variant="ghost"
            color="danger"
            fullWidth
            onClick={() => logout("/")}
          >
            Se déconnecter
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileInfo;
