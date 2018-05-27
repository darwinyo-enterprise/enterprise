sudo docker run --detach \
    --hostname gitlab.enterprise.com \
    --publish 443:443 --publish 80:80 --publish 23:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    127.0.0.1:30400/gitlab/gitlab-ce:latest
