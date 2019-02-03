const redis = require('promise-redis')();

class Store{
  constructor(options) {
	this.interval = options.interval;
	this.redis = redis;
	this.client = redis.createClient({host: 'redis'});
  }
  async hit(key) {
    let [counter, dateEnd] = await this.client.multi().get(key).ttl(key).exec();
    console.log(counter);

	if(counter === null) {
	  counter = 1;
	  dateEnd = Date.now() + this.interval;
	  await this.client.setex(key, dateEnd, counter);
	}else {
	  counter = await this.client.incr(key);
	}

	return {
	  counter,
	  dateEnd
	}
  }
}
module.exports = Store;
