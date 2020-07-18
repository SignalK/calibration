const expect = require('chai').expect

describe('Plugin ', () => {
  it('period works for over period boundary values', (done) => {
    let handler
    const app = {
      savePluginOptions: () => { },
      registerDeltaInputHandler: (f) => handler = f
    }
    const plugin = require('../')(app)
    const options = {
      calibrations: [
        {
          "path": "a.b.c",
          "period": 2.5,
          "mappings": [
            {
              "in": 0,
              "out": 0.5
            },
            {
              "in": 2.3,
              "out": 0.3
            }
          ]
        }
      ],
      period: 2.5
    }
    plugin.start(options)
    const delta = { updates: [{ values: [{ path: 'a.b.c', value: 2.2 }] }] }
    handler(delta, (handledDelta) => {
      expect(handledDelta.updates[0].values[0].value).to.be.closeTo(0.2, 0.0001)
      done()
    })

  })
})