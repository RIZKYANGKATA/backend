import fs from 'fs'
import path from 'path'
import Pembayaran from '../models/PembayaranModel.js'
import User from '../models/UserModel.js'
import Destinasi from '../models/DestinasiModel.js'
import { v4 as uuidv4 } from 'uuid'

const generateNoId = () => {
  return `TR-${uuidv4().split('-')[0]}` // Example: MVC-1234abcd
}
// Get all payments with related data
export const getAllPembayaran = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findAll({
      include: [
        {
          model: Destinasi,
          attributes: ['id', 'nama', 'harga', 'informasi', 'daerah', 'url'],
        },
      ],
    })
    res.status(200).json(pembayaran)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get payment by ID with related data
export const getPembayaranById = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Destinasi,
          attributes: ['id', 'nama', 'harga', 'informasi', 'daerah', 'url'],
        },
      ],
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }
    res.status(200).json(pembayaran)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Create new payment
export const createPembayaran = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    tanggal_pergi,
    tanggal_pulang,
    jumlah_wisatawan,
    no_rekening,
    destinasi_id,
  } = req.body

  const no_transaksi = generateNoId()
  let fileName = ''

  // Check if a file is uploaded
  if (req.files && req.files.image) {
    const file = req.files.image
    const fileSize = file.size
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

    const allowedType = ['.png', '.jpg', '.jpeg']
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image type' })
    }
    if (fileSize > 5000000) {
      return res.status(422).json({ msg: 'Max image size is 5MB' })
    }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
    })
  }

  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

  // qris

  let fileNameqris = ''

  // Check if a file is uploaded
  if (req.files && req.files.image) {
    const file = req.files.image
    const fileSize = file.size
    const ext = path.extname(file.name)
    fileNameqris = file.md5 + ext

    const allowedType = ['.png', '.jpg', '.jpeg']
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image type' })
    }
    if (fileSize > 5000000) {
      return res.status(422).json({ msg: 'Max image size is 5MB' })
    }

    file.mv(`./public/images/${fileNameqris}`, (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
    })
  }

  const urlqris = `${req.protocol}://${req.get('host')}/images/${fileNameqris}`

  // bukti bayar
  let fileNamebukti = ''

  // Check if a file is uploaded
  if (req.files && req.files.image) {
    const file = req.files.image
    const fileSize = file.size
    const ext = path.extname(file.name)
    fileNamebukti = file.md5 + ext

    const allowedType = ['.png', '.jpg', '.jpeg']
    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({ msg: 'Invalid image type' })
    }
    if (fileSize > 5000000) {
      return res.status(422).json({ msg: 'Max image size is 5MB' })
    }

    file.mv(`./public/images/${fileNamebukti}`, (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message })
      }
    })
  }

  const urlbukti = `${req.protocol}://${req.get(
    'host',
  )}/images/${fileNamebukti}`

  try {
    const pembayaran = await Pembayaran.create({
      no_transaksi,
      first_name,
      last_name,
      email,
      phone_number,
      tanggal_pergi,
      tanggal_pulang,
      jumlah_wisatawan,
      no_rekening,
      status: 'upcoming',
      image_qris: fileNameqris,
      url_qris: urlqris,
      bukti_bayar: fileNamebukti,
      url_bukti: urlbukti,
      image: fileName,
      url: url,
      status_terima: 'Belum Diterima',
      destinasi_id: destinasi_id,
    })
    res.status(201).json({ msg: 'Pembayaran berhasil dibuat', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update payment
export const updatePembayaran = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    tanggal_pergi,
    tanggal_pulang,
    jumlah_wisatawan,
    no_rekening,
  } = req.body
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    let fileName = ''

    // Check if a file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileName = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }
      })
    }

    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

    // qris

    let fileNameqris = ''

    // Check if a file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileNameqris = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileNameqris}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }
      })
    }

    const urlqris = `${req.protocol}://${req.get(
      'host',
    )}/images/${fileNameqris}`

    // bukti bayar
    let fileNamebukti = ''

    // Check if a file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileNamebukti = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileNamebukti}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }
      })
    }

    const urlbukti = `${req.protocol}://${req.get(
      'host',
    )}/images/${fileNamebukti}`

    pembayaran.first_name = first_name
    pembayaran.last_name = last_name
    pembayaran.email = email
    pembayaran.phone_number = phone_number
    pembayaran.tanggal_pergi = tanggal_pergi
    pembayaran.tanggal_pulang = tanggal_pulang
    pembayaran.jumlah_wisatawan = jumlah_wisatawan
    pembayaran.no_rekening = no_rekening
    pembayaran.image_qris = fileNameqris
    pembayaran.url_qris = urlqris
    pembayaran.bukti_bayar = fileNamebukti
    pembayaran.url_bukti = urlbukti
    pembayaran.image = fileName
    pembayaran.url = url
    await pembayaran.save()
    res.status(200).json({ msg: 'Pembayaran berhasil diupdate', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message, data: 'error gagal nih' })
  }
}

// Update payment status only
export const updatePembayaranStatus = async (req, res) => {
  // const { status_terima } = req.body
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    pembayaran.status_terima = 'Sudah Diterima'
    pembayaran.status = 'Done'
    await pembayaran.save()
    res
      .status(200)
      .json({ msg: 'Status pembayaran berhasil diupdate', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete payment
export const deletePembayaran = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    // Optionally remove the payment's image
    if (pembayaran.image) {
      const filePath = `./public/images/${pembayaran.image}`
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Failed to remove image:', err)
        }
      })
    }

    await pembayaran.destroy()
    res.status(200).json({ msg: 'Pembayaran berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const updatePembayaranImage = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    let fileName = ''

    // Check if a file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileName = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }
      })
    }

    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

    pembayaran.bukti_bayar = fileName
    pembayaran.url_bukti = url
    await pembayaran.save()
    res.status(200).json({ msg: 'Pembayaran berhasil diupdate', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message, data: 'error gagal nih' })
  }
}
