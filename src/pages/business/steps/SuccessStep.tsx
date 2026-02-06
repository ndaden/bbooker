import React from "react";
import { Button, Chip, Divider } from "@nextui-org/react";
import { BsCheckCircleFill, BsClock, BsCurrencyEuro } from "react-icons/bs";
import { Service } from "./ServicesStep";

interface SuccessStepProps {
  businessName: string;
  businessDescription: string;
  services: Service[];
  businessId?: string;
  onGoToHome: () => void;
  onGoToBusiness: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  businessName,
  businessDescription,
  services,
  businessId,
  onGoToHome,
  onGoToBusiness,
}) => {
  const totalServices = services.length;

  return (
    <div className="text-center">
      {/* Success Icon and Message */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-success/10 p-6 rounded-full">
            <BsCheckCircleFill className="text-success text-6xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-success mb-2">
          Félicitations !
        </h2>
        <p className="text-lg text-default-600">
          Votre établissement a été créé avec succès
        </p>
      </div>

      {/* Business Summary */}
      <div className="text-left mb-8">
        <div className="bg-default-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            {businessName}
          </h3>
          
          <Divider className="my-4" />
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-default-500 uppercase tracking-wide block mb-1">
                Description
              </label>
              <p className="text-sm text-default-700">{businessDescription}</p>
            </div>

            <Divider />

            <div>
              <label className="text-xs text-default-500 uppercase tracking-wide block mb-2">
                Prestations créées
              </label>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-white/50 p-3 rounded border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-default-500 truncate">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Chip 
                        size="sm" 
                        variant="flat"
                        startContent={<BsClock size={10} />}
                      >
                        {service.durationInMinutes}min
                      </Chip>
                      <Chip 
                        size="sm" 
                        color="success" 
                        variant="flat"
                        startContent={<BsCurrencyEuro size={10} />}
                      >
                        {service.price}€
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary/10 p-3 rounded">
                <p className="text-xs text-default-500 uppercase">Total prestations</p>
                <p className="text-2xl font-bold text-primary">{totalServices}</p>
              </div>
              <div className="bg-success/10 p-3 rounded">
                <p className="text-xs text-default-500 uppercase">Statut</p>
                <p className="text-sm font-semibold text-success mt-1">✓ Publié</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-sm mb-2">📋 Prochaines étapes</h4>
        <ul className="text-sm text-default-600 space-y-1">
          <li>• Votre établissement est maintenant visible sur BeautyBooker</li>
          <li>• Les clients peuvent désormais réserver vos prestations</li>
          <li>• Vous pouvez gérer vos rendez-vous depuis votre espace professionnel</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="flat"
          size="lg"
          onClick={onGoToHome}
        >
          Retour à l'accueil
        </Button>
        {businessId && (
          <Button
            color="primary"
            size="lg"
            onClick={onGoToBusiness}
          >
            Voir mon établissement
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessStep;
