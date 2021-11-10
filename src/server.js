import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
  next();
};

const handleHome = (req, res) => {
  return res.send("hi");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge");
};

const handleAbout = (req, res) => {
  return res.send("about here");
};
const handleContact = (req, res) => {
  res.send("I miss you");
};
const handleLogin = (req, res) => {
  res.send("login");
};

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/protected", handleProtected);

app.get("/about", handleAbout);
app.get("/contact", handleContact);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
