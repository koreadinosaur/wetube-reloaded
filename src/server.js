import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
  return res.send("hi");
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

app.get("/", handleHome);
app.get("/about", handleAbout);
app.get("/contact", handleContact);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
