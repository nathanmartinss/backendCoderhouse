const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: "Credenciais inválidas." });
        }
        return done(null, user);
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let email =
          (profile.emails && profile.emails[0]?.value) ||
          `${profile.username}@github.com`;
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.username,
            email,
            password: "oauth_github",
          });
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
