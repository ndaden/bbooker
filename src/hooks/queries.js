const publicApiUrl = process.env.PUBLIC_API_URL;

const getUserQuery = async () => {
  const fetchResult = await fetch(`${publicApiUrl}/auth/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (fetchResult.ok) {
    return await fetchResult.json();
  }

  const errorMessage = (await fetchResult.json()).message;

  throw errorMessage;
};

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
  if (!response.ok && response.status !== 401) {
    throw new Error(response.statusText);
  }

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

const editProfileQuery = async (formData, isJson = false) => {
  const response = await fetch(`${publicApiUrl}/auth/profile`, {
    method: "PATCH",
    headers: isJson
      ? {
          "Content-Type": "application/json",
        }
      : {},
    body: isJson ? JSON.stringify(formData) : formData,
    credentials: "include",
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const getBusinessesQuery = async ({ id, ownerid }) => {
  const businessUrl = !!id
    ? `${publicApiUrl}/business/${id}`
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include",
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

const createAppointmentQuery = async (formData) =>
  await fetch(`${publicApiUrl}/appointment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

const getFreeSlotsQuery = async ({
  businessId,
  startTimeInterval,
  endTimeInterval,
  slotDurationInMinutes,
}) =>
  (
    await fetch(
      `${publicApiUrl}/appointment/slots/${businessId}?startTimeInterval=${startTimeInterval}&endTimeInterval=${endTimeInterval}&slotDurationInMinutes=${slotDurationInMinutes}`,
      { credentials: "include" }
    )
  ).json();

const getUsersQuery = async () => (await fetch(`${publicApiUrl}/user`)).json();

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
  getUsersQuery,
  createUserQuery,
  deleteUserQuery,
  editProfileQuery,
  authenticateUserQuery,
  logoutUserQuery,
  getBusinessesQuery,
  createBusinessQuery,
  getServicesQuery,
  createServiceQuery,
  getAppointmentsQuery,
  createAppointmentQuery,
  getFreeSlotsQuery,
  getRolesQuery,
  createRoleQuery,
  deleteRoleQuery,
};
