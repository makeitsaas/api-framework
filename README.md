# Instance

## Docker
```
docker build -t <repo>/<instance-name> .
docker run -p 3001:3000 <repo>/<instance-name>
```


docker compose pourrait amener redis, rabbitmq, nginx (https, cache, ...)


```
./node_modules/sequelize-auto/bin/sequelize-auto -o "app/models/schemas" -d <dbname> -h <dbhost> -u <user> -x <password> -p 3306
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
