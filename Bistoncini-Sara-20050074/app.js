'use strict';

const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const path = require('path');
const port = 3000;
const app = express();

//Passport local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
  dao.getUser(username).then((user) => {
  if (!user) { return done(null, false, {
  message: 'Incorrect username.' }); }
  if (!user.checkPassword(password)) {
  return done(null, false, { message:
  'Incorrect password.' });
  }
  return done(null, user);
  });
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport additional middleware
app.use(express.static('public'));

app.use(session({
  secret: "c23ac071b92a1cc39f23abed6ba70736c758b436d79d6b8f6b4250993b2b541f",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Session personalization
passport.serializeUser(function(user, done)
{
  done(null, user.id);
});

passport.deserializeUser(function(id, done)
{
  dao.getUserById(id).then((user) => {
    done(null, user);
  })
  .catch((err) => {
    done(err, user);
  });
});

//Login with passport
app.post('/api/login', passport.authenticate('local'), (req,res) => {
  // This function is called if authentication is successful.
  // req.user contains the authenticated user.
  res.json(req.user.username);
  });


app.listen(port, '127.0.0.1', () => {
    console.log('http://localhost:3000/ \n');                                                                                                          
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contacts', (req, res) => {
  res.render('contacts');
});

app.get('/addbooks', (req, res) => {
  res.render('addbooks');
});

app.get('/mybooks', (req, res) => {
  res.render('mybooks');
});

app.get('/reviews', (req, res) => {
  res.render('reviews');
});

app.get('/newsletter', (req, res) => {
  res.render('newsletter');
});

app.get('/newsletter-thankyou', (req, res) => {
  res.render('newsletter-thankyou');
});

app.get('/notifications', (req, res) => {
  res.render('notifications');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Collega il database
const dbPath = path.join(__dirname, 'database', 'my_readings.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Errore durante l'apertura del database:", err.message);
    } else {
        console.log("Connessione al database riuscita.");
    }
});

// Passa i libri dal database al sito
app.get('/books', (req, res) => {
  const query = 'SELECT * FROM Books'; 
  db.all(query, [], (err, rows) => {
      if (err) {
          console.error('Errore nel recupero dei dati:', err.message);
          res.status(500).send('Errore nel recupero dei dati'); 
      } else {
          res.render('books', { books: rows }); // Passa i libri al template
      }
  });
});