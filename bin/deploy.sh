
#!/bin/bash

git checkout master
git pull

echo "##########################################################################"
echo "# Despliegue base de datos                                               #"
echo "##########################################################################"

composer install --dev
php bin/console doctrine:cache:clear-metadata
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load --append
php bin/console cache:clear 

echo "##########################################################################"
echo "# Despliegue dependencias                                                #"
echo "##########################################################################"

composer install 
echo "##########################################################################"
echo "# Permisos para apache                                                    #"
echo "##########################################################################"
sudo chmod -R 777 var/
sudo chown -R www-data:www-data var/
php bin/console cache:clear 

echo -e " --> Terminado el despliegue para produccion\n"