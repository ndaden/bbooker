import React, { useContext, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import useCreateBusinessAndService from "./useCreateBusinessAndServices";
import GeneralInfoSection from "./GeneralInfoSection";
import PrestationsSection from "./PrestationsSection";
import BusinessOverview from "./BusinessOverview";
import { UserContext } from "../../contexts/UserContext";

const CreateBusiness = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const {
    isLoading,
    logout,
    data: { payload: user } = { payload: undefined },
  } = userContext;

  const [nbPrestations, setNbPrestations] = useState(1);
  const [finalizedCreation, setFinalizedCreation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid, isSubmitSuccessful, defaultValues },
    getValues,
    unregister,
    setValue,
    trigger,
    reset,
    control,
  } = useForm({ mode: "onChange" });

  const {
    validation,
    prestationFieldName,
    prestations,
    displayPrestationForm,
    addPrestationHandler,
    cancelAddPrestationHandler,
    deletePrestationHandler,
    goToPrestationsStep,
    createBusiness,
  } = useCreateBusinessAndService(
    {
      getValues,
      unregister,
      setValue,
      trigger,
      reset,
      isSubmitSuccessful,
    },
    user,
    setNbPrestations
  );

  const submitBusinessForm = async (values) => {
    if (isValid) {
      // création du business
      await createBusiness(values);
    }
  };

  return !isLoading ? (
    <Container>
      <PageTitle title="Créez votre centre" />
      <form
        name="businessForm"
        onSubmit={handleSubmit(submitBusinessForm)}
        encType="multipart/form-data"
        className="sm:w-[50%]"
      >
        <GeneralInfoSection
          control={control}
          hidden={displayPrestationForm}
          validation={validation}
        />

        {!finalizedCreation && (
          <PrestationsSection
            control={control}
            hidden={!displayPrestationForm}
            addPrestationHandler={addPrestationHandler}
            deletePrestationHandler={deletePrestationHandler}
            prestationFieldName={prestationFieldName}
            prestations={prestations}
            validation={validation}
          />
        )}
        {finalizedCreation && <BusinessOverview data={getValues()} />}
        <div className="flex justify-between">
          <Button
            color="secondary"
            size="lg"
            variant="ghost"
            type="button"
            className=""
          >
            Retour à l'accueil
          </Button>
          {!displayPrestationForm && !finalizedCreation && (
            <Button
              color="primary"
              size="lg"
              variant="ghost"
              type="button"
              className=""
              onClick={goToPrestationsStep}
            >
              Etape suivante
            </Button>
          )}
          {displayPrestationForm && !finalizedCreation && (
            <Button
              color="primary"
              size="lg"
              variant="ghost"
              disabled={prestations.length === 0}
              onClick={() => {
                cancelAddPrestationHandler();
                setFinalizedCreation(true);
              }}
            >
              Continuer
            </Button>
          )}
          {finalizedCreation && (
            <Button color="primary" size="lg" type="submit">
              Finaliser et créer
            </Button>
          )}
        </div>
      </form>
    </Container>
  ) : (
    <>Chargement...</>
  );
};

export default CreateBusiness;
