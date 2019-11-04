module.exports = {
  server_ip: process.env.SERVER_IP || "0.0.0.0",
  server_port: process.env.SERVER_PORT || 8080,
  docker_socket_path: process.env.DOCKER_SOCKET_PATH || "/var/run/docker.sock",
};
