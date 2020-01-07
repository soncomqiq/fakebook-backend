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

      db.post.findAll({
        where: { user_id: { [Op.in]: allIds } },
        include: [
          { model: db.user, as: 'author', attributes: ['id', 'name', ['profile_img_url', 'profilePic']] }
          ,
          {
            model: db.comment,
            as: 'commentList',
            attributes: ['id', ['message', 'content']],
            include: [{
              model: db.user,
              attributes: ['id', 'name', ['profile_img_url', 'profilePic']]
            }],
            raw: true
          }
        ],
        order: [['id', 'DESC']]
      })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    });

  app.get('/my-posts', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.post.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: db.user, as: 'author', attributes: ['id', 'name', ['profile_img_url', 'profilePic']] }
          ,
          {
            model: db.comment,
            as: 'commentList',
            attributes: ['id', ['message', 'content']],
            include: [{
              model: db.user,
              attributes: ['id', 'name', ['profile_img_url', 'profilePic']]
            }],
            raw: true
          }
        ],
        order: [['id', 'DESC']]
      })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    })

  app.post('/create-post', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        })
      } else {
        const picture = req.files.photoPost
        const pictureName = `${(new Date()).getTime()}.jpeg`;
        picture.mv('./upload/' + pictureName)

        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            name: pictureName,
            size: picture.size
          }
        })

        db.post.create({
          message: req.body.message,
          image_url: `http://localhost:8080/${pictureName}`,
          user_id: req.user.id
        })
          .then(result => res.status(201).json(result))
          .catch(err => {
            console.error(err);
            res.status(400).json({ message: err.message })
          })
      }
    }
  )

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
