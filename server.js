const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = process.env.PORT || 8080;
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

app.use(bodyParser.json());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  );
  next();
});
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
app.use(cors({ origin: '*' }));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/', require('./routes'));

app.get('/', (req, res) => {
  const loginStatus = req.session.user !== undefined;
  const username = loginStatus ? req.session.user.username : '';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Online Store API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { background: white; padding: 3rem; border-radius: 10px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); max-width: 600px; width: 90%; }
        h1 { color: #333; margin-bottom: 1rem; font-size: 2.5rem; }
        .status { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
        .status-badge { display: inline-block; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 500; }
        .status-badge.logged-in { background: #d4edda; color: #155724; }
        .status-badge.logged-out { background: #f8d7da; color: #721c24; }
        .username { font-weight: 600; color: #667eea; }
        .actions { display: flex; gap: 1rem; margin-top: 2rem; }
        a { text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 5px; font-weight: 500; transition: all 0.3s ease; display: inline-block; }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5568d3; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-secondary:hover { background: #5a6268; box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4); }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4); }
        .description { color: #666; margin-top: 1.5rem; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🛍️ Online Store API</h1>
        <div class="status">
          <span class="status-badge ${loginStatus ? 'logged-in' : 'logged-out'}">
            ${loginStatus ? '✓ Logged In' : '✗ Logged Out'}
          </span>
          ${loginStatus ? `<span class="username">@${username}</span>` : ''}
        </div>
        <p class="description">
          Welcome to the Online Storefront API. Manage products, customers, orders, and employees with full CRUD operations.
        </p>
        <div class="actions">
          ${loginStatus ? `<a href="/logout" class="btn-danger">Logout</a>` : `<a href="/login" class="btn-primary">Sign In with GitHub</a>`}
          <a href="/api-docs" class="btn-secondary">API Documentation</a>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  },
);

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
