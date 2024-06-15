import Destinasi from '../models/DestinasiModel.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

// Create a new destinasi
export const createDestinasi = async (req, res) => {
  const { nama, harga, informasi, daerah, user_id } = req.body

  let fileName = ''

  // Check if a new file is uploaded
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

  try {
    const newDestinasi = await Destinasi.create({
      nama,
      harga,
      informasi,
      daerah,
      image: fileName,
      url: url,
      user_id,
    })
    res.status(201).json(newDestinasi)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Get all destinasi
export const getAllDestinasi = async (req, res) => {
  try {
    const destinasi = await Destinasi.findAll()
    res.status(200).json(destinasi)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Get a single destinasi by ID
export const getDestinasiById = async (req, res) => {
  try {
    const destinasi = await Destinasi.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!destinasi) {
      return res.status(404).json({ msg: 'Destinasi not found' })
    }

    res.status(200).json(destinasi)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Update a destinasi by ID
export const updateDestinasi = async (req, res) => {
  try {
    const destinasi = await Destinasi.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!destinasi) {
      return res.status(404).json({ msg: 'Destinasi not found' })
    }

    let fileName = destinasi.image

    // Check if a new file is uploaded
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

    const { nama, harga, informasi, daerah } = req.body

    await destinasi.update({
      nama,
      harga,
      informasi,
      daerah,
      image: fileName,
      url: url,
    })

    res.status(200).json({ msg: 'Destinasi updated successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Delete a destinasi by ID
export const deleteDestinasi = async (req, res) => {
  try {
    const destinasi = await Destinasi.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!destinasi) {
      return res.status(404).json({ msg: 'Destinasi not found' })
    }

    await destinasi.destroy()
    res.status(200).json({ msg: 'Destinasi deleted successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}
