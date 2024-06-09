const express = require("express");
const response = require("../helper/respons");
const destinasi = express.Router();
const multer = require('multer');
const {  addDestinasi, fetchDestinasi, deleteDestinasi, fetchDestinasitById } = require("../controllers/wisata");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');

destinasi.route("/upload").post(async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      response.error({ error: 'Error uploading image.' }, req.originalUrl, 500, res);
    } else if (err) {
      response.error({ error: 'Unknown error uploading image.' }, req.originalUrl, 500, res);
    } else {
      const data = {
        nama: req.body.nama,
        harga: req.body.harga,
        daerah: req.body.daerah,
        informasi: req.body.informasi,
        image: req.file ? req.file.filename : null,
      };

      try {
        const result = await addDestinasi(data);
        response.success(result, 'destinasi created!', res);
      } catch (error) {
        response.error({ error: 'Error saving destinasi to database.' }, req.originalUrl, 500, res);
      }
    }
  });
});

//get berdasarkan id
destinasi.route("/wisata/:id").get(async (req, res) => {
  const destinasiId = req.params.id;

  try {
    const result = await fetchDestinasitById(destinasiId);
    
    if (result) {
      // Pastikan untuk mengirimkan path gambar yang benar
      result.image = result.image ? `http://localhost:3000/uploads/${result.image}` : null;

      response.success(result, `destinasi with ID ${destinasiId} fetched!`, res);
    } else {
      response.error({ error: `destinasi with ID ${destinasiId} not found.` }, req.originalUrl, 404, res);
    }
  } catch (err) {
    response.error({ error: err.message }, req.originalUrl, 500, res);
  }
});

//get

// Endpoint untuk fetch produk (sudah ada)
destinasi.route("/wisata").get(async (req, res) => {
  try {
      const result = await fetchDestinasi();
      // Pastikan untuk mengirimkan path gambar yang benar
      const destinasiWithImageUrl = result.map(destinasi => ({
          ...destinasi,
          image: `http://localhost:3000/uploads/${destinasi.image}`
      }));
      response.success(destinasiWithImageUrl, "Destinasi fetched!", res);
  } catch (err) {
      response.error({ error: err.message }, req.originalUrl, 403, res);
  }
});


destinasi.route("/wisata/:id").delete(async (req, res) => {
	const destinasiId = req.params.id;
  
	try {
	  const result = await deleteDestinasi(destinasiId);
	  response.success(result, 'Destinasi deleted!', res);
	} catch (error) {
	  response.error({ error: 'Error deleting Destinasi from database.' }, req.originalUrl, 500, res);
	}
  });


  destinasi.route("/wisata/:id/edit").put(async (req, res) => {
    const destinasiId = req.params.id;
  
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        response.error({ error: 'Error uploading image.' }, req.originalUrl, 500, res);
      } else if (err) {
        response.error({ error: 'Unknown error uploading image.' }, req.originalUrl, 500, res);
      } else {
        // Data destinasi yang akan diubah
        try {
          const existingDestinasi = await fetchDestinasitById(destinasiId);
  
          const data = {
            nama: req.body.nama || existingDestinasi.nama,
            harga: req.body.harga || existingDestinasi.harga,
            informasi: req.body.informasi || existingDestinasi.informasi,
            daerah: req.body.daerah || existingDestinasi.daerah,
            image: req.file ? req.file.filename : existingDestinasi.image,
          };
  
          const result = await updateDestinasi(destinasiId, data);
          response.success(result, 'Destinasi berhasil diperbarui!', res);
        } catch (error) {
          response.error({ error: 'Error updating destinasi in database.' }, req.originalUrl, 500, res);
        }
      }
    });
  });
  

module.exports = destinasi;

