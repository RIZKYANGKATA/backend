import express from 'express'
import {
  Login,
  Register,
  getUsers,
  newPassword,
  resetPassword,
} from './controllers/Users.js'

import {
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
  getAllPembayaran,
  getPembayaranById,
  updatePembayaranStatus,
  updatePembayaranImage,
} from './controllers/Pembayaran.js'
import {
  createDestinasi,
  deleteDestinasi,
  getAllDestinasi,
  getDestinasiById,
  updateDestinasi,
} from './controllers/Destinasi.js'
const router = express.Router()

router.post('/users', Register) // done
router.post('/login', Login) // done

// passsword
router.put('/api/update-password', newPassword)
router.post('/api/reset-password', resetPassword)
router.get('/users', getUsers)

// wisata
router.get('/destinasi', getAllDestinasi)
router.get('/destinasi/:id', getDestinasiById)
router.patch('/destinasi/:id', updateDestinasi)
router.post('/destinasi', createDestinasi)
router.delete('/destinasi/:id', deleteDestinasi)

// pembayaran
router.post('/pembayaran', createPembayaran) // done
router.patch('/pembayaran/:id', updatePembayaran) // done
router.put('/pembayaran/:id/status', updatePembayaranStatus)
router.delete('/pembayaran/:id', deletePembayaran) // done
router.get('/pembayaran', getAllPembayaran) // done
router.get('/pembayaran/:id', getPembayaranById) // done
router.put('/pembayaranimage/:id', updatePembayaranImage) // done

export default router
