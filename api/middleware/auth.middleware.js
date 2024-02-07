const passportJwt = require("passport-jwt");
const UserModel = require("../schemas/user.schema");
const RoleModel = require("../schemas/role.schema");
const passport = require("passport");
const config = require("../config");

const Strategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const strategyParams = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const passportJwtStrategy = () => {
  const strategy = new Strategy(strategyParams, async (payload, done) => {
    const user = await UserModel.findById(payload.id).select(
      "-__v -createdAt -updatedAt"
    );
    const roles = await RoleModel.find().select("-__v").lean();

    const isProfessional =
      roles.length > 0
        ? roles.find((r) => user.roles[0].equals(r._id)).name === "owner"
        : false;

    const userResult = { ...user.toJSON(), isProfessional };
    delete userResult.roles;

    if (user) {
      return done(null, userResult);
    } else if (payload.expire <= Date.now()) {
      return done(new Error("TokenExpired"), null);
    } else {
      return done(new Error("UserNotFound"), null);
    }
  });

  passport.use(strategy);

  return { initialize: () => passport.initialize() };
};

module.exports = passportJwtStrategy;
