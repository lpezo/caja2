stop caja
meteor build /var/ww/caja
mkdir /var/ww/caja
cd /var/ww/caja
rm bundle -rf
tar zxvf caja2.tar.gz
cd bundle/programs/server
npm install
start caja
