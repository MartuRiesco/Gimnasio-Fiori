import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col, DatePicker, InputNumber, Checkbox } from 'antd';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useNavigate, useParams } from 'react-router-dom';

const FormItem = Form.Item;

function UserInfo() {
    const [user, setUser] = useState({});
    const [pago, setPago] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { userId } = useParams();
  
    const getData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`https://gimnasio-fiori-production.up.railway.app/api/user/get-user-info-by-id/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        dispatch(hideLoading());
        if (response.data.success) {
          console.log(response.data.data);
          setUser(response.data.data);
          setPago(response.data.data.pago); 
        }
      } catch (error) {
        dispatch(hideLoading());
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const onFinish = async (values) => {
      dispatch(showLoading());
      console.log(values);
      try {
        const response = await axios.put('https://gimnasio-fiori-production.up.railway.app/api/user/update-user', {
          id: user._id,
          valueToUpdate: { ...values, pago }
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        dispatch(hideLoading());
        if (response.data.success) {
          getData();
        navigate(-1)
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error('Error al actualizar usuario:', error);
      }
    }
  
    return (
      <div>
        <div className='title-container-profile'>
          <div className='title-notificacion-profile'>
            <h1 className='title-notifications'>Administre su perfil, actualice los campos de ser necesario.</h1>
            <i className="ri-user-line"></i>
          </div>
          <div className='user-info'>
            <h2 className='user-info-tag'>Nombre: {user.name}</h2>
            <h2 className='user-info-tag'>Email: {user.email}</h2>
          </div>
        </div>
  
        <Form layout='vertical' className='form-update' onFinish={onFinish} initialValues={user}>
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <FormItem required label='Nombre' name='name'>
                <Input placeholder={user.name} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <FormItem required label='Email' name='email'>
                <Input placeholder={user.email} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <FormItem  label='Observaciones' name='observaciones'>
                <Input placeholder='observaciones' />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <FormItem required label='Celular' name='phone'>
                <Input placeholder={user.phone} />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} xs={24} sm={24} lg={8}>
              <FormItem label='Pago'>
                <Checkbox checked={pago} onChange={(e) => setPago(e.target.checked)}>Pagado</Checkbox>
              </FormItem>
            </Col>
          </Row>
          {pago && (
            <>
              <Row>
                <Col span={8} xs={24} sm={24} lg={8}>
                  <FormItem label='Fecha de Pago' name='fechaPago'>
                    <DatePicker placeholder={user.fechaPago} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8} xs={24} sm={24} lg={8}>
                  <FormItem label='Importe' name='monto'>
                    <InputNumber prefix="$" placeholder='Importe' style={{ width: '150px' }} />
                  </FormItem>
                </Col>
              </Row>
            </>
          )}
          <div className='d-flex justify-content-end'>
            <Button className='primary-button' htmlType='submit'>
              ACTUALIZAR
            </Button>
          </div>
        </Form>
      </div>
    );
  }
  
  export default UserInfo;