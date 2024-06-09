const db = require("../config/connection"); 
const multer = require('multer');

exports.fetchDestinasi = async () => {
    try {
        const query = await db.query("SELECT * FROM destinasi");
        return query;
    } catch (error) {
        console.error("Error fetching destinasi:", error);
        throw new Error("Error fetching destinasi from database.");
    }
};


// Konfigurasi multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Folder tempat menyimpan gambar
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nama file yang disimpan
    },
  });
  
  const upload = multer({ storage: storage }).single('image'); // 'image' adalah nama field di form
  
  exports.addDestinasi = async (data) => {
    try {
      const query = await db.query("INSERT INTO destinasi SET ?", [data]);
      return { id: query.insertId };
    } catch (error) {
      console.error("Error saving destinasi to database:", error);
      throw new Error('Error saving destinasi to database.');
    }
  };


  exports.deleteDestinasi = async (destinasiId) => {
    try {
      const query = await db.query("DELETE FROM destinasi WHERE id = ?", [destinasiId]);
      return { message: 'Destinasi deleted successfully.' };
    } catch (error) {
      console.error("Error deleting Destinasi from database:", error);
      throw new Error('Error deleting Destinasi from database.');
    }
  };


  exports.fetchDestinasitById = async (destinasiId) => {
    try {
        const query = await db.query("SELECT * FROM destinasi WHERE id = ?", [destinasiId]);
        return query[0];
    } catch (error) {
        console.error("Error fetching destinasi by ID from database:", error);
        throw new Error('Error fetching destinasi by ID from database.');
    }
}; 
  //update
  exports.updateDestinasi = async (destinasiId, data) => {
    try {
      const { nama, harga, informasi, daerah, image } = data;
      const query = await db.query("UPDATE destinasi SET nama = ?, harga = ?, kategori = ?, stock = ?, image = ? WHERE id = ?", [nama, harga, informasi, daerah, image, destinasiId]);
  
      if (query.affectedRows > 0) {
        return { message: 'Destinasi updated successfully.' };
      } else {
        throw new Error('No rows were affected by the update.');
      }
    } catch (error) {
      console.error("Error updating product in database:", error);
      throw new Error('Error updating product in database. ' + error.message);
    }
  };