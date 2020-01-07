const express = require('express');
const bodyParser = require('body-parser');
const userService = require('./services/user');
const postService = require('./services/post')
const friendService = require('./services/friend')
const commentService = require('./services/comment')
const fileService = require('./services/files')
const db = require('./models');
const cors = require('cors')
const passport = require('passport');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

app.use(express.static('upload'))

app.use(passport.initialize());
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport/passport')

db.sequelize.sync({ force: false }).then(() => {

  userService(app, db)
  postService(app, db)
  friendService(app, db)
  commentService(app, db)
  fileService(app, db)

  app.get('/protected', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      res.send(req.user);
    });

  app.listen(8080, () => {
    console.log("Server is running on port 8080")
  });
})