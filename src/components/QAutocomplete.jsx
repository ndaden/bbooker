import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import QInput from "./QInput";
import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

const rows = [
  { key: "1", label: "What is my birthday ?" },
  { key: "2", label: "What is my ... ?" },
  { key: "3", label: "What is somethgin ?" },
];
const columns = [{ key: "label", label: "" }];
const QAutoComplete = () => {
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  return (
    <>
      <QInput
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowResults(true);
        }}
        className={"my-1"}
        placeholder={"Rechercher un centre ou un service"}
        endContent={
          <button
            className="focus:outline-none hover:scale-125"
            type="button"
            onClick={() => undefined}
            title="localisez-moi"
          >
            <IoLocationOutline fontSize={"30"} />
          </button>
        }
      />
      {showResults && (
        <Table selectionMode="single">
          <TableHeader columns={columns} hidden>
            {(column) => (
              <TableColumn key={column.key} hidden>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={results}
            emptyContent={<CircularProgress aria-label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default QAutoComplete;
