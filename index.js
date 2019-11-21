const express = require('express');
const bodyParser = require('body-parser');
const userService = require('./services/user')
const db = require('./models')
const app = express();

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ force: true }).then(() => {

    userService(app, db)

    app.listen(8080, () => {
        console.log("Server is running on port 8080")
    })
})