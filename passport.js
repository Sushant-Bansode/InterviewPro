const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    // (email, password, done) => {
    //   User.findOne({ email: email }, (err, user) => {
    //     if (err) return done(err);
    //     if (!user)
    //       return done(null, false, { message: "Incorrect Email or Password" });
    //     if (!user.validPassword(password))
    //       return done(null, false, {
    //         message: "Incorrect Password or Password",
    //       });
    //     return done(null, user);
    //   });
    // }
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        // Handle the error, for example, log it or return an error response
        return done(err);
      }
    }
  )
);
