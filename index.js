const express = require('express');  
const morgan = require('morgan');  
const users = require('./users');  

const app = express();  
const PORT = process.env.PORT || 3000;  

// Middlewares  
app.use(morgan('combined')); // Menggunakan Morgan untuk mencatat log  
app.use(express.json()); // Untuk parsing JSON  

// Endpoint untuk mendapatkan semua user  
app.get('/users', (req, res) => {  
  res.json(users);  
});  

// Endpoint untuk mendapatkan user berdasarkan nama  
app.get('/users/:name', (req, res) => {  
  const userName = req.params.name.toLowerCase();  
  const user = users.find(u => u.name.toLowerCase() === userName);  

  if (user) {  
    res.json(user);  
  } else {  
    res.status(404).json({  
      status: "error",  
      message: "resource tidak ditemukan"  
    });  
  }  
});  

// Routing 404  
app.use((req, res, next) => {  
  res.status(404).json({  
    status: "error",  
    message: "resource tidak ditemukan"  
  });  
});  

// Penanganan Error  
app.use((err, req, res, next) => {  
  console.error(err.stack); // Mencetak error ke console  
  res.status(500).json({  
    status: "error",  
    message: "terjadi kesalahan pada server"  
  });  
});  

// Menjalankan server  
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);  
});
