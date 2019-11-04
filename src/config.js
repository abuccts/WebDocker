module.exports = {
  server_port: process.env.SERVER_PORT || 8080,
  docker_socket_path: process.env.DOCKER_SOCKET_PATH || "/var/run/docker.sock",
  docker_list_filters: process.env.DOCKER_LIST_FILTERS || `{"status":["running"]}`,
};
