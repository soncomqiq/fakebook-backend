const express = require('express');
const bodyParser = require('body-parser');
const userService = require('./services/user');
const postService = require('./services/post')
const friendService = require('./services/friend')
const commentService = require('./services/comment')
const db = require('./models');
const app = express();
const cors = require('cors')

// import passport and passport-jwt modules
const passport = require('passport');

// use the strategy
app.use(passport.initialize());
app.use(cors())

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport/passport')

db.sequelize.sync({ force: false }).then(() => {

  userService(app, db);
  postService(app, db)
  friendService(app, db)
  commentService(app, db)

  app.get('/protected', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      res.send(req.user);
    });

  app.listen(8080, () => {
    console.log("Server is running on port 8080")
  });
})