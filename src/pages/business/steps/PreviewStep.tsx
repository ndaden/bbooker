import React from "react";
import { Chip, Divider } from "@nextui-org/react";
import { BsClock, BsCurrencyEuro, BsCheckCircle, BsGeoAlt } from "react-icons/bs";
import { Service } from "./ServicesStep";

interface PreviewStepProps {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  services: Service[];
}

const PreviewStep: React.FC<PreviewStepProps> = ({
  businessName,
  businessDescription,
  businessAddress,
  services,
}) => {
  const totalServices = services.length;
  const averagePrice =
    services.length > 0
      ? (
          services.reduce((sum, s) => sum + Number(s.price), 0) / services.length
        ).toFixed(2)
      : "0.00";

  return (
    <div>
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6 bg-warning/10 p-4 rounded-lg border border-warning/20">
        <BsCheckCircle className="text-warning text-2xl flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-warning">Vérifiez avant de créer</h3>
          <p className="text-sm text-default-500">
            Assurez-vous que toutes les informations sont correctes
          </p>
        </div>
      </div>

      {/* Business info section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-default-600 uppercase mb-4">
          Informations générales
        </h4>
        
        <div className="space-y-4 bg-default-50 p-4 rounded-lg">
          <div>
            <label className="text-xs text-default-500 uppercase tracking-wide">
              Raison sociale
            </label>
            <p className="text-base font-semibold mt-1">{businessName}</p>
          </div>

          <Divider />

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wide">
              Description
            </label>
            <p className="text-base mt-1 leading-relaxed">{businessDescription}</p>
          </div>

          <Divider />

          <div>
            <label className="text-xs text-default-500 uppercase tracking-wide">
              Adresse
            </label>
            <div className="flex items-center gap-2 mt-1">
              <BsGeoAlt className="text-primary" />
              <p className="text-base">{businessAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-default-600 uppercase">
            Prestations proposées
          </h4>
          <div className="flex gap-2">
            <Chip size="sm" variant="flat" color="primary">
              {totalServices} prestation{totalServices > 1 ? "s" : ""}
            </Chip>
            <Chip size="sm" variant="flat" color="success">
              Moy: {averagePrice}€
            </Chip>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="bg-default-50 border rounded-lg p-4 hover:bg-default-100 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-default-400">#{index + 1}</span>
                    <h5 className="font-semibold text-base">{service.name}</h5>
                  </div>
                  <p className="text-sm text-default-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<BsClock size={12} />}
                  >
                    {service.durationInMinutes} min
                  </Chip>
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                    startContent={<BsCurrencyEuro size={12} />}
                    className="font-semibold"
                  >
                    {service.price}€
                  </Chip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold mb-3">Statistiques</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-default-500 uppercase">Total prestations</p>
            <p className="text-lg font-bold text-primary">{totalServices}</p>
          </div>
          <div>
            <p className="text-xs text-default-500 uppercase">Prix moyen</p>
            <p className="text-lg font-bold text-success">{averagePrice}€</p>
          </div>
          <div>
            <p className="text-xs text-default-500 uppercase">Durée min</p>
            <p className="text-lg font-bold">{Math.min(...services.map((s) => Number(s.durationInMinutes)))} min</p>
          </div>
          <div>
            <p className="text-xs text-default-500 uppercase">Durée max</p>
            <p className="text-lg font-bold">{Math.max(...services.map((s) => Number(s.durationInMinutes)))} min</p>
          </div>
        </div>
      </div>

      {/* Confirmation message */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
        <p className="text-sm text-default-700">
          ℹ️ En cliquant sur <strong>"Créer mon établissement"</strong>, ces informations seront enregistrées et publiées sur BeautyBooker.
        </p>
      </div>
    </div>
  );
};

export default PreviewStep;
