const Koa = require('koa');
const app = new Koa();
const RateLimit = require('./rateLimit')
const ratelimit = new RateLimit({
  capacity: 60,
  interval: 60,
});


app.use(ratelimit.middleware);

app.listen(4000);
