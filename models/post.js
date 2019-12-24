module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    message: {
      type: DataTypes.STRING(500)
    },
    image_url: {
      type: DataTypes.STRING(500)
    }
  })

  post.associate = (models) => {
    post.hasMany(models.comment, { onDelete: 'CASCADE', as: 'commentList', foreignKey: 'post_id' })
    post.belongsTo(models.user, { onDelete: 'CASCADE', as: 'author', foreignKey: 'user_id' })
  }
  return post
}