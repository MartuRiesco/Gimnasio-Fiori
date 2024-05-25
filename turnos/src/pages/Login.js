import React from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import Logo from '../components/Logo';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async(values) => {
      try {
        dispatch(showLoading());
        const formattedValues = {
            ...values,
            email: values.email.toLowerCase()
        };
        const response = await axios.post('https://gimnasio-fiori-production.up.railway.app/api/user/login', formattedValues);
        dispatch(hideLoading());
        if (response.data.success) {
            localStorage.setItem('token', response.data.data);
            toast.success(response.data.message);
            navigate('/');
        } else {
            toast.error(response.data.message);
        }
          } catch (error) {
            console.log(error);
              toast.error('something went wrong');  
          }
    }

  return (
    <div className="authentication">
            <div className="authentication-form p-3">
                <div>
                    < Logo />
                </div>
                <Form layout='vertical m-3' onFinish={onFinish}>
                        <Form.Item name='email'>
                                <Input placeholder='Email' />
                        </Form.Item>
                        <Form.Item name='password'>
                                <Input placeholder='Password' type="password" />
                        </Form.Item>

                        <Button className="primary-button mt-2 mb-2" htmlType="submit">
                            Ingresar
                        </Button>

                        <Link to="/register" className="anchor mt-4">
                        <Button className="primary-button mt-2 mb-4" htmlType="submit">
                            Registrarse
                        </Button>
                        </Link>
                </Form>
            </div>
        </div>
  )
}

export default Login;