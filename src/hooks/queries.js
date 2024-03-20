const publicApiUrl = process.env.PUBLIC_API_URL;

const getUserQuery = async () =>
  (
    await fetch(`${publicApiUrl}/auth/profile`, {
      method: "GET",
      credentials: "include",
    })
  ).json();

const createUserQuery = async (formData) =>
  await fetch(`${publicApiUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

const deleteUserQuery = async (id) =>
  await fetch(`${publicApiUrl}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const deleteRoleQuery = async (id) =>
  await fetch(`${publicApiUrl}/role/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const authenticateUserQuery = async (credentials) => {
  const response = await fetch(`${publicApiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const logoutUserQuery = async () => {
  const response = await fetch(`${publicApiUrl}/auth/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const getBusinessesQuery = async ({ id, ownerid }) => {
  const businessUrl = !!id
    ? `${publicApiUrl}/business?id=${id}`
    : !!ownerid
    ? `${publicApiUrl}/business?ownerid=${ownerid}`
    : `${publicApiUrl}/business`;

  const response = await fetch(businessUrl, {
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const createBusinessQuery = async (formData) =>
  // WARNING : don't add Content-Type multipart/form-data header because it'll not work corretly
  // let the browser generate it.
  await fetch(`${publicApiUrl}/business`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });

const getServicesQuery = async (id, businessId) =>
  (
    await fetch(
      `${publicApiUrl}/service${id ? `?id=${id}` : ``}${
        businessId ? `?businessId=${businessId}` : `/`
      }`
    )
  ).json();

const createServiceQuery = async (formData) =>
  await fetch(`${publicApiUrl}/service/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

const getAppointmentsQuery = async () =>
  (await fetch(`${publicApiUrl}/appointment`)).json();

const getRolesQuery = async () => (await fetch(`${publicApiUrl}/role`)).json();

const createRoleQuery = async (formData) =>
  await fetch(`${publicApiUrl}/role/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

export {
  getUserQuery,
  createUserQuery,
  deleteUserQuery,
  authenticateUserQuery,
  logoutUserQuery,
  getBusinessesQuery,
  createBusinessQuery,
  getServicesQuery,
  createServiceQuery,
  getAppointmentsQuery,
  getRolesQuery,
  createRoleQuery,
  deleteRoleQuery,
};
