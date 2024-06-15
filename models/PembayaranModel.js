import { Sequelize } from 'sequelize'
import db from './config/Database.js'
import Destinasi from './DestinasiModel.js'

const { DataTypes } = Sequelize

const Pembayaran = db.define(
  'pembayaran',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    no_transaksi: {
      type: DataTypes.STRING(50),
    },
    first_name: {
      type: DataTypes.STRING(50),
    },
    last_name: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    phone_number: {
      type: DataTypes.STRING(15),
    },
    tanggal_pergi: {
      type: DataTypes.DATE,
    },
    tanggal_pulang: {
      type: DataTypes.DATE,
    },
    jumlah_wisatawan: {
      type: DataTypes.STRING(15),
    },
    no_rekening: {
      type: DataTypes.STRING(15),
    },
    image_qris: {
      type: DataTypes.STRING(255),
    },
    bukti_bayar: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.STRING(50),
    },
    image: {
      type: DataTypes.STRING(255),
    },
    url: {
      type: DataTypes.STRING(255),
    },
    url_qris: {
      type: DataTypes.STRING(255),
    },
    url_bukti: {
      type: DataTypes.STRING(255),
    },
    status_terima: {
      type: DataTypes.STRING(255),
    },

    destinasi_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'destinasi',
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

// Definisikan relasi
Pembayaran.belongsTo(Destinasi, { foreignKey: 'destinasi_id' })

export default Pembayaran
;(async () => {
  await db.sync()
})()
