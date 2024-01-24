import React from "react";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";
import UserForm from "./UserForm";

const CreateAccount = () => {
  return (
    <Container>
      <div className="flex font-onest items-center">
        <div className="hidden md:inline-block w-1/2 p-4">
          <img src="/images/salon2.jpg" alt="salon" className="rounded-md" />
        </div>
        <div className="md:w-1/2 w-full p-4 ">
          <PageTitle title="Créez votre compte" />
          <p>
            Créez votre espace, afin de pouvoir prendre des rendez-vous en
            ligne.
          </p>
          <div>
            <UserForm />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateAccount;
