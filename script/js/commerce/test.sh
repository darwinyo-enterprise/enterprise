sudo npm cache clean -f
sudo npm install -g n
sudo n stable

node --version

cd ./js/enterprise-nx6-workspace
npm install
npm run test:all