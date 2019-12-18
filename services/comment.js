const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-comment/:post_id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.comment.create({
        message: req.body.message,
        user_id: req.user.id,
        post_id: req.params.post_id
      })
        .then(result => {
          res.status(201).send(result)
        })
        .catch(err => {
          res.status(400).send("something went wrong.")
        })
    })

  app.put('/update-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetComment = await db.comment.findOne({ where: { id: req.params.id, user_id: req.user.id } })
      if (!targetComment) {
        res.status(404).send({ message: "The comment is not found." })
      } else {
        targetComment.update({
          message: req.body.message
        })
          .then(result => {
            res.status(200).send({ message: "success" })
          })
          .catch(err => {
            res.status(400).send({ message: "something went wrong." })
          })
      }
    })

  app.delete('/delete-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetComment = await db.comment.findOne({ where: { id: req.params.id, user_id: req.user.id } })
      if (!targetComment) {
        res.status(404).send({ message: "The comment is not found." })
      } else {
        targetComment.destroy()
          .then(result => {
            res.status(200).send({ message: "success" })
          })
          .catch(err => {
            res.status(400).send({ message: "something went wrong." })
          })
      }
    })
}
