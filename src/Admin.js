import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import useFetchUsers from "./hooks/useFetchUsers";
import useFetchBusinesses from "./hooks/useFetchBusinesses";
import useFetchServices from "./hooks/useFetchServices";
import useFetchAppointments from "./hooks/useFetchAppointments";
import UserForm from "./UserForm";
import { BsTrash } from "react-icons/bs";
import { deleteUserQuery } from "./hooks/queries";
import { USERS_KEY } from "./hooks/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Container from "./components/Container";

const Admin = () => {
  const { isLoading: isLoadingUsers, users } = useFetchUsers();
  const { isLoading: isLoadingBusinesses, businesses } = useFetchBusinesses();
  const { isLoading: isLoadingServices, services } = useFetchServices();
  const { isLoading: isLoadingAppointments, appointments } =
    useFetchAppointments();

  const queryCache = useQueryClient();

  const deleteUserHandler = async (id) => {
    await deleteUserQuery(id);
    await queryCache.invalidateQueries({ queryKey: [USERS_KEY] });
  };

  const isLoading =
    isLoadingUsers ||
    isLoadingBusinesses ||
    isLoadingServices ||
    isLoadingAppointments;
  return isLoading ? (
    <Container>
      <CircularProgress aria-label="loading" className="m-auto" />
    </Container>
  ) : (
    <Container>
      <h2>Users</h2>
      <UserForm />
      <Table aria-label="list of all the users">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell width={"50px"}>{user._id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email.address}</TableCell>
              <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  onClick={async () => await deleteUserHandler(user._id)}
                >
                  <BsTrash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Businesses</h2>

      {businesses.map((business) => (
        <Accordion key={business._id} variant="splitted">
          <AccordionItem
            title={
              <>
                {business.name} <Chip>ID: {business._id}</Chip>{" "}
                <Chip>owner: {business.owner}</Chip>
              </>
            }
          >
            <div className="py-3">Description : {business.description}</div>
            <div>
              <h1>Services proposés :</h1>
              <ul>
                {services
                  .filter((service) => service.business === business._id)
                  .map((service) => {
                    return (
                      <li key={service._id}>
                        - {service.serviceName} - {service.duration} min -{" "}
                        {service.price / 100} €
                      </li>
                    );
                  })}
              </ul>
            </div>
          </AccordionItem>
        </Accordion>
      ))}

      <h2>Appointments</h2>
      <Table aria-label="list of all the appointments">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Client username</TableColumn>
          <TableColumn>Service</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Time range</TableColumn>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell width={"50px"}>{appointment._id}</TableCell>
              <TableCell>{appointment.client.username}</TableCell>
              <TableCell>{appointment.service.serviceName}</TableCell>
              <TableCell>
                {new Date(appointment.startTime).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(appointment.startTime).toLocaleTimeString("fr-FR", {
                  timeStyle: "short",
                })}
                -
                {new Date(appointment.endTime).toLocaleTimeString("fr-FR", {
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Admin;
