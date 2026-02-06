import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfileSecurity = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 border-b border-divider pb-4">
        <h2 className="text-xl font-bold mb-1">Mot de passe & Sécurité</h2>
        <p className="text-sm text-default-500">
          Mettez à jour votre mot de passe pour sécuriser votre compte.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-default-50 p-6 rounded-lg border border-default-200 dark:border-default-100">
          <Input
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe actuel"
            variant="bordered"
            labelPlacement="outside"
            radius="sm"
            className="mb-6 max-w-md"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => togglePassword("current")}
                aria-label="toggle password visibility"
              >
                {showPasswords.current ? (
                  <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                ) : (
                  <FaEye className="text-xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={showPasswords.current ? "text" : "password"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nouveau mot de passe"
              placeholder="Nouveau mot de passe"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => togglePassword("new")}
                  aria-label="toggle password visibility"
                >
                  {showPasswords.new ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={showPasswords.new ? "text" : "password"}
            />
            
            <Input
              label="Confirmer le nouveau mot de passe"
              placeholder="Répétez le mot de passe"
              variant="bordered"
              labelPlacement="outside"
              radius="sm"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  aria-label="toggle password visibility"
                >
                  {showPasswords.confirm ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={showPasswords.confirm ? "text" : "password"}
            />
          </div>
          
          <div className="mt-4 text-xs text-default-400">
            Votre mot de passe doit contenir au moins 8 caractères.
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            color="primary"
            type="submit"
            className="px-6 font-medium"
          >
            Mettre à jour le mot de passe
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSecurity;
