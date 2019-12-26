const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/upload', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let image = req.files.image;

      // Use the mv() method to place the file somewhere on your server
      image.mv(`pictures/${(new Date()).getMilliseconds()}.jpg`, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        res.send('File uploaded!');
      });
    });
}