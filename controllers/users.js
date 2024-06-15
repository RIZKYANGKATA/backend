import Users from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import mysql from 'mysql2'

const SECRET_KEY =
  process.env.ACCESS_TOKEN_SECRET || 'qwerttyuio12345asdfghjkl67890zxcvbnm'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wisata', // Nama database Anda
})

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

export const Register = async (req, res) => {
  const { username, email, password } = req.body

  const user = await Users.findOne({ where: { username } })
  if (user) {
    return res.status(404).json({ msg: 'Username sudah ada! ganti username!' })
  }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.create({
      username: username,
      email: email,
      password: hashPassword,
      role: 'user',
    })
    res.json({ msg: 'Register Berhasil' })
  } catch (error) {
    console.log(error)
  }
}

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(400).json({ msg: 'Wrong Password' })
    }

    const { id, name, username, email, phone, role, image, url } = user

    const accessToken = jwt.sign(
      {
        userId: id,
        name,
        username,
        email,
        phone,
        role,
        image,
        url,
      },
      SECRET_KEY,
      {
        expiresIn: '1d',
      },
    )

    await Users.update(
      { refresh_token: accessToken },
      {
        where: {
          id,
        },
      },
    )

    res.json({ accessToken, role, id })
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({
      msg: error.message,
    })
  }
}

export const newPassword = async (req, res) => {
  const { email, password } = req.body

  const query = 'SELECT * FROM user WHERE email = ?'
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err)
      return res.status(500).json({ msg: 'Error fetching user' })
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' })
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const updateQuery = 'UPDATE user SET password = ? WHERE email = ?'
    db.query(updateQuery, [hashPassword, email], (err, result) => {
      if (err) {
        console.error('Error updating password:', err)
        return res.status(500).json({ msg: 'Error updating password' })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: 'Email tidak ditemukan' })
      }

      res.status(200).json({ msg: 'Update Password Berhasil' })
    })
  })
}

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const query = 'SELECT * FROM user WHERE email = ?'
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err)
        return res.status(500).json({ msg: 'Error fetching user' })
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Email tidak ditemukan' })
      }

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'yogamustasfa10@gmail.com',
          pass: 'dkay wqbu jzeu dtoy',
        },
      })

      const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `Klik link ini untuk reset password: http://localhost:5173/setpassword/${email}`,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error:', error)
          res.status(500).json({ msg: 'Gagal mengirim email reset password' })
        } else {
          console.log('Email reset password terkirim:', info.response)
          res.status(200).json({ msg: 'Email reset password berhasil dikirim' })
        }
      })
    })
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ msg: 'Terjadi kesalahan dalam proses reset password' })
  }
}
