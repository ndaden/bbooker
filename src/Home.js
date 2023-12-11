import { Pagination } from "@nextui-org/react";
import QInput from "./components/QInput";
import QQuestion from "./components/QQuestion";
import QAutoComplete from "./components/QAutocomplete";

function Home() {
  return (
    <main className="container mx-auto max-w-6xl px-6 flex-grow">
      <div className="my-3">
        <QInput
          label="Ma question est, "
          placeholder="saisir une question"
          type="text"
          className="max-w-xl m-auto"
        />
      </div>
      <div className="my-3">
        <QAutoComplete />
      </div>

      <div className="m-auto">
        <QQuestion />
        <QQuestion />
        <QQuestion />
      </div>
      <div className="max-w-6xl">
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
