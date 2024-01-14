import React from "react";
import UserForm from "../../UserForm";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";

const CreateAccount = () => {
  return (
    <Container>
      <div className="my-3">
        <PageTitle title="Créez votre compte" />
        <p>
          Créez votre espace, afin de pouvoir prendre des rendez-vous en ligne.
        </p>
      </div>
      <UserForm />
    </Container>
  );
};

export default CreateAccount;
