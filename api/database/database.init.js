const BusinessModel = require("../schemas/business.schema");
const RoleModel = require("../schemas/role.schema");
const UserModel = require("../schemas/user.schema");
const ServiceModel = require("../schemas/service.schema");
const AppointmentModel = require("../schemas/appointment.schema");

const initDatabase = async (deleteAll = false) => {
  if (deleteAll) {
    await ServiceModel.deleteMany({});
    await BusinessModel.deleteMany({});
    await RoleModel.deleteMany({});
    await UserModel.deleteMany({});
    await AppointmentModel.deleteMany({});
  }

  // create roles
  const roles = [
    { name: "standard", description: "utilisateur standard" },
    { name: "owner", description: "utilisateur professionnel" },
  ];

  roles.forEach(async (role) => {
    try {
      await RoleModel.create(role);
      console.log("role created successfully :", role.name);
    } catch (e) {
      console.log("error in creating role :", role.name);
    }
  });

  // create "normal" and "owner" user
  const roleStandardId = (
    await RoleModel.find({ name: "standard" }).lean().exec()
  )[0]._id;
  const roleOwnerId = (await RoleModel.find({ name: "owner" }).lean().exec())[0]
    ._id;

  const users = [
    {
      username: "usernormal",
      email: { address: "usernormal@gmail.com", validated: true },
      password: "password",
      roles: [roleStandardId],
      profile: {
        firstName: "Jean",
        lastName: "ValJean",
      },
      active: true,
    },
    {
      username: "businessowner",
      email: { address: "businessowner@gmail.com", validated: true },
      password: "password",
      roles: [roleOwnerId],
      profile: {
        firstName: "Eric",
        lastName: "Barbier",
      },
      active: true,
    },
  ];

  users.forEach(async (user) => {
    try {
      await UserModel.create(user);
      console.log("user created successfully :", user.username);
    } catch (e) {
      console.log("error in creating user :", user.username);
    }
  });

  // create business

  const businessOwnerId = (
    await UserModel.find({ username: "businessowner" }).lean().exec()
  )[0]._id;

  const business = {
    name: "TOPFORM",
    description: "Le meilleur de la remise en forme.",
    owner: businessOwnerId,
  };

  try {
    await BusinessModel.create(business);
    console.log("business created successfully :", business.name);
  } catch (e) {
    console.log("error creating business :", business.name);
  }

  // create services
  const businessId = (
    await BusinessModel.find({ name: "TOPFORM" }).lean().exec()
  )[0]._id;

  const services = [
    {
      serviceName: "Massage complet",
      description: "un massage complet",
      duration: 60,
      price: 5000,
      business: businessId,
    },
    {
      serviceName: "Massage du visage",
      description: "un massage du visage avec nettoyage",
      duration: 45,
      price: 3500,
      business: businessId,
    },
    {
      serviceName: "Traitement courbatures",
      description: "un traitement spécial pour réduire les courbatures",
      duration: 30,
      price: 4000,
      business: businessId,
    },
  ];

  services.forEach(async (service) => {
    try {
      await ServiceModel.create(service);
      console.log("service created successfully :", service.serviceName);
    } catch (e) {
      console.log("error in creating service :", service.serviceName);
    }
  });

  // create appointment

  const normalUserId = (
    await UserModel.find({ username: "usernormal" }).lean().exec()
  )[0]._id;

  const service = (
    await ServiceModel.find({ serviceName: "Massage complet" }).lean().exec()
  )[0];

  const startTimestamp = new Date().getTime() + 3600 * 1000;

  const appointment = {
    service: service._id,
    client: normalUserId,
    startTime: startTimestamp,
    endTime: startTimestamp + service.duration * 60 * 1000, // convert minutes to milliseconds
  };

  try {
    await AppointmentModel.create(appointment);
    console.log("appointment created successfully : ", appointment.service);
  } catch (e) {
    console.log("error in creating appointment : ", appointment.service, e);
  }
};

module.exports = { initDatabase };
