import React, { useContext, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";
import AccountBusinesses from "./AccountBusinesses";
import { UserContext } from "../../contexts/UserContext";
import LoadingPage from "../../components/LoadingPage";
import { useForm } from "react-hook-form";
import AccountLeftMenu from "./AccountLeftMenu";
import Options from "./Options";

const Profile = ({ section = "infos" }) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [fieldsState, setFieldsState] = useState({
    email: true,
    firstName: true,
    lastName: true,
    address: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid, dirtyFields },
    setFocus,
    watch,
    reset,
    control,
  } = useForm();

  const {
    isLoading,
    logout,
    data: { payload: user } = { payload: undefined },
  } = userContext;

  const logoutHandler = async () => {
    await logout();
    navigate("/");
  };

  const EditButton = ({ field }) => {
    const enabledFieldHandler = () => {
      setFieldsState({ ...fieldsState, [field]: false });
      setTimeout(() => {
        setFocus(field);
      }, 10);
    };

    return (
      <Button color="primary" variant="light" onClick={enabledFieldHandler}>
        Modifier
      </Button>
    );
  };

  const submitProfileHandler = (values) => {
    console.log(values);
  };

  return isLoading ? (
    <LoadingPage />
  ) : (
    <Container>
      <div className="md:flex mr-4">
        <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
          <AccountLeftMenu logoutHandler={logoutHandler} section={section} />
        </div>
        {section === "infos" && (
          <div className="w-full border-small px-1 py-2 mx-3 rounded-small border-default-200 dark:border-default-100">
            {!isLoading && user && (
              <>
                <div className=" rounded-lg p-4 my-4">
                  <div className="mb-4">
                    <PageTitle
                      title={
                        user.profile
                          ? `Bienvenue ${user.profile.firstName} ${user.profile.lastName}`
                          : "Bienvenue"
                      }
                    ></PageTitle>
                  </div>
                  <h3 className="text-xl font-bold">Vos informations</h3>
                  <form onSubmit={handleSubmit(submitProfileHandler)}>
                    <div className="my-4">
                      <Input
                        {...register("email")}
                        type="text"
                        label="Email"
                        defaultValue={user.email}
                        disabled={fieldsState.email}
                        endContent={<EditButton field="email" />}
                      />
                    </div>

                    <div className="my-4">
                      <Input
                        {...register("firstName")}
                        type="text"
                        label="Nom"
                        defaultValue={
                          user.profile ? user.profile.firstName : ""
                        }
                        placeholder="Nom"
                        endContent={<EditButton field="firstName" />}
                        disabled={fieldsState.firstName}
                      />
                    </div>
                    <div className="my-4">
                      <Input
                        {...register("lastName")}
                        type="text"
                        label="Prénom"
                        defaultValue={user.profile ? user.profile.lastName : ""}
                        placeholder="Prénom"
                        endContent={<EditButton field="lastName" />}
                        disabled={fieldsState.lastName}
                      />
                    </div>

                    <div className="my-4">
                      <Input
                        {...register("address")}
                        type="text"
                        label="Adresse postale"
                        defaultValue={user.profile ? user.profile.address : ""}
                        placeholder="Adresse postale"
                        endContent={<EditButton field="address" />}
                        disabled={fieldsState.address}
                      />
                    </div>
                    <Button
                      color="primary"
                      className="float-right"
                      type="submit"
                    >
                      Enregistrer les modifications
                    </Button>
                  </form>
                </div>
              </>
            )}

            <AccountBusinesses user={user} />
          </div>
        )}
        {section === "options" && <Options />}
      </div>
    </Container>
  );
};

export default Profile;
