import React, { useContext } from "react";
import { Card, CardBody, Listbox, ListboxItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";
import UserContext from "../../contexts/UserContext";
import AccountBusinesses from "./AccountBusinesses";

const Profile = () => {
  const user = useContext(UserContext);

  const navigate = useNavigate();

  const logoutHandler = () => {
    user.logout();
    navigate("/");
  };

  if (user.isError) {
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
              {user.isLoading && <div>Loading...</div>}

              <>
                {!user.isLoading && (
                  <>
                    <div className="my-2">
                      <PageTitle
                        title={`Bienvenue ${user.payload.profile.firstName} ${user.payload.profile.lastName}`}
                      ></PageTitle>
                    </div>
                    <div className="xl:w-1/2 bg-zinc-800 rounded-lg p-4 my-4">
                      <h3 className="text-xl font-bold m-4">
                        Vos informations
                      </h3>
                      <div className="m-4 ">
                        <span className="font-bold">Email :</span>{" "}
                        {user.payload.email}
                      </div>

                      <div className="m-4">
                        <span className="font-bold">Nom :</span>{" "}
                        {user.payload.profile.firstName}
                      </div>
                      <div className=" m-4 ">
                        <span className="font-bold">Prénom :</span>{" "}
                        {user.payload.profile.lastName}
                      </div>

                      <div className=" m-4">
                        <span className="font-bold">Adresse postale :</span>{" "}
                        {user.payload.profile.address}
                      </div>
                    </div>
                  </>
                )}
              </>
            </CardBody>
          </Card>

          <AccountBusinesses user={user.payload} />
        </div>
      </div>
    </Container>
  );
};

export default Profile;
