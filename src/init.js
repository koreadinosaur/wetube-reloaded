import "dotenv/config";
import "./db";
import "./models/video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
