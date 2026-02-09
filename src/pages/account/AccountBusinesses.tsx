import React from "react";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import BusinessCard from "../../components/BusinessCard";
import { User } from "../../types/auth";

interface AccountBusinessesProps {
  user: User;
}


const AccountBusinesses = ({ user }: AccountBusinessesProps) => {
  const { businesses, isLoading, isError } = useFetchBusinesses({
    ownerid: (user as any)?._id || user?.id,
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement de vos centres...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Erreur lors du chargement de vos centres</div>;
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Vous n'avez pas encore de centre de services.
        <br />
        Créez votre premier centre en cliquant sur le bouton ci-dessus.
      </div>
    );
  }



  const businessList = businesses?.payload || businesses || [];

  return (
    <div className="flex flex-col gap-4 w-full">
      {businessList.map((business: any) => (
        <BusinessCard
          key={business.id || business._id}
          description={business.description}
          id={business.id || business._id}
          name={business.name}
          image={business.imageUrl ?? "/images/topform_banner.jpg"}
          growOnHover={false}
          isOwner
          distance={undefined}
        />
      ))}
    </div>
  );
};

export default AccountBusinesses;
