#pwd root: grauweb01
rsync -u -e "ssh -p 9090" *.js root@190.81.56.82:/opt/marca2
rsync -u -e "ssh -p 9090" *.json root@190.81.56.82:/opt/marca2
rsync -ru -e "ssh -p 9090" app/* root@190.81.56.82:/opt/marca2/app
rsync -ru -e "ssh -p 9090" config/* root@190.81.56.82:/opt/marca2/config
rsync -ru -e "ssh -p 9090" public/modules/* root@190.81.56.82:/opt/marca2/public/modules
rsync -u -e "ssh -p 9090" public/config.js root@190.81.56.82:/opt/marca2/public/

rsync -r -e "ssh -p 9090" --exclude public/lib --exclude node_modules * root@190.81.56.82:/opt/marca2
