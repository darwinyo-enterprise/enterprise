echo "Creating Gitlab Container..."
bash ./create-gitlab.sh

echo "Creating Gitlab runner..."
bash ./create-fitlab-runner.sh

echo "Setup Gitlab runner..."
bash docker run -it --rm \
  -v /srv/gitlab-runner/config.toml:/etc/gitlab-runner/config.toml \
  gitlab/gitlab-runner:alpine \
    register \
    --executor docker \
    --docker-image docker:18.03.1-ce \
    --docker-volumes /var/run/docker.sock:/var/run/docker.sock