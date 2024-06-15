import { Sequelize } from 'sequelize'
import db from './config/Database.js'
import User from './UserModel.js'

const { DataTypes } = Sequelize

const Destinasi = db.define(
  'destinasi',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    harga: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    informasi: {
      type: DataTypes.TEXT,
    },
    daerah: {
      type: DataTypes.STRING(100),
    },
    image: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)
Destinasi.belongsTo(User, { foreignKey: 'user_id' })

export default Destinasi
;(async () => {
  await db.sync()
})()
