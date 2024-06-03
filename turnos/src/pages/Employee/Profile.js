import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import EmployeeForm from '../../components/EmployeeForm';
import dayjs from 'dayjs';

function Profile() {
  const dispatch = useDispatch();
  const params = useParams()
  const { user }= useSelector(state=> state.user);
  const [ employee, setEmployee ] = useState(null)
    const navigate = useNavigate();

  const onFinish = async (values) =>{
    try {
        dispatch(showLoading());
        const response = await axios.post('https://demo-central-production.up.railway.app/api/employee/update-employee-profile', 
            {
              ...values,
              userId: user._id,
              timings: [
                dayjs(values.timings[0]).format('HH'),
                dayjs(values.timings[1]).format('HH')
              ],
            },
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token' )}`
            }
        });
        dispatch(hideLoading())
        if(response.data.success) {
          toast.success(response.data.message);
          navigate('/');
        } else {
          toast.success(response.data.message)
        }
      } catch (error) {
          dispatch(hideLoading());
      }
}

const getEmployeeData = async() => {
  try {
      dispatch(showLoading());
      const response = await axios.post(
          'https://gimnasio-fiori-production.up.railway.app/api/employee/get-employee-info-by-userid', 
          {
            userId: params.employeeId,
          },
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              }
          });
      dispatch(hideLoading())
      if(response.data.success) {
          setEmployee(response.data.data);
      }
     } catch (error) {
      dispatch(hideLoading());
  }
}

useEffect(() => {
      getEmployeeData()
}, []);
  return (
    <div className='service'>
        <div className='title-container'>
            <h1 className='title-notifications'>Perfíl empleado.</h1>
            <i class="ri-file-list-line"></i>
        </div>
      { employee && <EmployeeForm onFinish={onFinish} initialValues={employee}/>}
    </div>
  )
}

export default Profile;