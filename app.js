const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = app.set('port', 8080);
const methodOverride = require('method-override');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride("_method"));



//where to create new urls
//CREATE - C
app.get("/", (req, res) => {
  res.render("urls_new");
});

//add url to database 
app.post("/urls", (req, res) => {
  // var parsedObj = JSON.parse(req.body;
  var shortURL = generateRandomString(req.body.longURL);
  console.log(shortURL);
  console.log(req.body.longURL);  
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);// debug statement to see POST parameters
  res.redirect(302, `urls/${shortURL}`)  
   // Respond with 'Ok' (we will replace this)
});
//RETRIEVE - R
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//show url by id
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  console.log(templateVars);
  
  res.render("urls_show", templateVars);
});

app.get("/error", (req, res) => {
  res.render("error");

});

//redirect to id if id is valid in database
app.get("/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id];
  if (urlDatabase[req.params.id] === undefined) {
    res.redirect("/error");
  } else {
    res.redirect(longURL);
  }
});


//DELETE -D
app.delete("/urls/:shortURL", (req, res) => {
  if (urlDatabase.hasOwnProperty(req.params.shortURL)) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect(302, "/urls");
  
});


app.listen(app.get('port'), () => {
  console.log(`Express server is now running on port: ${app.get('port')}`);

});


const generateRandomString = () => {
  let randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 6; i++ )
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  return  randomString;
};
