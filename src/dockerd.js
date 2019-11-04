const fs = require("fs");
const Docker = require("dockerode");
const config = require("./config");

if (!fs.statSync(config.docker_socket_path).isSocket()) {
  throw new Error(`Cannot connect to ${config.docker_socket_path}.`);
}
const dockerd = new Docker({socketPath: config.docker_socket_path});

module.exports = dockerd;
