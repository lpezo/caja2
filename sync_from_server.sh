rsync -ru -e "ssh -p 9090" root@mark:/opt/caja2/* . --exclude ".meteor/" --exclude "node_modules/" --exclude "dump/" -v
