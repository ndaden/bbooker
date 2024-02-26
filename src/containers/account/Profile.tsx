import React, { useContext } from "react";
import { Card, CardBody, Listbox, ListboxItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";
import UserContext from "../../contexts/UserContext";
import AccountBusinesses from "./AccountBusinesses";

const Profile = () => {
  const {
    user: { user: userData, isLoading: isLoadingUser, isError, logout },
  } = useContext(UserContext);

  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
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
              Mes centres de services
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
              {isLoadingUser && <div>Loading...</div>}

              <>
                {!isLoadingUser && (
                  <>
                    <div className="my-2">
                      <PageTitle
                        title={`Bienvenue ${userData.profile.firstName} ${userData.profile.lastName}`}
                      ></PageTitle>
                    </div>
                    <div className="xl:w-1/2 bg-zinc-800 rounded-lg p-4 my-4">
                      <h3 className="text-xl font-bold m-4">
                        Vos informations
                      </h3>
                      <div className="m-4 ">
                        <span className="font-bold">Email :</span>{" "}
                        {userData.email.address}
                      </div>

                      <div className="m-4">
                        <span className="font-bold">Nom :</span>{" "}
                        {userData.profile.firstName}
                      </div>
                      <div className=" m-4 ">
                        <span className="font-bold">Prénom :</span>{" "}
                        {userData.profile.lastName}
                      </div>

                      <div className=" m-4">
                        <span className="font-bold">Adresse postale :</span>{" "}
                        {userData.profile.address.street1}
                      </div>
                    </div>
                  </>
                )}
              </>
            </CardBody>
          </Card>

          <AccountBusinesses user={userData} />
        </div>
      </div>
    </Container>
  );
};

export default Profile;
