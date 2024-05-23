import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { Button, Select } from 'antd';
import toast from 'react-hot-toast';

const { Option } = Select;

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [employee, setEmployee] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getEmployeeData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/employee/get-employee-info-by-id', 
        { employeeId: params.employeeId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Error obteniendo los datos del empleado.');
    }
  };

  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        '/api/user/book-appointment', 
        {
          employeeId: params.employeeId,
          userId: user._id,
          classId: selectedClass,
          employeeInfo: employee,
          userInfo: user
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        const bookedAppointment = {
          className: employee.classes.find(cls => cls._id === selectedClass).name,
          classDay: employee.classes.find(cls => cls._id === selectedClass).day,
          classTime: employee.classes.find(cls => cls._id === selectedClass).timings
        };
        navigate('/appointment-booked', { state: { bookedAppointment } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Algo salió mal al inscribirse en la clase.');
    }
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  return (
    <>
      <div className='title-container'>
        <h1 className='title-notifications'>Seleccione la clase a inscribirse.</h1>
        <i className="ri-time-line"></i>
      </div>
      <div className='calendar'>
        {employee && (
          <div className='mb-2'>
            <div className='d-flex flex-column mt-2'>
              <Select 
                placeholder="Seleccione una clase"
                className='mt-3 p-3'
                onChange={(value) => setSelectedClass(value)}
              >
                {employee.classes.map((cls) => (
                  <Option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.day} ({cls.timings.join(', ')})
                  </Option>
                ))}
              </Select>
              <Button 
                className='primary-button mt-4' 
                onClick={bookNow}
                disabled={!selectedClass}
              >
                Inscribirse
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookAppointment;