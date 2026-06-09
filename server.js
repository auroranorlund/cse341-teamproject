const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = process.env.PORT || 8080;
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors')

app.use(bodyParser.json());

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))


app.use(passport.initialize())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    next();
})
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
app.use(cors({ origin: '*' }))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
    }))

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.use('/', require('./routes'));

app.get('/', (req, res) => {
  res.send(
    req.session.user !== undefined ? `Welcome to the Online Store API. <br> You are logged in as ${req.session.user.username}. <br> <a href='/api-docs'>API Documentation</a>` : `Welcome to the Online Store API. <br> You are logged out. <br> <a href='/api-docs'>API Documentation</a>`
  )
})

app.get('/github/callback', passport.authenticate('github', {failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
});

process.on('uncaughtException', (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`,
  );
});

mongodb.initDatabase(err => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log('Web server is listening at port ' + port);
    console.log('Database is connected!');
  }
});
