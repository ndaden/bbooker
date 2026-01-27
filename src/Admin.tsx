import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Chip,
  CircularProgress,
  Input,
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
import useFetchRoles from "./hooks/useFetchRoles";
import { BsTrash } from "react-icons/bs";
import { deleteRoleQuery, deleteUserQuery } from "./hooks/queries";
import { ROLES_KEY, USERS_KEY } from "./hooks/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Container from "./components/Container";
import { useForm } from "react-hook-form";
import useMutateRole from "./hooks/useMutateRole";

const Admin = () => {
  // Fetch queries
  const { isLoading: isLoadingUsers, users } = useFetchUsers();
  const { isLoading: isLoadingRoles, roles, refetchRoles } = useFetchRoles();
  const { isLoading: isLoadingBusinesses, businesses } = useFetchBusinesses({});
  const { isLoading: isLoadingServices, services } = useFetchServices();
  const { isLoading: isLoadingAppointments, appointments } =
    useFetchAppointments();

  // Mutate queries
  const { mutateRole } = useMutateRole();
  const queryCache = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors = {}, isValid },
    watch,
    reset,
  } = useForm();

  const onSubmitRole = async (values) => {
    await mutateRole(values);
    await queryCache.invalidateQueries({ queryKey: [ROLES_KEY] });
    await refetchRoles();
  };

  const deleteRoleHandler = async (id) => {
    await deleteRoleQuery(id);
    await queryCache.invalidateQueries({ queryKey: [ROLES_KEY] });
  };

  const deleteUserHandler = async (id) => {
    await deleteUserQuery(id);
    await queryCache.invalidateQueries({ queryKey: [USERS_KEY] });
  };

  const isLoading =
    isLoadingUsers ||
    isLoadingBusinesses ||
    isLoadingServices ||
    isLoadingAppointments ||
    isLoadingRoles;

  return isLoading ? (
    <Container>
      <CircularProgress aria-label="loading" className="m-auto" />
    </Container>
  ) : (
    <Container>
      <h2>Users</h2>
      <Table aria-label="list of all the users">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users?.map((user: any) => (
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

      {businesses?.map((business: any) => (
        <Accordion key={business._id} variant="splitted">
          <AccordionItem
            textValue={business._id}
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
                  ?.filter((service: any) => service.business === business._id)
                  ?.map((service: any) => {
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
          {appointments?.map((appointment: any) => (
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

      <h2>Roles</h2>
      <Table aria-label="list of all the roles">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody>
          {roles?.map((role: any) => (
            <TableRow key={role._id}>
              <TableCell width={"50px"}>{role._id}</TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <Button isIconOnly onClick={() => deleteRoleHandler(role._id)}>
                  <BsTrash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>Ajout rôle</div>
      <Card className="md:w-[50%]">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmitRole)}>
            <Input
              type="text"
              size="sm"
              label="Name"
              className="my-3"
              {...register("name", { required: true })}
            />
            <Input
              type="text"
              size="sm"
              label="Description"
              className="my-3"
              {...register("description", { required: true })}
            />

            <Button type="submit" color="primary">
              Ajout rôle
            </Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Admin;
