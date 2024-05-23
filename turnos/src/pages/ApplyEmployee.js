import React from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import EmployeeForm from '../components/EmployeeForm';
import dayjs from 'dayjs';

function ApplyEmployee() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const classes = values.classes
            console.log(classes);
            const response = await axios.post('/api/user/apply-employee-account', 
                {
                    ...values,
                    userId: user._id,
                    classes,
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error )
            toast.error('Error solicitando la cuenta de empleado');
        }
    };

    return (
        <div className='service'>
            <div className='title-container'>
                <h1 className='title-notifications'>Seleccione que servicio quiere brindar.</h1>
                <i className="ri-user-add-line"></i>
            </div>
            <div className='form-update'>
                <EmployeeForm onFinish={onFinish} />
            </div>
        </div>
    );
}

export default ApplyEmployee;