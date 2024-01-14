import React from "react";
import LoginForm from "./LoginForm";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";

const Login = () => {
  return (
    <Container>
      <div className="my-4">
        <PageTitle title="Accédez à votre compte" />
        <p>
          Renseignez votre identifiant et votre mot de passe afin d'accéder à
          votre espace
        </p>
      </div>
      <LoginForm />
    </Container>
  );
};

export default Login;
