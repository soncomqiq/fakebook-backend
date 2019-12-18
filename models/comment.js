module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    message: {
      type: DataTypes.STRING(500)
    }
  })

  return comment
}