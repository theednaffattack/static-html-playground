import express from "express";
import { networkInterfaces } from "os";
import colors from "colors";
import path from "path";
import { renderFile } from "ejs";

import { netIp } from "./network-ip-address";

const port = 8080;
const address = colors.green(`http://${netIp().en0}:${port}!`);

// from: https://stackoverflow.com/a/8440736/9448010
function netIp() {
  const nets = networkInterfaces();
  const results = Object.create(null); // or just '{}', an empty object
  for (const name of Object.keys(nets)) {
    const netInterfaceInfoArray = nets[name];
    // make sure that nets[name] is defined
    if (netInterfaceInfoArray) {
      for (const net of netInterfaceInfoArray) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === "IPv4" && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }

          results[name].push(net.address);
        }
      }
    }
  }
  return results;
}

const app = express();

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");

app.use(express.static(publicPath));

app.engine("html", renderFile);
app.set("view engine", "html");
app.set("views", viewsPath);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.listen(port, () => {
  console.log(`\n\nYour app is listening at:\n` + address + "\n\n");
});