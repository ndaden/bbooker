import React, { useContext, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Container from "../../components/Container";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import useCreateBusinessAndService from "./useCreateBusinessAndServices";

const CreateBusiness = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user.isError) {
      navigate("/login");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    getValues,
    unregister,
    setValue,
    trigger,
  } = useForm();

  const {
    validation,
    prestationFieldName,
    prestations,
    displayPrestationForm,
    addPrestationHandler,
    cancelAddPrestationHandler,
    deletePrestationHandler,
    createBusiness,
  } = useCreateBusinessAndService(
    {
      getValues,
      unregister,
      setValue,
      trigger,
    },
    user
  );

  const submitBusinessForm = async (values) => {
    if (isValid) {
      // création du business
      await createBusiness(values);
    }
  };

  return !user.isLoading ? (
    <Container>
      <PageTitle title="Créer votre centre de prestations" />
      <form name="businessForm" onSubmit={handleSubmit(submitBusinessForm)}>
        <div className="my-5">
          <div className="text-2xl">Informations générales</div>
          <Input
            {...register("businessName", validation.businessName)}
            type="text"
            label="Raison sociale"
            className="my-4"
            errorMessage={errors["businessName"]?.message as string}
          />

          <Textarea
            {...register("businessDescription", validation.businessDescription)}
            label="Description"
            placeholder="Présentation de votre activité"
            className="my-4"
            errorMessage={errors["businessDescription"]?.message as string}
          />
        </div>
        <div className="my-5">
          <div className="text-2xl">Prestations</div>

          {displayPrestationForm && (
            <div>
              <fieldset name={`${prestationFieldName}`}>
                <Input
                  {...register(
                    `${prestationFieldName}.name`,
                    validation[`${prestationFieldName}.name`]
                  )}
                  type="text"
                  label="Libellé de prestation"
                  errorMessage={
                    errors.prestations &&
                    (errors.prestations[prestations.length].name
                      ?.message as string)
                  }
                  className="my-4"
                />
                <Input
                  {...register(
                    `${prestationFieldName}.description`,
                    validation[`${prestationFieldName}.description`]
                  )}
                  type="text"
                  label="Description"
                  errorMessage={
                    errors.prestations &&
                    (errors.prestations[prestations.length].description
                      ?.message as string)
                  }
                  className="my-4"
                />
                <Input
                  {...register(
                    `${prestationFieldName}.durationInMinutes`,
                    validation[`${prestationFieldName}.durationInMinutes`]
                  )}
                  type="text"
                  label="Durée"
                  errorMessage={
                    errors.prestations &&
                    (errors.prestations[prestations.length].durationInMinutes
                      ?.message as string)
                  }
                  minLength={2}
                  maxLength={3}
                  className="my-4"
                />
                <Input
                  {...register(
                    `${prestationFieldName}.price`,
                    validation[`${prestationFieldName}.price`]
                  )}
                  type="text"
                  label="Prix"
                  minLength={1}
                  maxLength={5}
                  errorMessage={
                    errors.prestations &&
                    (errors.prestations[prestations.length].price
                      ?.message as string)
                  }
                  className="my-4"
                />
              </fieldset>
            </div>
          )}
          <div className="flex justify-around">
            <Button color="secondary" onClick={addPrestationHandler}>
              Ajouter une prestation
            </Button>
            {displayPrestationForm && (
              <Button color="secondary" onClick={cancelAddPrestationHandler}>
                Annuler
              </Button>
            )}
          </div>
          {prestations.map((prestation, idx) => (
            <Card key={prestation.name} className="my-3">
              <CardBody>
                <div className="text-xl font-bold">{prestation.name}</div>
                <div>{prestation.description}</div>
                <div>Durée: {prestation.durationInMinutes} minutes</div>
                <div>Prix: {prestation.price} €</div>
                <Button
                  color="danger"
                  className="w-50"
                  onClick={() => deletePrestationHandler(idx)}
                >
                  Supprimer
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
        <Button color="primary" type="submit">
          Valider
        </Button>
      </form>
    </Container>
  ) : (
    <>Chargement...</>
  );
};

export default CreateBusiness;
