const Koa = require('koa')
const Ratelimit = require('./ratelimit')
const app = module.exports = new Koa()
const ratelimit = new Ratelimit({
  capacity: 60,
  interval: 60
})

app.use(ratelimit.middleware)

if (!module.parent) app.listen(3000)
