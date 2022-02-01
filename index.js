const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
  res.render("index", {
    data: null,
  });
});

app.post("/", async(req, res) => {
  let website = req.body.website;
  if (!validateUrl(website)) return res.render('index', {
    data: { error: "That Does Not Look Like A Valid Website" }
  })

  let response = await fetch(`https://isitup.org/${website.replace("https://", "")}.json`);
  response = await response.json();

  if (response.status_code === 1) {
    return res.render("index", {
    data: { success: `Website Is Up With Response Time Of ${response.response_time} Secs` }
  })
  } else {
    return res.render("index", {
    data: { error: "Website Is Down" }
  })
  }
});

app.listen(3000, () => {
  console.log("server started");
});

function validateUrl(url) {
  let res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
}