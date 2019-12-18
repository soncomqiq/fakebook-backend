const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.get('/feed', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let requestFromIds = await db.friend.findAll({
        attributes: ['request_from_id'],
        where: { request_to_id: req.user.id, status: "friend" },
      })

      let requestToIds = await db.friend.findAll({
        attributes: ['request_to_id'],
        where: { request_from_id: req.user.id, status: "friend" },
      })

      const friendIds = requestFromIds.map(x => x.request_from_id).concat(requestToIds.map(x => x.request_to_id))
      const allIds = friendIds.concat([req.user.id])

      db.post.findAll({ where: { user_id: { [Op.in]: allIds } }, include: [db.comment], order: [['id', 'DESC']] })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    });

  //tested
  app.get('/my-posts', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.post.findAll({ where: { user_id: req.user.id }, include: [db.comment] })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    })

  //tested
  app.post('/create-post', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.post.create({
        message: req.body.message,
        image_url: req.body.image_url,
        user_id: req.user.id
      })
        .then(result => res.status(201).json(result))
        .catch(err => {
          console.error(err);
          res.status(400).json({ message: err.message })
        })
    }
  )

  //tested
  app.put('/update-post/:id', passport.authenticate('jwt', { session: false }),
    async function async(req, res) {
      let targetPost = await db.post.findOne({ where: { id: req.params.id, user_id: req.user.id } })
      if (!targetPost) {
        res.status(400).send({ message: "post is not found" })
      } else {
        targetPost.update({
          message: req.body.message,
          image_url: req.body.image_url
        })
        res.status(200).json({ message: "success" })
      }
    }
  )

  //tested
  app.delete('/delete-post/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetPost = await db.post.findOne({ where: { id: req.params.id, user_id: req.user.id } })
      if (!targetPost) {
        res.status(400).send({ message: "post is not found" })
      } else {
        targetPost.destroy()
        res.status(200).json({ message: "success" })
      }
    })
}