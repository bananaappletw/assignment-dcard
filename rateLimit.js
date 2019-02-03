const STATUS_CODE = 429;
const MESSAGE = "Error";

const Store = require('./store');
class RateLimit {
  constructor(options) {
	this.capacity = options.capacity;
    this.store = new Store(options);
  }

  async getIp(ctx) {
	return ctx.request.ip;
  }

  get middleware() {
    console.log(this);
    return this._ratelimit.bind(this);
  }

  async _ratelimit (ctx, next) {
	const ip = await this.getIp(ctx);
	const { counter, dateEnd } = await this.store.hit(ip);
	const reset = new Date(dateEnd).getTime();
	ctx.state.rateLimit = {
	  limit: this.capacity,
	  current: counter,
	  remaining: Math.max(this.capacity - counter, 0),
	  reset: Math.ceil(reset / 1000),
	};

    ctx.set('X-RateLimit-Limit', this.capacity);
    ctx.set('X-RateLimit-Remaining', ctx.state.rateLimit.remaining);
    ctx.set('X-RateLimit-Reset', ctx.state.rateLimit.reset);

	if (counter > this.capacity) {
      ctx.status = STATUS_CODE;
      ctx.body = { message: MESSAGE };
	}
    else{
      ctx.body = { message: counter };
    }
	await next();
  }
}
module.exports = RateLimit;
