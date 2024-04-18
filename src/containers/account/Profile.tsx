import React, { useContext, useState } from "react";
import { Avatar, Button, Image, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import Container from "../../components/Container";
import AccountBusinesses from "./AccountBusinesses";
import { UserContext } from "../../contexts/UserContext";
import LoadingPage from "../../components/LoadingPage";
import { useForm } from "react-hook-form";
import AccountLeftMenu from "./AccountLeftMenu";
import Options from "./Options";
import ControlledFileInput from "../../components/ControlledFileInput";
import useMutateProfile from "../../hooks/useMutateProfile";
import { useQueryClient } from "@tanstack/react-query";
import ButtonWithConfirmationModal from "./ButtonWithConfirmationModal";

const Profile = ({ section = "infos" }) => {
  const navigate = useNavigate();
  const queryCache = useQueryClient();
  const userContext = useContext(UserContext);

  const [fieldsState, setFieldsState] = useState({
    email: true,
    firstName: true,
    lastName: true,
    address: true,
  });

  const {
    isLoading,
    logout,
    getUserData,
    data: { payload: user } = { payload: undefined },
  } = userContext;

  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid, defaultValues, dirtyFields },
    setFocus,
    watch,
    reset,
    resetField,
    control,
  } = useForm({
    defaultValues: {
      email: user.email,
      address: user.profile ? user.profile.address : "",
      firstName: user.profile ? user.profile.firstName : "",
      lastName: user.profile ? user.profile.lastName : "",
      profileImage: "",
    },
  });

  const {
    mutateProfile,
    data: mutateProfileResult,
    isError: isErrorMutateProfile,
    isLoading: isLoadingMutateProfile,
  } = useMutateProfile();

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

  const submitProfileHandler = async (values) => {
    // if we need to update profile picture, we send a form data
    if (values.profileImage) {
      const profileImageFormData = new FormData();
      profileImageFormData.append("profileImage", values.profileImage);
      mutateProfile({ formData: profileImageFormData });
    }

    // if we need to update textual informations, we send JSON data
    if (
      ["email", "firstName", "lastName", "address"].some((item) =>
        Object.keys(values).includes(item)
      )
    ) {
      const otherProfileFields = {
        email: values.email,
        profile: {
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
        },
      };

      mutateProfile({ formData: otherProfileFields, isJson: true });
    }

    await queryCache.invalidateQueries({ queryKey: ["AUTHENTICATED_USER"] });
    getUserData();
    setFieldsState({
      address: true,
      email: true,
      firstName: true,
      lastName: true,
    });
    reset(undefined, { keepValues: true, keepDirty: false });
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
                          ? `Bienvenue ${user.profile.firstName || ""} ${
                              user.profile.lastName || ""
                            }`
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
                        defaultValue={defaultValues?.email}
                        disabled={fieldsState.email}
                        endContent={<EditButton field="email" />}
                      />
                    </div>

                    <div className="my-4">
                      <Input
                        {...register("firstName", {
                          required: {
                            value: dirtyFields.firstName,
                            message: "Veuillez saisir votre prénom.",
                          },
                        })}
                        errorMessage={errors.firstName?.message as string}
                        type="text"
                        defaultValue={defaultValues?.firstName}
                        label="Prénom"
                        placeholder="Prénom"
                        endContent={<EditButton field="firstName" />}
                        disabled={fieldsState.firstName}
                      />
                    </div>
                    <div className="my-4">
                      <Input
                        {...register("lastName", {
                          required: {
                            value: dirtyFields.lastName,
                            message: "Veuillez saisir votre nom.",
                          },
                        })}
                        type="text"
                        label="Nom"
                        defaultValue={defaultValues?.lastName}
                        errorMessage={errors.lastName?.message as string}
                        placeholder="Nom"
                        endContent={<EditButton field="lastName" />}
                        disabled={fieldsState.lastName}
                      />
                    </div>

                    <div className="my-4">
                      <Input
                        {...register("address", {
                          required: {
                            value: dirtyFields.address,
                            message: "Veuillez saisir votre adresse postale.",
                          },
                        })}
                        type="text"
                        defaultValue={defaultValues?.address}
                        label="Adresse postale"
                        errorMessage={errors.address?.message as string}
                        placeholder="Adresse postale"
                        endContent={<EditButton field="address" />}
                        disabled={fieldsState.address}
                      />
                    </div>
                    <div className="my-4 flex items-center">
                      {user.profile?.profileImage && (
                        <div>
                          <Image
                            src={user.profile?.profileImage}
                            width="200px"
                            height="200px"
                          />
                        </div>
                      )}
                      <div className="ml-3 w-full">
                        <ControlledFileInput
                          label="Photo de profil"
                          type="file"
                          control={control}
                          name="profileImage"
                          rules={[]}
                        />
                      </div>
                    </div>
                    <ButtonWithConfirmationModal
                      color="primary"
                      type="submit"
                      label="Enregistrer les modifications"
                      message="Votre profil a bien été mis à jour."
                      className="float-right"
                      isDisabled={Object.entries(dirtyFields).length === 0}
                    />
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
