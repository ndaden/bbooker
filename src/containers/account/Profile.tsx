import React from "react";
import useAuthentication from "../../hooks/useAuthentication";
import {
  Button,
  Card,
  CardBody,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
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

  if (isError) {
    navigate("/login");
    return null;
  }
  return (
    <Container>
      <div className="md:flex mr-4">
        <div className="w-full md:w-1/4 m-4">
          <Listbox className="rounded-lg">
            <ListboxItem key="infos" className="bg-zinc-800">
              Mes informations
            </ListboxItem>
            <ListboxItem key="confidentialite">
              Sécurité - Confidentialité
            </ListboxItem>
            <ListboxItem key="options">Options</ListboxItem>
            <ListboxItem
              key="logout"
              color="danger"
              className="bg-danger-300 my-3"
              onClick={logoutHandler}
            >
              Se deconnecter
            </ListboxItem>
          </Listbox>
        </div>
        <div className="w-full m-4">
          <Card>
            <CardBody>
              {isLoading && <div>isLoading</div>}

              <>
                {!isLoading && (
                  <>
                    <div className="my-2">
                      <PageTitle
                        title={`Bienvenue ${userData.user.profile.firstName} ${userData.user.profile.lastName}`}
                      ></PageTitle>
                    </div>
                    <div className="xl:w-1/2 bg-zinc-800 rounded-lg p-4 my-4">
                      <h3 className="text-xl font-bold m-4">
                        Vos informations
                      </h3>
                      <div className="m-4 ">
                        <span className="font-bold">Email :</span>{" "}
                        {userData.user.email.address}
                      </div>

                      <div className="m-4">
                        <span className="font-bold">Nom :</span>{" "}
                        {userData.user.profile.firstName}
                      </div>
                      <div className=" m-4 ">
                        <span className="font-bold">Prénom :</span>{" "}
                        {userData.user.profile.lastName}
                      </div>

                      <div className=" m-4">
                        <span className="font-bold">Adresse postale :</span>{" "}
                        {userData.user.profile.address.street1}
                      </div>
                    </div>
                  </>
                )}
              </>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
