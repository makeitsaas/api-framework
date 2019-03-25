# Instance

## Docker
```
docker build -t <repo>/<instance-name> .
docker run -p 3001:3000 <repo>/<instance-name>
```

```
docker run --name some-redis -p 6379:6379 redis
docker run -p 80:3000 manual/app_1
docker run -d -p 80:3000 manual/app_1
# docker run -p 80:3000 --network="host" manual/app_1
# docker run -p 80:3000 --hostname db.host manual/app_1
```

```
./node_modules/sequelize-auto/bin/sequelize-auto -o "app/models/schemas" -d <dbname> -h <dbhost> -u <user> -x <password> -p 3306
```


Host requirements :
```
mysql database (might be anywhere)
docker ce (cf website)

sudo apt install python-pip
pip install docker-py

sudo apt-get install nodejs npm
```

## Service
```
context = {
  request: {headers, body, params, query, tracker}, # usual parameters but might only be tracker because headers determines the function to call and body its arguments
  var: {}, # custom variables
  user: {},
  services: {},
  models: {},
  databases: {
    db_name: {queryPool, sequelize, ...}
  },
  cache: {get, set},
  queue: {emit, codes},  # listen se paramètre dans la config, qui appelle un hook
  notify: {send},
  health: {check(serviceName)}
}
```


Requis sur instance :
* ssh key dans known hosts
* docker
* pip et "ansible utils"
* redis sur multi-host-network
* mysql
* proxy up and running

