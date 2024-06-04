import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import Logo from '../components/Logo';
//import EmployeeForm from '../components/EmployeeForm';

function Register() {
    const dispatch = useDispatch();
    const [employee, setEmployee] = useState(false);
    const [pago, setPago] = useState(false);
    const [fechaPago, setFechaPago] = useState(null);
    const [monto, setMonto] = useState(null);
    const navigate = useNavigate();
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const onChange = (date, dateString) => {
        setFechaPago(dateString);
    };

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            console.log(values);
            const formattedValues = {
                ...values,
                email: values.email.toLowerCase(),
                isEmployee: employee,
                pago: pago,
                fechaPago: pago ? fechaPago : '',
                monto: pago ? monto : '',
            };
            console.log(formattedValues);
            const response = await axios.post('https://gimnasio-fiori-production.up.railway.app/api/user/register', formattedValues);
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="authentication">
            <div className="authentication-form p-3">
                <div>
                    <Logo />
                </div>
                <Form layout='vertical m-3' onFinish={onFinish}>
                    <Form.Item name='name' label="Nombre" rules={[{ required: true }]}>
                        <Input placeholder='Nombre' />
                    </Form.Item>
                    <Form.Item name='email' label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item name='phone' label="Celular">
                        <Input placeholder='Celular, sin 0 y sin 15' />
                    </Form.Item>
                    <Form.Item label="Es empleado?">
                        <Input checked={employee}  type='checkbox' className='checkbox'  onChange={() => setEmployee(!employee)} />
                    </Form.Item>
                    {
                        employee ? ''
                        : <div>
                            <Form.Item name='observaciones' label="Observaciones">
                                <Input placeholder='Observaciones' />
                            </Form.Item>
                            <Form.Item name='mesInscripcion' label="Mes de inscripción" rules={[{ required: true }]}>
                                <Select placeholder='Mes de Inscripción'>
                                    {months.map(month => (
                                        <Select.Option key={month} value={month}>
                                            {month}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Pago">
                                <Input type='checkbox' className='checkbox' checked={pago} onChange={() => {
                                    setPago(!pago);
                                    if (!pago) {
                                        setFechaPago(null);
                                        setMonto(null);
                                    }
                                }} />
                            </Form.Item>
                            {pago ? (
                                <div>
                                    <Form.Item name='fechaPago' label="Fecha de Pago">
                                        <DatePicker placeholder='Fecha de Pago' onChange={onChange} />
                                    </Form.Item>
                                    <Form.Item name='monto' label="Importe">
                                        <InputNumber prefix="$" placeholder='Importe' style={{width:'150px'}} onChange={value => setMonto(value)} />
                                    </Form.Item>
                                </div>
                            ) : ''}
                        </div>
                    }
                    <Form.Item name='password' label="Password" rules={[{ required: true }]}>
                        <Input placeholder='Password' type="password" />
                    </Form.Item>
                    <Button className="primary-button mt-2 mb-4" htmlType="submit">Registrar Cliente</Button>
                    <Link to="/login" className="anchor mt-4">
                        <i className="ri-arrow-left-line"></i>
                        Volver al Inicio
                    </Link>
                </Form>
            </div>
        </div>
    );
}

export default Register;