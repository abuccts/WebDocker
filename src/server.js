const url = require("url");
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const mustacheExpress = require("mustache-express");
const config = require("./config");
const containers = require("./containers");

// create http server
const server = http.createServer();

// create express app
const app = express();
server.on("request", app);

const asyncHandler = (middleware) => {
  return (req, res, next) => {
    Promise
      .resolve(middleware(req, res, next))
      .catch(next);
  };
};

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "public");

app.use(express.static("public"));
app.use(express.static("node_modules"));

app.get("/", (req, res) => res.redirect("/containers"));
app.get("/containers", asyncHandler(async(req, res) => {
  res.render("list", {
    containers: await containers.list(),
    running: function() {
      return this.State === "running";
    },
  });
}));
app.get("/containers/:name/exec", asyncHandler(async(req, res) => {
  res.render("exec", {
    name: req.params.name,
  });
}));

// create websocket server
const wss = {
  exec: new WebSocket.Server({noServer: true}),
};
server.on("upgrade", (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;
  if (pathname === "/exec") {
    wss.exec.handleUpgrade(req, socket, head, (ws) => {
      wss.exec.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.exec.on("connection", async (ws, req) => {
  const query = url.parse(req.url, true).query;
  const duplex = WebSocket.createWebSocketStream(ws, {encoding: "utf-8"});
  duplex.on("end", () => {
    ws.close(1000);
  });
  duplex.on("error", (err) => {
    ws.close(1011, err.message);
  });

  ws.send("\x1B[1;3;31mWebDocker Terminal\x1B[0m \r\n");
  try {
    await containers.execute(query.name, duplex);
  } catch (err) {
    ws.close(1011, err.message);
  }
});

// start http server
server.listen(config.server_port, () => {
  console.log("Using config: %j.", config);
  console.log("Starting WebDocker Server at localhost:%s ...", config.server_port);
});
