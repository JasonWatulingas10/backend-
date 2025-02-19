const express = require('express')  
const app = express()  
const port = 3000
const moment = require('moment')

const log = (req, res, next) => {
    console.log(
        moment().format("h:mm:ss a") + " " + req.originalUrl + " " + req.ip
    );
    next();
};

app.use(log);

//middleware untuk error

const errorHandling = (err, req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "terjadi kesalahan pada server",
    });
};
app.use(errorHandling);

app.get('/', (req, res) => res.send('This is the home'))
app.get('/about', (req, res) => res.status(200).json({
    status: 'success',
    message: 'responses success',
    description: 'Exercise #2',
    date: '2023-02-09T07:51:09+08:00',
    data: []

}))
app.get('/users', (req, res) => res.status(200).json({
    id: '1',
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
    address: '2',
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
    geo: '3', 
            lat: "-37.3159",
            lng: "81.1496",
    data: []

}))

app.get('/', (req, res) => res.send('Hello World!')) // <= tambahkan ini  
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))