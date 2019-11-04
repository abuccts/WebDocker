WebDocker
=========

A Web based Docker client using dockerd socket and `xterm.js`.

Usage
-----

- Run locally

  ```sh
  $ yarn
  $ yarn start
  ```

- Run with Docker

  ```sh
  $ docker run \
    -it \
    -p 8080:8080 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name webdocker \
    docker.pkg.github.com/abuccts/webdocker/webdocker
  ```

- Deploy as DaemonSet in Kubernetes

  ```sh
  $ kubectl create -f webdocker-ds.yaml
  ```
