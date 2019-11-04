const util = require("util");
const dockerd = require("./dockerd");

const list = async () => {
  const containers = await util.promisify(dockerd.listContainers.bind(dockerd))({all: true});
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
