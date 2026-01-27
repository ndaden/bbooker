import React from "react";
import ControlledInput from "../../components/ControlledInput";
import { Accordion, AccordionItem, Button, Chip } from "@nextui-org/react";
import { IoMdAddCircle } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { BsClock } from "react-icons/bs";
import { BsCurrencyEuro } from "react-icons/bs";
const PrestationsSection = ({
  prestationFieldName,
  hidden,
  validation,
  control,
  prestations,
  addPrestationHandler,
  deletePrestationHandler,
}) => {
  return (
    <div className="my-5">
      <div className={`my-5 ${hidden ? "hidden" : ""}`}>
        <div className="text-2xl">Prestations</div>
        <div className="my-4">
          Saisissez les informations à propos de votre prestation puis appuyez
          sur <span className="font-bold">Ajouter</span>.<br />
          Une fois que vous avez ajouté toutes vos prestations appuyez sur{" "}
          <span className="font-bold">Continuer</span>.
        </div>
        <div>
          <fieldset name={`${prestationFieldName}`}>
            <ControlledInput
              name={`${prestationFieldName}.name`}
              rules={validation[`${prestationFieldName}.name`]}
              control={control}
              type="text"
              label="Libellé de prestation"
              className="my-4"
            />
            <ControlledInput
              name={`${prestationFieldName}.description`}
              rules={validation[`${prestationFieldName}.description`]}
              control={control}
              type="text"
              label="Description de la prestation"
              className="my-4"
            />

            <ControlledInput
              name={`${prestationFieldName}.durationInMinutes`}
              rules={validation[`${prestationFieldName}.durationInMinutes`]}
              control={control}
              type="text"
              label="Durée"
              className="my-4"
              minLength={2}
              maxLength={3}
            />

            <ControlledInput
              name={`${prestationFieldName}.price`}
              rules={validation[`${prestationFieldName}.price`]}
              control={control}
              type="text"
              label="Prix"
              className="my-4"
              minLength={1}
              maxLength={5}
            />
          </fieldset>
        </div>

        <div className="flex">
          <Button
            color="secondary"
            fullWidth
            size="lg"
            onClick={addPrestationHandler}
          >
            <IoMdAddCircle size="25" /> Ajouter
          </Button>
        </div>
        <div className="text-2xl my-4">Vos prestations</div>
        {prestations.length === 0 && (
          <div className="italic">
            La liste de vos prestations s'affichera ici
          </div>
        )}
        {prestations.length > 0 && (
          <Accordion>
            {prestations.map((prestation, idx) => (
              <AccordionItem
                key={prestation.name}
                title={
                  <div className="text-xl font-bold">
                    <div>{prestation.name}</div>
                  </div>
                }
                textValue={prestation.name}
                className="p-2 bg-zinc-900"
              >
                <div>
                  <div className="pb-3">{prestation.description}</div>

                  <div className="flex justify-between">
                    <div>
                      <Chip>
                        <BsClock size="15" className="inline" />
                        &nbsp;
                        {prestation.durationInMinutes} min
                      </Chip>
                      &nbsp;
                      <Chip color="primary" className="ml-3">
                        <BsCurrencyEuro size="15" className="inline" />
                        &nbsp;{prestation.price}
                      </Chip>
                    </div>
                    <div>
                      <Button
                        startContent={<TiDeleteOutline size="25" />}
                        size="sm"
                        color="danger"
                        onClick={() => deletePrestationHandler(idx)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default PrestationsSection;
