import React, { useState } from 'react'
import { Card, CardHeader, CardBody, Input, Table, Row, Col, Form, FormGroup, Label, FormText, ButtonToolbar } from 'reactstrap'
import { Button } from 'reactstrap'
import Chart from './Chart'


export default (props) => {
  const configuration = props.configuration || { calibrations: [] }
  const calibrationsToRender = [...configuration.calibrations]
  calibrationsToRender.push({
    path: '',
    sourceRef: '',
    period: '',
    mappings: []
  })
  return (
    <div>
      {calibrationsToRender.map((calibration, i) =>
        <Calibration
          key={`${i}${Date.now()}`} i={i}
          {...calibration}
          save={(calibration) => {
            const configToSave = { ...configuration }
            configToSave.calibrations[i] = calibration
            props.save(configToSave)
          }}
          delete={() => {
            const configToSave = { ...configuration }
            configToSave.calibrations.splice(i, 1)
            props.save(configToSave)
          }}
        />
      )}
    </div>
  )
}

const labelStyle = {
  lineHeight: '36px'
}
const Calibration = (props) => {
  const [path, setPath] = useState(props.path)
  const [sourceRef, setSourceRef] = useState(props.sourceRef)
  const [period, setPeriod] = useState(props.period)
  const [mappings, setMappings] = useState(props.mappings)

  return (
    <Card>
      <CardHeader>#{props.i + 1}</CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col md="6">
              <FormField
                fieldName='path'
                label='Path'
                value={path}
                setter={setPath}
                text='Signal K path of the data' />
              <FormField
                fieldName='sourceRef'
                label='Source'
                value={sourceRef}
                setter={setSourceRef}
                text='Specify source if needed, leave empty otherwise. Sources are available in Data Browser.' />
              <FormField
                fieldName='period'
                label='Period'
                value={period}
                setter={setPeriod}
                text='If data is periodic, like direction.' />

              <FormGroup row>
                <Col md='2'>
                </Col>
                <Col xs='12' md='6'>
                  <ButtonToolbar style={{ justifyContent: 'space-between' }}>
                    <Button
                      size='sm'
                      color='primary'
                      onClick={(e) => {
                        e.preventDefault()
                        props.save({
                          path,
                          sourceRef,
                          period,
                          mappings
                        })
                      }}
                    >
                      <i className='fa fa-save' /> Save
                    </Button>
                    <Button
                      size='sm'
                      color='danger'
                      onClick={(e) => {
                        e.preventDefault()
                        props.delete()
                      }}>
                      <i className='fa fa-ban' /> Delete
                    </Button>
                  </ButtonToolbar>
                </Col>
              </FormGroup>

            </Col>
            <Col>
              <Chart values={mappings} width={300} height={200} />
              <ValuesTable mappings={mappings} setMappings={setMappings} />
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

const FormField = ({ fieldName, label, value, setter, text }) => (
  <FormGroup row>
    <Col md='2'>
      <Label style={labelStyle} htmlFor={fieldName}>{label}</Label>
    </Col>
    <Col xs='12' md='6'>
      <Input
        type='text'
        name={fieldName}
        onChange={e => setter(e.target.value)}
        value={value}
      />
      <FormText color='muted'>{text}</FormText>
    </Col>
  </FormGroup>
)

const ValuesTable = ({ mappings, setMappings }) => {
  const mappingsWithExtra = [...mappings]
  mappingsWithExtra.push({ in: '', out: '' })
  return (
    <Table responsive bordered>
      <thead>
        <tr>
          <td>Input</td>
          <td>Output</td>
          <td>Difference</td>
          <td>Delete row</td>
        </tr>
      </thead>
      <tbody>
        {mappingsWithExtra.map((mapping, i) =>
          <Mapping
            key={i}
            setMapping={
              (mapping) => {
                const newMappings = [...mappings]
                newMappings[i] = mapping
                setMappings(newMappings)
              }
            }
            deleteMapping={() => {
              const newMappings = [...mappings]
              newMappings.splice(i, 1)
              setMappings(newMappings)
            }}
            canDelete={i < mappings.length}
            {...mapping}
          />)}
      </tbody>
    </Table>
  )
}

const Mapping = (props) => (
  <tr style={{ lineHeight: '0px' }}>
    <td style={{ padding: '0px' }}>
      <Input
        type='number'
        name='in'
        onChange={
          (e) => { props.setMapping({ in: Number(e.target.value), out: props.out }) }
        }
        value={props.in}
      />
    </td>
    <td style={{ padding: '0px' }}>
      <Input
        type='number'
        name='out'
        onChange={
          (e) => { props.setMapping({ in: props.in, out: Number(e.target.value) }) }
        }
        value={props.out}
      />
    </td>
    <td style={{ padding: '0px' }}>
      <Input
        type='number'
        name='diff'
        value={props.out - props.in}
        disabled={true}
      />
    </td>
    <td style={{
      padding: '0px', textAlign: 'center',
      verticalAlign: 'middle'
    }}>
      {props.canDelete && <i
        className='fas fa-trash'
        onClick={() => { props.deleteMapping() }}
      />}
    </td>
  </tr>
)