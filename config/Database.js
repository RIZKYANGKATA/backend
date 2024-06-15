import { Sequelize } from 'sequelize'
const db = new Sequelize('wisata', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

export default db
