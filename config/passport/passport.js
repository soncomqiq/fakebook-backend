const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../../models')
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const BCRYPT_SALT_ROUNDS = 12;
let jwtOptions = {};
jwtOptions.secretOrKey = 'codecamp4'

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      db.user.findOne({
        where: { username: username }
      }).then(user => {
        if (user !== null) {
          console.log("username already taken");
          return done(null, false, { message: 'username already taken' });
        } else {
          var salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS);
          var hashedPassword = bcrypt.hashSync(password, salt);
          db.user.create({ username, password: hashedPassword })
            .then(user => {
              console.log("user created");
              return done(null, user);
            })
            .catch(err => {
              console.error(err)
              done(err)
            })
        }
      })
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      try {
        db.user.findOne({
          where: {
            username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'bad username' });
          }
          console.log(user.password)
          bcrypt.compare(password, user.password, function (err, response) {
            console.log({ response })
            if (err) {
              console.log(err)
              done(err)
            }
            if (response !== true) {
              console.log('passwords do not match');
              return done(null, false, { message: 'passwords do not match' });
            }
            console.log('user found & authenticated');
            return done(null, user);
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtOptions.secretOrKey,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      console.log("test")
      db.user.findOne({
        where: {
          id: jwt_payload.id,
        },
      }).then(user => {
        if (user) {
          console.log('user found in db in passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      console.log(err)
      done(err);
    }
  }),
);

module.exports = { jwtOptions, BCRYPT_SALT_ROUNDS }
