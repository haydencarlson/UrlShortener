var express = require('express');
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // var parsedObj = JSON.parse(req.body;
  
  var shortURL = generateRandomString(req.body.longURL);
  console.log(shortURL);
  console.log(req.body.longURL);  
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);// debug statement to see POST parameters
  if (shortURL === undefined) {
    console.log("Not url");
  } else {
  res.redirect(`urls/${shortURL}`)  
  }    // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  console.log(templateVars);
  
  res.render("urls_show", templateVars);
});
app.get("/:id", (req, res) => {
  let longURL = urlDatabase[req.params.id] 
  if (longURL === undefined) {
   console.log("Not a URL");
} else {

  res.redirect(longURL);
}
});




app.listen(PORT, () => {
  console.log(`Express server is now running on port: ${PORT}`);

});


const generateRandomString = () => {
  let randomString = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( let i=0; i < 6; i++ )
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));
  return  randomString;
};
