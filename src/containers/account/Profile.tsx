import React from "react";
import useAuthentication from "../../hooks/useAuthentication";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";

const Profile = () => {
  const { userData, isLoading, isError } = useAuthentication();
  const queryCache = useQueryClient();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await queryCache.removeQueries({ queryKey: ["AUTHENTICATED_USER"] });
    sessionStorage.removeItem("auth_token");
    navigate("/");
  };
  return (
    <Container>
      <Card>
        <CardBody>
          {isLoading && <div>isLoading</div>}
          {isError ? (
            <div>Une erreur est survenue.</div>
          ) : (
            <>
              {!isLoading && (
                <>
                  <div className="my-2">
                    <PageTitle
                      title={`Bienvenue ${userData.user.profile.firstName} ${userData.user.profile.lastName}`}
                    ></PageTitle>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold my-3">Votre profil</h3>
                    <div className="flex gap-4 my-2 justify-evenly">
                      <div>
                        <span className="font-bold">Email</span>{" "}
                        {userData.user.email.address}
                      </div>
                    </div>
                    <div className="flex gap-4 my-2 justify-center">
                      <div>
                        <span className="font-bold">Nom</span>{" "}
                        {userData.user.profile.firstName}
                      </div>
                      <div>
                        <span className="font-bold">Prénom</span>{" "}
                        {userData.user.profile.lastName}
                      </div>
                    </div>
                    <div className="flex gap-4 my-2 justify-center">
                      <div>
                        <span className="font-bold">Adresse postale</span>{" "}
                        {userData.user.profile.address.street1}
                      </div>
                    </div>

                    <div>
                      <Button onClick={logoutHandler} color="danger">
                        Fermer la session
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Profile;
