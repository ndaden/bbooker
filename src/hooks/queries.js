const publicApiUrl = process.env.PUBLIC_API_URL;

const getUserQuery = async () => {
  const fetchResult = await fetch(`${publicApiUrl}/auth/profile`, {
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
    ? `${publicApiUrl}/business/${encodeURIComponent(id)}`
    : !!ownerid
    ? `${publicApiUrl}/business?ownerid=${encodeURIComponent(ownerid)}`
    : `${publicApiUrl}/business`;
  const response = await fetch(businessUrl, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const searchBusinessesQuery = async ({ query, lat, lng, radius = 10 }) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (lat !== undefined && lat !== null) params.append('lat', lat.toString());
  if (lng !== undefined && lng !== null) params.append('lng', lng.toString());
  if (radius) params.append('radius', radius.toString());
  
  const response = await fetch(`${publicApiUrl}/business/search?${params.toString()}`, {
    method: "GET",
    credentials: "include",
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

const getServicesQuery = async (id, businessId) => {
  let url = `${publicApiUrl}/service`;
  const params = [];
  if (id) params.push(`id=${encodeURIComponent(id)}`);
  if (businessId) params.push(`businessId=${encodeURIComponent(businessId)}`);
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  const response = await fetch(url, {
    credentials: "include",
  });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const createServiceQuery = async (formData) =>
  await fetch(`${publicApiUrl}/service/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

const getAppointmentsQuery = async () => {
  const response = await fetch(`${publicApiUrl}/appointment`, { credentials: "include" });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const getAppointmentsByBusinessQuery = async (businessId) => {
  const response = await fetch(`${publicApiUrl}/appointment?businessId=${encodeURIComponent(businessId)}`, { credentials: "include" });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

const getAppointmentsByUserQuery = async (userId) => {
  const response = await fetch(`${publicApiUrl}/appointment?accountId=${encodeURIComponent(userId)}`, { credentials: "include" });
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

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
}) => {
  const params = new URLSearchParams();
  params.append('startTimeInterval', startTimeInterval);
  params.append('endTimeInterval', endTimeInterval);
  params.append('slotDurationInMinutes', slotDurationInMinutes);
  
  const response = await fetch(
    `${publicApiUrl}/appointment/slots/${encodeURIComponent(businessId)}?${params.toString()}`,
    { credentials: "include" }
  );
  if (!response.ok) throw new Error(response.statusText);
  return await response.json();
};

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
  searchBusinessesQuery,
  createBusinessQuery,
  getServicesQuery,
  createServiceQuery,
  getAppointmentsQuery,
  getAppointmentsByBusinessQuery,
  getAppointmentsByUserQuery,
  createAppointmentQuery,
  getFreeSlotsQuery,
  getRolesQuery,
  createRoleQuery,
  deleteRoleQuery,
};
