module.exports = (sequelize, DataTypes) => {
  const friend = sequelize.define('friend', {
    status: {
      type: DataTypes.ENUM('request', 'friend', 'block')
    }
  })

  return friend
}