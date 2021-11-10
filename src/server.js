import express from "express";

const PORT = 4000;

const app = express();

const urlLogger = (req, res, next) => {
  console.log(`Path: ${req.url}`);
  next();
};

const timeLogger = (req, res, next) => {
  const today = new Date();
  console.log(
    `Time: ${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`
  );
  next();
};

const securityLogger = (req, res, next) => {
  console.log(req.protocol);
  if (req.protocol === "https") {
    console.log("secure");
  } else {
    console.log("insecure");
  }
  next();
};

const handleHome = (req, res) => {
  return res.send("<h1>Have a nice day!</h1>");
};

const protectedLogger = (req, res) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>");
  }
};

app.use(urlLogger);
app.use(timeLogger);
app.use(securityLogger);
app.get("/", handleHome);
app.get("/protected", protectedLogger);

const handleListening = () =>
  console.log(`server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
