

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

// Koneksi ke Database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wisata' // Nama database Anda
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware untuk menangani JSON
app.use(express.json());

// Rute contoh
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register user
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(200).json({ message: 'User registered successfully', userId: result.insertId });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error fetching user' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    try {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Di sini Anda bisa menambahkan logika untuk membuat token JWT jika diperlukan
      // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      // res.status(200).json({ message: 'Login successful', token });

      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email } = req.body

    const query = 'SELECT * FROM users WHERE email = ?'
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
})

// Update password
app.put('/api/update-password', async (req, res) => {
  const { email, password } = req.body

  const query = 'SELECT * FROM users WHERE email = ?'
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

    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?'
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
})

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
