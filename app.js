
const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = app.set('port', 8080);
const methodOverride = require('method-override');
const cookieSession = require('cookie-session')

var hash;
var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
    };
var users = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//CREATE - C
app.get("/", (req, res) => {
 
  res.render("urls_new");

});

app.get("/register", (req, res) => {
  res.redirect("/");
});

//add url to database 
app.post("/urls", (req, res) => {
  // var parsedObj = JSON.parse(req.body;
  var shortURL = generateRandomString(req.body.longURL);
  const userIDCache = req.session.user_id;
  console.log(shortURL);
  console.log(req.body.longURL);
  if (userIDCache !== undefined) {
    users[userIDCache].urls[shortURL] = req.body.longURL;

  }
 
  console.log(urlDatabase); // debug statement to see POST parameters
  res.redirect(302, `urls/${shortURL}`)
    // Respond with 'Ok' (we will replace this)
});

app.post("/register", (req, res) => {

  const randomuserid = generateRandomID();


  for (let userID in users) {
    let user = users[userID]

    if (user.email === req.body.email) {
      return res.redirect(404, "error");
    }
  }

  if (req.body.email === "" || undefined) {
    res.redirect('error');

  } else if (req.body.password === "" || undefined) {
    res.redirect('error');
  }


  req.session.user_id = randomuserid;
  const user = {
    id: randomuserid,
    email: req.body.email,
    password: hash = bcrypt.hashSync(req.body.password, 10),
    urls: {}

  }


  users[randomuserid] = user;
  res.redirect("login");

});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.post("/login", (req, res) => {

  console.log("this works");
  for (let userID in users) {
    console.log("this works 1");
    let user = users[userID]

    if (user.email === req.body.email && bcrypt.compareSync(req.body.password, hash)) {

      console.log("checking id");
      res.redirect("/");

    } else {
      res.redirect("/error");
    }
  }
});

app.get("/login", (req, res) => {

  res.redirect("/");
});

//RETRIEVE - R
app.get("/urls", (req, res) => {
  const userIDCache = req.session.user_id
  let templateVars = {
    urls: users[userIDCache].urls
  };
  res.render("urls_index", templateVars);
});

//show url by id
app.get("/urls/:id", (req, res) => {
  const userIDCache = req.session.user_id
  let templateVars = {
    shortURL: req.params.id,
    longURL: users[userIDCache].urls[req.params.id],
    usersUrls: users[userIDCache].urls
    };
  
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/error", (req, res) => {
  res.render("error");

});
app.get('/users', (req, res) => res.json(users))

//redirect to id if id is valid in database
app.get("/r/:id", (req, res) => {
  const userIDCache = req.session.user_id;
  let longURL = users[userIDCache].urls[req.params.id];
  if (users[userIDCache].urls[req.params.id] === undefined) {
    res.redirect("/error");
  } else {
    res.redirect(longURL);
  }
});
//UPDATE - U

app.put("/urls/:id", (req, res) => {
  const userIDCache = req.session.user_id;
  users[userIDCache].urls[req.params.id] = req.body.updateURL;
  res.redirect(`/urls/${req.params.id}`);
})

//DELETE -D
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

const generateRandomID = () => {
  let randomID = "";
  var possible = "0123456789";

  for (let i = 0; i < 5; i++)
    randomID += possible.charAt(Math.floor(Math.random() * possible.length));
  return randomID;
};




