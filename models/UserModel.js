import { Sequelize } from 'sequelize'
import db from './config/Database.js'

const { DataTypes } = Sequelize

const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    alamat: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(15),
    },
    role: {
      type: DataTypes.STRING(50),
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING(255),
    },
    url: {
      type: DataTypes.STRING(255),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

export default User
;(async () => {
  await db.sync()
})()
