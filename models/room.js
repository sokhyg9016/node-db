module.exports = (sequelize, DataTypes) => 
(
  sequelize.define('room', 
  {
    title:
    {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    max:
    {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 10,
        min: 2
    },
    owner:
    {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    password:
    {
        type: DataTypes.STRING(100),
    },
    created_At:
    {
        type:DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
  }, 
  {
    timestamps: false,
    paranoid: false,
    charset: 'utf8',
    collate:' utf8_general_ci',
  })
);
