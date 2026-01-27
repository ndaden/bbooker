import { Pagination } from "@nextui-org/react";
import QAutoComplete from "./components/QAutocomplete";
import BusinessCard from "./components/BusinessCard";
import useFetchBusinesses from "./hooks/useFetchBusinesses";
import Container from "./components/Container";

function Home() {
  const { businesses, isLoading, isError } = useFetchBusinesses({});
  return (
    <Container>
      <div className="my-3">
        <QAutoComplete />
      </div>
      <div className="flex flex-col">
        {isError && (
          <div>
            Impossible de récupérer les données. Veuillez réessayer
            ultérieurement
          </div>
        )}
        {isLoading && <div>loading</div>}
        {!isLoading &&
          !isError &&
          businesses?.payload?.map((business: any) => (
            <BusinessCard
              key={business.id}
              id={business.id}
              name={business.name}
              description={business.description}
              image={business.imageUrl ?? "/images/topform_banner.jpg"}
              growOnHover
            />
          ))}
      </div>
      <div className="my-4 mx-auto">
        <Pagination total={10} initialPage={1} />
      </div>
    </Container>
  );
}

export default Home;
