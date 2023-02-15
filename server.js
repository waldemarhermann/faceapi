const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: '{dpg-cfmb94qrrk07m3t1kq90-a}',
        user: '{faceapi_user}',
        database: '{faceapi}',
        password: process.env.DB_PASSWORD,
        port: 5432,
        ssl: true,
    },
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('it works') })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`running on PORT: ${process.env.PORT}`);
});