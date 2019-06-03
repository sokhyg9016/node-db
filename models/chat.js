module.exports = (sequelize, DataTypes) => 
(
  sequelize.define('chat', 
  {
    room:
    {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    user:
    {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    chat:
    {
        type: DataTypes.TEXT,
    },
    createdAt:
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
