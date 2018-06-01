docker run --name gitlab-postgresql -d -itd --restart always \
    --publish 5432:5432 \
    --env 'DB_NAME=gitlabhq_production' \
    --env 'DB_USER=gitlab' --env 'DB_PASS=password' \
    --env 'DB_EXTENSION=pg_trgm' \
    --volume /srv/docker/gitlab/postgresql:/var/lib/postgresql \
    sameersbn/postgresql:9.6-2

docker run --name gitlab-redis -d \
    --volume /srv/docker/gitlab/redis:/var/lib/redis \
    sameersbn/redis:latest

docker run --name gitlab -d \
    --link gitlab-postgresql:postgresql --link gitlab-redis:redisio \
    --publish 10022:22 --publish 10080:80 \
    --env 'GITLAB_PORT=10080' --env 'GITLAB_SSH_PORT=10022' \
    --env 'GITLAB_SECRETS_DB_KEY_BASE=CpKwrdMRxjnWz4WrsXTNrMJwnWdVNxtw4mkqW4vwnxXtnbt49fNKcbv3F4qmLCVH' \
    --env 'GITLAB_SECRETS_SECRET_KEY_BASE=XPpHvRcbz3NcscPPHCs3dLqgx7J7Kzxnv3RKxkTbTqH3qKKFTfKhhfkmR4w4Wj9t' \
    --env 'GITLAB_SECRETS_OTP_KEY_BASE=VWkdtcrW4kzJhLsMmKkbtw7NpFMnh7btxnNM7rbnvcVgHsv79LLpJVvRjtr3LVqF' \
    --volume /srv/docker/gitlab/gitlab:/home/git/data \
    sameersbn/gitlab:10.8.1