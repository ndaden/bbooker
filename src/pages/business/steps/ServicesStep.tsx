import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { BsClock, BsCurrencyEuro, BsTrash, BsPlus } from "react-icons/bs";

export interface Service {
  name: string;
  description: string;
  durationInMinutes: string;
  price: string;
}

interface ServicesStepProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onDeleteService: (index: number) => void;
}

const ServicesStep: React.FC<ServicesStepProps> = ({
  services,
  onAddService,
  onDeleteService,
}) => {
  const [newService, setNewService] = useState<Service>({
    name: "",
    description: "",
    durationInMinutes: "",
    price: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Service, string>>>(
    {}
  );

  const validateService = (): boolean => {
    const newErrors: Partial<Record<keyof Service, string>> = {};

    if (!newService.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!newService.description.trim()) {
      newErrors.description = "La description est requise";
    }
    if (!newService.durationInMinutes || Number(newService.durationInMinutes) <= 0) {
      newErrors.durationInMinutes = "La durée doit être supérieure à 0";
    }
    if (!newService.price || Number(newService.price) <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = () => {
    if (validateService()) {
      onAddService({ ...newService });
      setNewService({
        name: "",
        description: "",
        durationInMinutes: "",
        price: "",
      });
      setErrors({});
    }
  };

  return (
    <div>
      {/* Form to add new service */}
      <div className="mb-8">
        <h4 className="text-sm font-medium mb-4">
          Ajouter une prestation
        </h4>

        <div className="flex gap-4 mb-6">
          <Input
            label="Nom de la prestation"
            placeholder="Ex: Coupe femme"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            size="sm"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <Textarea
            label="Description"
            placeholder="Décrivez cette prestation..."
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
            isInvalid={!!errors.description}
            errorMessage={errors.description}
            minRows={2}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            label="Durée (minutes)"
            placeholder="30"
            type="number"
            value={newService.durationInMinutes}
            onChange={(e) =>
              setNewService({
                ...newService,
                durationInMinutes: e.target.value,
              })
            }
            isInvalid={!!errors.durationInMinutes}
            errorMessage={errors.durationInMinutes}
            size="sm"
          />

          <Input
            label="Prix (€)"
            placeholder="25.00"
            type="number"
            step="0.01"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
            isInvalid={!!errors.price}
            errorMessage={errors.price}
            size="sm"
          />
        </div>

        <Button
          color="primary"
          startContent={<BsPlus size={20} />}
          onClick={handleAddService}
          fullWidth
        >
          Ajouter cette prestation
        </Button>
      </div>

      {/* Services list */}
      <div>
        <h4 className="text-sm font-medium mb-4">
          Prestations ajoutées ({services.length})
        </h4>

        {services.length === 0 ? (
          <div className="text-center py-8 text-default-400 border-2 border-dashed rounded-lg">
            <p>Aucune prestation ajoutée pour le moment</p>
            <p className="text-sm mt-2">
              Ajoutez votre première prestation ci-dessus
            </p>
          </div>
        ) : (
          <Table aria-label="Services table">
            <TableHeader>
              <TableColumn>PRESTATION</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
              <TableColumn>DURÉE</TableColumn>
              <TableColumn>PRIX</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="text-sm text-default-500 max-w-xs truncate">
                    {service.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BsClock size={14} className="text-default-400" />
                      <span>{service.durationInMinutes} min</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      <BsCurrencyEuro size={14} className="text-success" />
                      <span>{service.price}€</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => onDeleteService(index)}
                    >
                      <BsTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ServicesStep;
