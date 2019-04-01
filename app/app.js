require('../framework/core/core').then(framework => {
  let subLogs = framework.queue.observable('logs').subscribe(message => {
    console.log('some log', message);
  });

  framework.queue.observable('entity-change').subscribe(message => {
    console.log('=> entity-change :');
    console.log(message);
  })

  /*
  // DEMOS

  framework.cache.set('holidays', {beach: 'volley'});

  let subExample = framework.queue.observable('channel-one').subscribe(message => {
    console.log('get this message', message);
    framework.cache.get('holidays').then(value => console.log('holidays :', value)).catch(err => console.log('error', err));
  });

  setTimeout(() => framework.queue.publish('channel-one', {foo: 'bar'}), 1000)
  setTimeout(() => framework.queue.publish('channel-one', {foo2: 'bar2'}), 2000)
  setTimeout(() => (subExample.unsubscribe() || framework.queue.publish('channel-one', {foo3: 'bar3'})), 3000)
  */
}).catch((e) => console.log('error', e));
