const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const YAML = require("yamljs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocumentation = YAML.load(path.join(__dirname, "o.swagger.yaml"));

// const uiRoutes = require('./routes/uiRoutes');
require("dotenv").config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static("public"));

// Set the 'views' directory as the location for templates
app.set("views", "views");

// routes prefix
app.use("/api/v1", userRoutes);
app.use("/api/v1", taskRoutes);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));

const PORT = process.env.PORT || 3030;

const server = app
  .listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is in use. Trying another port...`);
      const fallbackServer = app.listen(0, () => {
        console.log(
          `Server now running on available port http://localhost:${
            fallbackServer.address().port
          }`
        );
      });
    }
  });
