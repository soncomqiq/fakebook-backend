const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({ force: false }).then(() => {
    app.listen(8080, () =>
        console.log("Server is running on port 8080"))
})