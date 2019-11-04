const util = require("util");
const config = require("./config");
const dockerd = require("./dockerd");

const list = async () => {
  const options = {};
  if (config.docker_list_filters) {
    options.filters = config.docker_list_filters;
  } else {
    options.all = true;
  }
  const containers = await util.promisify(dockerd.listContainers.bind(dockerd))(options);
  return containers;
};

const execute = async (name, duplex) => {
  const container = dockerd.getContainer(name);
  const exec = await util.promisify(container.exec.bind(container))({
    Cmd: ["sh", "-c", "if [ -f /bin/bash ]; then bash; else sh; fi"],
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
    Detach: false,
    Tty: true,
  });
  exec.resize({
    h: process.stdout.rows,
    w: process.stdout.columns,
  });
  const stream = await util.promisify(exec.start.bind(exec))({
    hijack: true,
    stdin: true,
    Detach: false,
    Tty: true,
  });
  stream.on("end", () => {
    duplex.emit("end");
  });
  stream.on("error", (err) => {
    duplex.emit("error", err);
  });
  stream.pipe(duplex);
  duplex.pipe(stream);
};

module.exports = {
  list,
  execute,
};
