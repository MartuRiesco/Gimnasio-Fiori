import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';
import { Radio } from 'antd';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteUser = async (userId) => {
    try {
      dispatch(showLoading());
      const response = await axios.delete('https://gimnasio-fiori-production.up.railway.app/api/admin/delete-user',
      { data: { userId } }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('https://gimnasio-fiori-production.up.railway.app/api/admin/get-all-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.data);
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'pago') return user.pago;
    if (filter === 'noPago') return !user.pago;
    return true;
  });

  return (
    <div className='service'>
      <div className='title-container'>
        <h1 className='title-notifications'>Lista de usuarios</h1>
        <i className="ri-user-follow-line"></i>
      </div>
      <div className='filter-container'>
        <Radio.Group  onChange={(e) => setFilter(e.target.value)} value={filter}>
          <Radio className='employee-change ' value='all'><p className='m-2'>Todos</p></Radio>
          <Radio className='employee-approved ' value='pago'><p className='m-2'>Pago</p></Radio>
          <Radio className='employee-rejected ' value='noPago'><p className='m-2'>Impago</p></Radio>
        </Radio.Group>
      </div>
      <div className='service-container'>
  {filteredUsers.map((user) => (
    !user.isAdmin && (
      <div className="employee-card" key={user._id}>
        <h2>{user.name}</h2>
        <div className="employee-container">
          <Link
            className="employee-whatsapp"
            to={`https://api.whatsapp.com/send?phone=549${user.phone}`}
          >
            <i className="ri-whatsapp-line"></i>
            {user.phone}
          </Link>
        </div>
        {user.isEmployee ? (
          <p>Empleado</p>
        ) : (
          <div>
            <p>Mes de inscripción: {user.mesInscripcion}</p>
            <p>Observaciones: {user.observaciones}</p>
            <p>Fecha de pago: {user.fechaPago ? moment(user.fechaPago).format('DD-MM-YYYY') : 'N/A'}</p>
            <p>Monto abonado: ${user.monto ? user.monto : 'N/A'}</p>
            {user.pago ? (
              <h1 className="employee-approved">Pago</h1>
            ) : (
              <h1 className="employee-rejected">No Pago</h1>
            )}
          </div>
        )}
        <div>
          <h1
            className="employee-change"
            onClick={() => navigate(`/get-user-info-by-id/${user._id}`)}
          >
            Actualizar Usuario
          </h1>
          <h1
            className="employee-rejected"
            onClick={() => deleteUser(user._id)}
          >
            Borrar Usuario
          </h1>
        </div>
      </div>
    )
  ))}
</div>
    </div>
  );
}

export default UsersList;