import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/UserContext";
import LoadingPage from "../../../components/LoadingPage";
import PageTitle from "../../../components/PageTitle";
import Container from "../../../components/Container";
import ProfileInfo from "./ProfileInfo";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingPage />;
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container>
      <div className="flex font-onest items-start">
        <div className="md:w-2/3 w-full p-4 mx-auto">
          <PageTitle title="Mon profil" />
          <p>
            Gérez vos informations personnelles et les paramètres de votre compte
          </p>
          <div className="my-5 xl:w-full">
            <ProfileInfo user={user} />
          </div>
        </div>
        <div className="hidden md:inline-block w-1/3 p-4">
          <img src="/images/salon1.jpg" alt="salon" className="rounded-md" />
        </div>
      </div>
    </Container>
  );
};

export default Profile;
