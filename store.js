class Store {
  constructor (options) {
    this.interval = options.interval
    this.Hits = {}
  }
  async hit (key) {
    await this._deleteExpiredKey()
    if (!this.Hits[key]) {
      this.Hits[key] = {
        counter: 1,
        dateEnd: Date.now() + this.interval * 1000
      }
    } else {
      this.Hits[key].counter++
    }
    return this.Hits[key]
  }

  async _deleteExpiredKey () {
    const now = Date.now()
    Object.entries(this.Hits)
      .filter(([key, value]) => { return value.dateEnd <= now })
      .forEach(([key, value]) => {
        delete this.Hits[key]
      })
  }
}
module.exports = Store
