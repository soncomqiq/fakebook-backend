module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        username: {
            type: DataTypes.STRING(20)
        },
        password: {
            type: DataTypes.STRING(20)
        }
    })
    return user
}