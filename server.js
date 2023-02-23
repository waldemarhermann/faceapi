const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const PORT = process.env.PORT

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host: 'dpg-cfmcgbta499591dusvi0-a.frankfurt-postgres.render.com',
        user: 'apiforfaceapp_user',
        database: 'apiforfaceapp',
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
app.post('/signin', signin.handleSignin(req, res, db, bcrypt))
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(PORT, () => {
    console.log(`running on PORT: ${PORT}`);
});
