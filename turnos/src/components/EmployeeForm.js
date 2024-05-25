import React from 'react';
import { Button, Col, Form, Input, Row, Select, TimePicker } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import './styles.css';
import dayjs from 'dayjs';

const daysOfWeek = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

function EmployeeForm({ onFinish, initialValues = {} }) {
  return (
    <Form
      className='p-3'
      layout='vertical'
      onFinish={(values) => {
        const transformedValues = {
          ...values,
          classes: values.classes.map(cls => ({
            ...cls,
            timings: cls.timings.map(time => dayjs(time).format('HH'))
          }))
        };
        console.log('Formulario enviado:', transformedValues);
        onFinish(transformedValues);
      }}
      initialValues={{
        ...initialValues,
        classes: initialValues.classes?.map(cls => ({
          ...cls,
          timings: cls.timings.map(time => dayjs(time, 'HH'))
        })) || []
      }}
    >
      <Row>
        <Col span={8} xs={24} sm={24} lg={8}>
          <FormItem required label='Nombre' name='name' rules={[{ required: true }]}>
            <Input placeholder='Nombre' />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={8} xs={24} sm={24} lg={8}>
          <FormItem required label='Email' name='email' rules={[{ required: true }]}>
            <Input placeholder='Email' />
          </FormItem>
        </Col>
      </Row>
      <Form.List name="classes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div key={key}>
                <Row>
                  <Col span={8} xs={24} sm={24} lg={8}>
                    <FormItem
                      {...restField}
                      required
                      label='Clase'
                      name={[name, 'name']}
                      fieldKey={[fieldKey, 'name']}
                      rules={[{ required: true, message: 'Por favor ingrese el nombre de la clase' }]}
                    >
                      <Input placeholder='Clase' />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} xs={24} sm={24} lg={8}>
                    <FormItem
                      {...restField}
                      required
                      label='Día'
                      name={[name, 'day']}
                      fieldKey={[fieldKey, 'day']}
                      rules={[{ required: true, message: 'Por favor seleccione un día' }]}
                    >
                      <Select placeholder='Seleccione un día'>
                        {daysOfWeek.map(day => (
                          <Select.Option key={day} value={day}>
                            {day}
                          </Select.Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={8} xs={24} sm={24} lg={8}>
                    <FormItem
                      {...restField}
                      required
                      label='Horarios'
                      name={[name, 'timings']}
                      fieldKey={[fieldKey, 'timings']}
                      rules={[{ required: true, message: 'Por favor ingrese los horarios' }]}
                    >
                      <TimePicker.RangePicker
                        className='p-3 mt-3'
                        format='HH'
                      />
                    </FormItem>
                  </Col>
                  <Col span={4} xs={24} sm={24} lg={4}>
                    <Button
                      type="danger"
                      onClick={() => remove(name)}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Row>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Button
                  className='button-class'
                  type="dashed"
                  onClick={() => add()}
                >
                  Añadir Clase
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form.List>
      <div className='d-flex justify-content-end'>
        <Button
          className='primary-button mt-3'
          htmlType='submit'
        >
          ENVIAR
        </Button>
      </div>
    </Form>
  );
}

export default EmployeeForm;