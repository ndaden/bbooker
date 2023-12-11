const getUsersQuery = async () =>
  (await fetch("http://localhost:3001/user")).json();

const createUserQuery = async (formData) =>
  await fetch("http://localhost:3001/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

const deleteUserQuery = async (id) =>
  await fetch(`http://localhost:3001/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const getBusinessesQuery = async (id) =>
  (
    await fetch(`http://localhost:3001/business${id ? `?id=${id}` : `/`}`)
  ).json();

const getServicesQuery = async (id, businessId) =>
  (
    await fetch(
      `http://localhost:3001/service${id ? `?id=${id}` : `/`}${
        businessId ? `?businessId=${businessId}` : `/`
      }`
    )
  ).json();

const getAppointmentsQuery = async () =>
  (await fetch("http://localhost:3001/appointment")).json();

const getRolesQuery = async () =>
  (await fetch("http://localhost:3001/role")).json();

export {
  getUsersQuery,
  createUserQuery,
  deleteUserQuery,
  getBusinessesQuery,
  getServicesQuery,
  getAppointmentsQuery,
  getRolesQuery,
};
