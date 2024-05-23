import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

function Appointments() {
  const { user } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState({ className: '', day: '', time: '' });
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      let response;
      if (user && user.isAdmin) {
        response = await axios.get('/api/admin/get-all-appointments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else if (user) {
        response = await axios.get('/api/user/get-appointments-by-user-id', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
      dispatch(hideLoading());
      if (response && response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (user) {
      getAppointmentsData();
    }
  }, [user]);

  if (!user) {
    return <div>Cargando...</div>; // Mensaje de carga o componente de carga
  }

  const statusTitle = user.isAdmin
    ? ', revise las clases pendientes.'
    : user.isEmployee
    ? ', revise las clases pendientes.'
    : ', estas son las clases en las que está anotado/a.';

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const classInfo = appointment.employeeInfo?.classes?.find(
      (cls) => cls._id === appointment.classId
    );

    if (user.isAdmin && classInfo) {
      const matchesClass = filter.className
        ? classInfo.name.toLowerCase().includes(filter.className.toLowerCase())
        : true;
      const matchesDay = filter.day
        ? classInfo.day.toLowerCase().includes(filter.day.toLowerCase())
        : true;
      const matchesTime = filter.time
        ? classInfo.timings.some((time) => time.toLowerCase().includes(filter.time.toLowerCase()))
        : true;
      return matchesClass && matchesDay && matchesTime;
    }

    return true;
  });

  return (
    <div className="service">
      <div className="title-container">
        <h1 className="title-notifications">
          {user.name}
          {statusTitle}
        </h1>
        <i className="ri-calendar-check-line"></i>
      </div>

      {user.isAdmin && (
        <div className="filter-container">
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
      )}

      <div className="service-container">
        {filteredAppointments.length === 0 ? (
          <p>No hay clases inscritas.</p>
        ) : (
          filteredAppointments.map((appointment) => {
            const classInfo = appointment.employeeInfo?.classes?.find(
              (cls) => cls._id === appointment.classId
            );

            return (
              <div className="employee-card" key={appointment._id}>
                <h2>{user.isAdmin ? appointment.employeeInfo?.name : 'Clase'}</h2>
                <p className="employee-status">{appointment.status}</p>
                {user.isAdmin && <p>Cliente: {appointment.userInfo?.name}</p>}
                <p>Clase: {classInfo ? classInfo.name : 'Clase no encontrada'}</p>
                <p>Día: {classInfo ? classInfo.day : 'Día no encontrado'}</p>
                <p>
                  Horario:{' '}
                  {classInfo ? `${classInfo.timings[0]} - ${classInfo.timings[1]}` : 'Horario no encontrado'}
                </p>
                {appointment.status === 'cancelado' && !user.isEmployee && (
                  <Link to={'/home'}>
                    <p className="employee-reserved">Inscribirse en otra clase</p>
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Appointments;