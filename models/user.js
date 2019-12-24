module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(255)
    },
    password: {
      type: DataTypes.STRING(255)
    },
    name: {
      type: DataTypes.STRING(100)
    },
    profile_img_url: {
      type: DataTypes.STRING(500)
    },
    role: {
      type: DataTypes.ENUM("admin", "user")
    }
  })

  user.associate = (models) => {
    user.hasMany(models.comment, { onDelete: 'CASCADE', foreignKey: 'user_id' })
    user.hasMany(models.post, { onDelete: 'CASCADE', as: 'author', foreignKey: 'user_id' })
    user.belongsToMany(user, { as: 'request_to', foreignKey: 'request_to_id', through: models.friend })
    user.belongsToMany(user, { as: 'request_from', foreignKey: 'request_from_id', through: models.friend })
  }
  return user
}













