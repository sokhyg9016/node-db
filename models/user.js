module.exports = (sequelize, DataTypes) => 
(
  sequelize.define('user', 
  {
    email:
    {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    nick:
    {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    password:
    {
        type: DataTypes.STRING(100),
        allowNull: false
    }
  }, 
  {
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate:' utf8_general_ci',
  })
);
