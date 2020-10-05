import express from "express";
import colors from "colors";
import path from "path";
import { renderFile } from "ejs";

import { router } from "./routes";
import { netIp } from "./network-ip-address";

const port = 8080;
const address = colors.green(`http://${netIp().en0}:${port}!`);

const app = express();

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

// Static files are found in /public.
app.use(express.static(publicPath));

// Set the server for simple html file engine.
// Views are found in /views.
app.engine("html", renderFile);
app.set("view engine", "html");
app.set("views", viewsPath);

// routes
app.use("/", router);
app.use("/text-animation", router);

app.listen(port, () => {
  console.log(`\n\nYour app is listening at:\n` + address + "\n\n");
});
