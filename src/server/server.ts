import express from "express";
import { networkInterfaces } from "os";
import colors from "colors";
import path from "path";
import { renderFile } from "ejs";

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

app.get("/text-animation-basics", (req, res) => {
  res.render("text-animation-basics.html");
});

app.get("/particle-text", (req, res) => {
  res.render("particle-text.html");
});

// connected-particle-text
app.get("/connected-particle-text", (req, res) => {
  res.render("connected-particle-text.html");
});

// liquid-bubbles
app.get("/liquid-bubbles", (req, res) => {
  res.render("liquid-bubbles.html");
});

// bubble-text route (bubble-particle-text source file naming used)
app.get("/bubble-text", (req, res) => {
  res.render("bubble-text.html");
});

app.listen(port, () => {
  console.log(`\n\nYour app is listening at:\n` + address + "\n\n");
});
