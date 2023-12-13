import { Pagination } from "@nextui-org/react";
import QAutoComplete from "./components/QAutocomplete";
import BusinessCard from "./components/BusinessCard";
import useFetchBusinesses from "./hooks/useFetchBusinesses";

function Home() {
  const { businesses, isLoading } = useFetchBusinesses();
  return (
    <main className="container mx-auto max-w-6xl px-6 flex-grow">
      <div className="my-3">
        <QAutoComplete />
      </div>
      <div className="flex flex-col gap-6">
        {isLoading && <div>loading</div>}
        {!isLoading &&
          businesses.map((business) => (
            <BusinessCard
              key={business._id}
              id={business._id}
              name={business.name}
              description={business.description}
            />
          ))}
      </div>
      <div className="max-w-6xl my-4">
        <Pagination
          total={10}
          initialPage={1}
          className="mx-auto max-w-[50%]"
        />
      </div>
    </main>
  );
}

export default Home;
