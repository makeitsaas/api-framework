# Make It SaaS - Service

This is the framework to develop API for a multi-service architectures. Main features :
* Authentication using a separated oauth server (with jwt and jwk)
* Database ORM
* Cache
* Queues (Pub/Sub)

## Getting started

1. Install [devkit](https://github.com/makeitsaas/makeitsaas-devkit)
2. Install [authentication instance](https://github.com/makeitsaas/makeitsaas-auth-instance)
3. Then you can setup your new service :

```
git clone https://github.com/makeitsaas/makeitsaas-microservice my-service
cd my-service
docker build -t my-project/my-service .
docker run -p 3001:3000 my-project/my-service
```

or (with npm) :

```
npm install
cd framework && npm install # will be removed when moved as a package
npm start
```

## Resolvers

Functions that can be binded to routes and have access to the ResolverContext :

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


### Cache

```
framework.cache.set('holidays', {beach: 'volley'});

let subExample = framework.queue.observable('channel-one').subscribe(message => {
console.log('get this message', message);
framework.cache.get('holidays').then(value => console.log('holidays :', value)).catch(err => console.log('error', err));
});

setTimeout(() => framework.queue.publish('channel-one', {foo: 'bar'}), 1000)
setTimeout(() => framework.queue.publish('channel-one', {foo2: 'bar2'}), 2000)
setTimeout(() => (subExample.unsubscribe() || framework.queue.publish('channel-one', {foo3: 'bar3'})), 3000)
```

### Queues Pub/Sub

```
let subExample = framework.queue.observable('channel-one').subscribe(message => {
    console.log('get this message', message);
    framework.cache.get('holidays').then(value => console.log('holidays :', value)).catch(err => console.log('error', err));
});

setTimeout(() => framework.queue.publish('channel-one', {foo: 'bar'}), 1000)
setTimeout(() => framework.queue.publish('channel-one', {foo2: 'bar2'}), 2000)
setTimeout(() => (subExample.unsubscribe(), framework.queue.publish('channel-one', {foo3: 'bar3'})), 3000)
```


### Routing

```yaml
# PROJECT_PATH/config/config.yml
- get: /test/authentication
  handler: handler-example.testResolve
  security: security.rule1
```

