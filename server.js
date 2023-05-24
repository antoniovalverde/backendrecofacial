const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : 'dpg-chmsnnik728vrdfpqbe0-a.oregon-postgres.render.com',
    ssl: { rejectUnauthorized: false },
    port: 5432,
    user : 'mydb_zuza_user',
    password : 'Ze83calq4CLu8VoTuPAPoRiMr7DfUgPf',
    database : 'mydb_zuza'
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('success') })
app.post('/signin', signin.handleSignin(db, bcrypt) )
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

//const PORT = process.env.PORT

app.listen(3001, () => {
	console.log(`app is running on port 3001`);
})