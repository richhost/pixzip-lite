import { net, protocol } from "electron";

export async function registerProtocol() {
  protocol.handle("resource", (request) => {
    return net.fetch("file://" + request.url.replace("resource://", ""));
  });
}
