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
    }
    plugin.start(options)
    const delta = { updates: [{ values: [{ path: 'a.b.c', value: 2.2 }] }] }
    handler(delta, (handledDelta) => {
      expect(handledDelta.updates[0].values[0].value).to.be.closeTo(0.3087, 0.0001)
      done()
    })
  })

  it('period works with negative corrections', (done) => {
    let handler
    const app = {
      savePluginOptions: () => { },
      registerDeltaInputHandler: (f) => handler = f
    }
    const plugin = require('../')(app)
    const options = {
      "calibrations": [
        {
          "path": "navigation.courseOverGroundMagnetic",
          "sourceRef": "",
          "period": "6.283185307179586",
          "mappings": [
            {
              "in": 0,
              "out": 0.1
            },
            {
              "in": 1,
              "out": 1.1
            },
            {
              "in": 1.1,
              "out": 0.9
            },
            {
              "in": 2.6,
              "out": 2.4
            },
            {
              "in": 2.7,
              "out": 2.8
            },
            {
              "in": 6.1,
              "out": 6.2
            },
            {
              "in": 6.283185307179586,
              "out": 6.3831853
            }
          ]
        }
      ]
    }
    plugin.start(options)
    ;[
      [6.1, 6.2],
      [6.28, 0.0968]
    ].forEach((test) => {
      const [inValue, outValue] = test
      const delta = { updates: [{ values: [{ path: 'navigation.courseOverGroundMagnetic', value: inValue }] }] }
      handler(delta, (handledDelta) => {
        expect(handledDelta.updates[0].values[0].value).to.be.closeTo(outValue, 0.0001)
      })
    })
    done()
  })
})