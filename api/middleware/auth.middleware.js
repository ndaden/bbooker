const passportJwt = require("passport-jwt");
const UserModel = require("../schemas/user.schema");
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
    const user = await UserModel.findById(payload.id);

    if (user) {
      return done(null, user);
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
