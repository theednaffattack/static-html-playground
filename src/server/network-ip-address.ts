import { networkInterfaces } from "os";

// from: https://stackoverflow.com/a/8440736/9448010
export function netIp() {
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
