const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = app.set('port', 8080);
const methodOverride = require('method-override');
const cookieSession = require('cookie-session')
var urlDatabase = {};
var users = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(methodOverride("_method"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.get("/", (req, res) => {
  res.render("urls_new");
});

app.get("/register", (req, res) => {
  res.redirect("/");
});

app.post("/urls", (req, res) => {
  var shortURL = generateRandomString(req.body.longURL);
  const userIDCache = req.session.user_id;
  if (userIDCache === undefined) {
    res.send("Not Logged In");
    
  } else {
    users[userIDCache].urls[shortURL] = req.body.longURL;
    urlDatabase[shortURL] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect(302, `urls/${shortURL}`);
  }
});

app.post("/register", (req, res) => {
  const randomuserid = generateRandomString();

  for (let userID in users) {
    let user = users[userID];
    if (user.email === req.body.email) {
      return res.redirect(400, "error");
    }
  }

  if (!req.body.email) {
    res.send("Please enter an email");

  } else if (!req.body.password) {
    res.send("Please enter a password");
  }

  req.session.user_id = randomuserid;
  const user = {
    id: randomuserid,
    email: req.body.email,
    password: hash = bcrypt.hashSync(req.body.password, 10),
    urls: {}

  }
  users[randomuserid] = user;
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.post("/login", (req, res) => {
  for (let userID in users) {
    let user = users[userID];
    if (user.email === req.body.email && bcrypt.compareSync(req.body.password, hash)) {
      res.redirect("/");
    } else {
      res.redirect("/error");
    }
  }
});

app.get("/login", (req, res) => {
  res.redirect("/");
});

app.get("/urls", (req, res) => {
  const userIDCache = req.session.user_id;
  let templateVars = {
    urls: users[userIDCache].urls
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userIDCache = req.session.user_id;
  let templateVars = {
    shortURL: req.params.id,
    longURL: users[userIDCache].urls[req.params.id],
    usersUrls: users[userIDCache].urls
  };
  res.render("urls_show", templateVars);
});

app.get("/error", (req, res) => {
  res.render("error");

});

app.get("/u/:id", (req, res) => {
  const userIDCache = req.session.user_id;
  if (!userIDCache) {
    var longURL1 = urlDatabase[req.params.id];
    console.log(longURL1);
    res.redirect(longURL1)
  } else   {

    var longURL = users[userIDCache].urls[req.params.id];
    res.redirect(longURL);
  }
  
    
  
});

app.put("/urls/:id", (req, res) => {
  const userIDCache = req.session.user_id;
  users[userIDCache].urls[req.params.id] = req.body.updateURL;
  res.redirect(`/urls/${req.params.id}`);
})

app.delete("/urls/:shortURL", (req, res) => {
  const userIDCache = req.session.user_id;
  if (users[userIDCache].urls.hasOwnProperty(req.params.shortURL)) {
    delete users[userIDCache].urls[req.params.shortURL];
  }
  res.redirect(302, "/urls");
});

app.listen(app.get('port'), () => {
  console.log(`Express server is now running on port: ${app.get('port')}`);

});

const generateRandomString = () => {
  let randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (let i = 0; i < 6; i++)
    randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  return randomString;
};

