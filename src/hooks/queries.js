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

const authenticateUserQuery = async (credentials) => {
  const response = await fetch("http://localhost:3001/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const isAuthenticatedQuery = async () => {
  const response = await fetch("http://localhost:3001/user/authenticated", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
  if (!response.ok) throw new Error(response.statusText);

  return await response.json();
};

const getBusinessesQuery = async (id) => {
  const response = await fetch(
    `http://localhost:3001/business${id ? `?id=${id}` : `/`}`
  );
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

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
  isAuthenticatedQuery,
  authenticateUserQuery,
  getBusinessesQuery,
  getServicesQuery,
  getAppointmentsQuery,
  getRolesQuery,
};
