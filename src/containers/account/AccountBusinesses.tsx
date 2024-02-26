import React from "react";
import useFetchBusinesses from "../../hooks/useFetchBusinesses";
import useAuthentication from "../../hooks/useAuthentication";
import BusinessCard from "../../components/BusinessCard";
import PageTitle from "../../components/PageTitle";

const AccountBusinesses = ({ user }) => {
  console.log(user);
  const { businesses, isLoading, isError } = useFetchBusinesses({
    ownerid: user?._id,
  });
  return (
    !isLoading &&
    businesses &&
    businesses.length > 0 && (
      <div className="mt-4">
        <PageTitle title="Vos centres"></PageTitle>
        <div className="flex flex-col">
          {businesses.map((business) => (
            <BusinessCard
              key={business._id}
              description={business.description}
              id={business._id}
              name={business.name}
              image={business.imageUrl ?? "/images/topform_banner.jpg"}
              growOnHover={false}
              isOwner
            />
          ))}
        </div>
      </div>
    )
  );
};

export default AccountBusinesses;
