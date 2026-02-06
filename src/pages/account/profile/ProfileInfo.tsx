import React, { useState } from "react";
import { User } from "../../../types/auth";
import { Input, Button, Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { useAuth } from "../../../contexts/UserContext";
import dayjs from "dayjs";

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("infos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update profile would go here
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update password would go here
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
              <form onSubmit={handleSubmit} className="space-y-6 min-h-[400px]">
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Prénom"
                    placeholder="Votre prénom"
                    defaultValue={user.profile?.firstName || ""}
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Nom"
                    placeholder="Votre nom"
                    defaultValue={user.profile?.lastName || ""}
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    type="date"
                    label="Date de naissance"
                    defaultValue={dayjs(user.profile?.birthDate).format("YYYY-MM-DD") || ""}
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Adresse"
                    placeholder="Votre adresse complète"
                    defaultValue={user.profile?.address || ""}
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Email"
                    value={user.email}
                    isReadOnly
                    size="sm"
                    description="Votre adresse email ne peut pas être modifiée"
                  />
                </div>
                <Button color="primary" type="submit" fullWidth>
                  Enregistrer les modifications
                </Button>
              </form>
            </Tab>

            <Tab key="security" title="Sécurité">
              <form onSubmit={handlePasswordSubmit} className="space-y-6 min-h-[400px]">
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Mot de passe actuel"
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    size="sm"
                  />
                </div>
                <div className="flex gap-4 mb-6">
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                    size="sm"
                  />
                </div>
                <Button color="primary" type="submit" fullWidth>
                  Changer le mot de passe
                </Button>
              </form>
            </Tab>
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
