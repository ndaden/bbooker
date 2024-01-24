import React from "react";
import LoginForm from "./LoginForm";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";

const Login = () => {
  return (
    <Container>
      <div className="flex font-onest items-center">
        <div className="md:w-1/2 w-full p-4 mx-auto">
          <PageTitle title="Accédez à votre compte" />
          <p>
            Renseignez votre identifiant et votre mot de passe afin d'accéder à
            votre espace
          </p>
          <div className="my-5 xl:w-2/3">
            <LoginForm />
          </div>
        </div>
        <div className="hidden md:inline-block w-1/2 p-4">
          <img src="/images/salon1.jpg" alt="salon" className="rounded-md" />
        </div>
      </div>
    </Container>
  );
};

export default Login;
