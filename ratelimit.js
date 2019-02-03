const STATUS_CODE = 429
const MESSAGE = 'Error'

const Store = require('./store')
class RateLimit {
  constructor (options) {
    this.capacity = options.capacity
    this.store = new Store(options)
  }

  async getIp (ctx) {
    return ctx.request.ip
  }

  get middleware () {
    return this._ratelimit.bind(this)
  }

  async _ratelimit (ctx, next) {
    const ip = await this.getIp(ctx)
    const { counter, dateEnd } = await this.store.hit(ip)
    const reset = new Date(dateEnd).getTime()
    ctx.state.ratelimit = {
      limit: this.capacity,
      current: counter,
      remaining: Math.max(this.capacity - counter, 0),
      reset: Math.ceil(reset / 1000)
    }

    ctx.set('X-RateLimit-Limit', this.capacity)
    ctx.set('X-RateLimit-Remaining', ctx.state.ratelimit.remaining)
    ctx.set('X-RateLimit-Reset', ctx.state.ratelimit.reset)

    if (counter > this.capacity) {
      ctx.status = STATUS_CODE
      ctx.body = MESSAGE
    } else {
      ctx.body = counter.toString()
    }
    await next()
  }
}
module.exports = RateLimit
