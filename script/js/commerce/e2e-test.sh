cd ./net/
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
cd ./js/enterprise-nx6-workspace
npm install
npm run e2e:all