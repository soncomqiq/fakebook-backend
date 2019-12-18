const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  //tested
  app.get('/request-list', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let requestFromIds = await db.friend.findAll({
        attributes: ['request_from_id'],
        where: { request_to_id: req.user.id, status: "request" },
      })

      let requestFromUsers = await db.user.findAll({
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.in]: requestFromIds.map(x => x.request_from_id)
          }
        }
      })
      res.status(200).json(requestFromUsers)
    });

  //tested
  app.get('/friends-list', passport.authenticate('jwt', { session: false }),
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
      let requestFromUsers = await db.user.findAll({
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.in]: friendIds
          }
        }
      })

      res.json(requestFromUsers)
    });

  //tested
  app.get('/friend-request-to/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.friend.create({
        request_from_id: req.user.id,
        request_to_id: req.params.id,
        status: "request"
      })
        .then(result => {
          res.status(201).send(result)
        })
        .catch(err => {
          res.status(400).send({ message: err.message })
        })
    }
  )

  //tested
  app.get('/accept-friend-request/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetFriend = await db.friend.findOne({ where: { request_from_id: req.params.id, request_to_id: req.user.id, status: "request" } })
      if (targetFriend === null) {
        res.status(404).send({ message: "something went wrong" })
      } else {
        targetFriend.update({
          status: "friend"
        })
        res.status(200).send(targetFriend)
      }
    }
  )

  //tested
  app.get('/delete-friend/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.friend.destroy({
        where: {
          [Op.or]: [
            { request_to_id: req.user.id, request_from_id: req.params.id, status: "friend" },
            { request_to_id: req.params.id, request_from_id: req.user.id, status: "friend" }
          ]
        }
      })
        .then(result => {
          res.status(200).send({ message: `${req.params.id} is delete from your friends list` })
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: "something went wrong." })
        })
    }
  )

  //tested
  app.get('/deny-friend-request/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.friend.destroy({
        where: {
          request_to_id: req.user.id, request_from_id: req.params.id, status: "request"
        }
      })
        .then(result => {
          res.status(200).send({ message: `${req.params.id} is delete from your request list` })
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: "something went wrong." })
        })
    }
  )
}