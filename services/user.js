module.exports = (app, db) => {
    //get all users route
    app.get('/users', function (req, res) {
        db.user.findAll()
            .then((result => {
                res.status(200).json(result)
            }))
            .catch((err) => {
                res.status(400).json(err.message)
            })
    })

    // register route
    app.post('/register', function (req, res, next) {
        const { name, password } = req.body;
        db.user.create({
            username: name,
            password: password
        })
            .then((result) => {
                res.status(201).json(result)
            })
            .catch((err) => {
                res.status(400).json(err.message)
            })
    });
}