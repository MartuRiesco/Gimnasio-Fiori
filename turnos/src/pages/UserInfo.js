import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { Button, Col, Form, Input, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';



function UserInfo() {
  const [ user, setUser ] = useState({});
  const dispath = useDispatch();

 const getData = async () => {
  try {
      dispath(showLoading())
      const response = await axios.get('gimnasio-fiori-production.up.railway.app/api/user/get-user-info-by-id', {
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      });
      dispath(hideLoading());
      console.log(response.data);
      if(response.data.success) {
          setUser(response.data.data)
      }
  } catch (error) {
      dispath(hideLoading())
  }
}
useEffect(() => {
  getData();
}, [])
const onFinish = async (values) =>{
  dispath(showLoading());
console.log(values, 'val');
  try {
   const response = await axios.put('gimnasio-fiori-production.up.railway.app/api/user/update-user', {
          id: user._id,
          valueToUpdate: values
      }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      console.log(response);
      dispath(hideLoading());
      if (response.data.success) {
          getData();
      }
  } catch (error) {
      dispath(hideLoading());
      console.error('Error al actualizar usuario:', error);
  }
} ;



  return (

    <div>
        <div className='title-container-profile'>
              <div className='title-notificacion-profile'>
                <h1 className='title-notifications'>Administre su perfil, actualice los campos de ser necesario.</h1>
                <i class="ri-user-line"></i>      
              </div>
              <div className='user-info'>
                <h2 className='user-info-tag'>Nombre: {user.name}</h2>
                <h2 className='user-info-tag'>Email: {user.email}</h2>
              </div>
        </div>
               
        <Form layout='vertical' className='form-update' onFinish={onFinish}>
          <Row>
              <Col span={8} xs={24} sm={24} lg={8}>
                  <FormItem  required label='Nombre' name='name' >
                      <Input placeholder={user.name}/>
                  </FormItem>
              </Col>
          </Row>
          <Row>
              <Col span={8} xs={24} sm={24} lg={8}>
                  <FormItem  required label='Email' name='email' >
                      <Input  placeholder={user.email}/>
                  </FormItem>
              </Col>
          </Row>
          <Row>
              <Col span={8} xs={24} sm={24} lg={8}>
                  <FormItem  required label='Celular' name='phone' >
                      <Input  placeholder={user.phone}/>
                  </FormItem>
              </Col>
          </Row>
          
          <div className='d-flex justofy-content-end'>
              <Button className='primary-button' htmlType='submit'>
                  ACTUALIZAR
              </Button>
          </div>
        </Form>
    </div>
  )
}

export default UserInfo;