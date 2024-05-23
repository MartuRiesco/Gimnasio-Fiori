import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function EmployeeAppointments() {

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState({ className: '', day: '', time: '' });
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('https://gimnasio-fiori-production.up.railway.app/api/employee/get-appointments-by-employee-id', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const deleteAppointment = async (appointmentId, userInfo) => {
    try {
      console.log(userInfo);
      dispatch(showLoading());
      const response = await axios.delete('https://gimnasio-fiori-production.up.railway.app/api/employee/delete-appointment',
        {
          data: {
            appointmentId: appointmentId,
            userInfo: userInfo
          }
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      console.log(response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== appointmentId));
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeAppointmentsStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('https://gimnasio-fiori-production.up.railway.app/api/employee/change-apppointment-status', { appointmentId: record._id, status: status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      toast.error('Error cambiando el estado del empleado');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getAppointmentsData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const classInfo = appointment.employeeInfo.classes.find(cls => cls._id === appointment.classId);

    if (classInfo) {
      const matchesClass = filter.className
        ? classInfo.name.toLowerCase().includes(filter.className.toLowerCase())
        : true;
      const matchesDay = filter.day
        ? classInfo.day.toLowerCase().includes(filter.day.toLowerCase())
        : true;
      const matchesTime = filter.time
        ? classInfo.timings.some(time => time.toLowerCase().includes(filter.time.toLowerCase()))
        : true;
      return matchesClass && matchesDay && matchesTime;
    }

    return true;
  });

  return (
    <div className='service'>
      <div className='title-container'>
        <h1 className='title-notifications'>Alumnos</h1>
        <i className="ri-calendar-check-line"></i>
      </div>

      <div className='filter-container'>
        <label className='filter-label'>
          Clase:
          <input
            type="text"
            name="className"
            className='input-filter'
            value={filter.className}
            onChange={handleFilterChange}
            placeholder="Nombre de la clase"
          />
        </label>
        <label className='filter-label'>
          Día:
          <input
            type="text"
            name="day"
            className='input-filter'
            value={filter.day}
            onChange={handleFilterChange}
            placeholder="Ej: Lunes"
          />
        </label>
        <label className='filter-label'>
          Horario:
          <input
            type="text"
            name="time"
            value={filter.time}
            className='input-filter'
            onChange={handleFilterChange}
            placeholder="Ej: 10:00"
          />
        </label>
      </div>

      <div className='service-container'>
        {filteredAppointments.length === 0 ? (
          <p>No hay clases inscritas.</p>
        ) : (
          filteredAppointments.map((appointment) => {
            const classInfo = appointment.employeeInfo.classes.find(cls => cls._id === appointment.classId);

            return (
              <div className='employee-card' key={appointment._id}>
                <h2>{appointment.userInfo.name}</h2>
                <div className='employee-container'>
                  <p className='employee-status'>{appointment.status}</p>
                  <div className='employee-whatsapp-container'>
                    <Link className='employee-whatsapp' to={`https://api.whatsapp.com/send?phone=549${appointment.userInfo.phone}`}>
                      <i className="ri-whatsapp-line"></i>
                      {appointment.userInfo.phone}
                    </Link>
                  </div>
                </div>
                <p>Email: {appointment.userInfo.email}</p>
                <p>Clase: {classInfo ? classInfo.name : 'Clase no encontrada'}</p>
                <p>Día: {classInfo ? classInfo.day : 'Día no encontrado'}</p>
                <p>Horario: {classInfo ? classInfo.timings[0] : 'Horario no encontrado'} - {classInfo ? classInfo.timings[1] : 'Horario no encontrado'}</p>

                <div>
                  {appointment.status === "pendiente" && (
                    <div className='d-flex'>
                      <h1 className='employee-approved' onClick={() => changeAppointmentsStatus(appointment, 'aprobado')}>Confirmar</h1>
                      <h1 className='employee-rejected' onClick={() => changeAppointmentsStatus(appointment, 'cancelado')}>Rechazar</h1>
                    </div>
                  )}
                </div>
                <div>
                  {appointment.status === "aprobado" && (
                    <div className='d-flex'>
                      <h1 className='employee-rejected' onClick={() => deleteAppointment(appointment._id, appointment.userInfo)}>Eliminar</h1>
                    </div>
                  )}
                </div>
                <div>
                  {appointment.status === "cancelado" && (
                    <div className='d-flex'>
                      <h1 className='employee-rejected' onClick={() => deleteAppointment(appointment._id, appointment.userInfo)}>Eliminar</h1>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default EmployeeAppointments;