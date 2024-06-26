import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';

function Refound() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
const navigate = useNavigate()
  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get('https://gimnasio-fiori-production.up.railway.app/api/admin/get-all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };
  const goBack = async () => {
    dispatch(showLoading());
    dispatch(hideLoading());
    navigate('/');
};
  useEffect(() => {
    getUsersData();
  }, []);

  const totalMontoPagado = users.reduce((total, user) => user.pago ? total + (user.monto || 0) : total, 0);
  const totalUsuariosPagados = users.filter(user => user.pago).length;
  const totalUsuariosNoPagados = users.length - totalUsuariosPagados;

  return (
    <div className='service-container'>
          <div className='title-container'>
              <h1 className='title-notifications'>Resumen de pagos</h1>
              <i className="ri-line-chart-line"></i>
          </div>
          <div className='employee-card'>
              
              <p className='info-refound'> <span className='title-refound-info'>Total usuarios pagos:</span>{totalUsuariosPagados}</p>
              <p className='info-refound'> <span className='title-refound-info'>Total usuarios impagos:</span> {totalUsuariosNoPagados}</p>
              <p className='info-refound'><span className='title-refound-info'>Total Pagos:</span>${totalMontoPagado}</p>
          <h1 className='button-booked' onClick={goBack}>
                  Volver
          </h1>
      </div>
    </div>
  );
}

export default Refound;