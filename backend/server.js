const app = require("./app");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
const cors = require("cors");

app.use(cors());

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to unCaught Exceptions");

  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

// Connecting to DataBase
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working fine on port ${process.env.PORT}`);
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server is shutting down due to unhandled Promise Rejections");

  server.close(() => {
    process.exit(1);
  });
});
