/*
 * Copyright 2018 Teppo Kurki <teppo.kurki@iki.fi>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const linearInterpolator = require('linear-interpolator')
module.exports = function (app) {
  const error =
    app.error ||
    (msg => {
      console.error(msg)
    })
  const debug =
    app.debug ||
    (msg => {
      console.log(msg)
    })

  const plugin = {}
  const unsubscribes = []
  const lastConversions = {}

  plugin.start = function (props) {
    props.calibrations &&
      props.calibrations.forEach(calibration => {
        calibration.mappings.sort((a,b) => a.in - b.in)
        if (calibration.mappings.length > 1) {
          const convert = linearInterpolator(
            calibration.mappings.reduce((acc, mapping) => {
              acc.push([mapping.in, mapping.out])
              return acc
            }, [])
          )
          unsubscribes.push(
            app.registerDeltaInputHandler((delta, next) => {
              delta.updates &&
                delta.updates.forEach(update => {
                  update.values &&
                    update.values.forEach(pathValue => {
                      if (pathValue.path === calibration.path) {
                        const result = convert(pathValue.value)
                        lastConversions[calibration.path] = {
                          in: pathValue.value,
                          out: result
                        }
                        pathValue.value = result
                      }
                    })
                })
              next(delta)
            })
          )
        }
      })
      //always save on start so that the data is stored sorted
      app.savePluginOptions(props, () => {})
  }

  plugin.stop = function () {}

  plugin.statusMessage = function () {
    return Object.keys(lastConversions)
      .map(key => `${key}: ${lastConversions[key].in} => ${lastConversions[key].out}`)
      .toString()
  }

  plugin.id = 'calibration'
  plugin.name = 'Calibration'
  plugin.description =
    'Plugin that uses linear interpolation to adjust incoming deltas in the server for calibrating inputs'

  plugin.schema = {
    type: 'object',
    properties: {
      calibrations: {
        type: 'array',
        items: {
          type: 'object',
          required: ['path', 'mappings'],
          properties: {
            path: {
              type: 'string'
            },
            period: {
              type: 'number'
            },
            mappings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  in: {
                    type: 'number'
                  },
                  out: {
                    type: 'number'
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return plugin
}
