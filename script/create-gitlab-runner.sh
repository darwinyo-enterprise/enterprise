docker run -d \
  --name gitlab-runner \
  --restart always \
  --network gitlab-runner-net \
  -v /srv/gitlab-runner/config.toml:/etc/gitlab-runner/config.toml \
  -e DOCKER_HOST=tcp://gitlab-dind:2375 \
  127.0.0.1:30400/gitlab/gitlab-runner:alpine