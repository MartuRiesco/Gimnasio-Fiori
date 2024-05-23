import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import moment from 'moment';

function UsersList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch()

  const deleteUser = async (userId)=>{
    try {
      dispatch(showLoading());
      const response = await axios.delete('/api/admin/delete-user', 
      { data: {
        userId: userId
      }},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideLoading());
      if(response.data.success) {
        setUsers(users.filter(user => user._id !== userId));
      }
  } catch (error) {
      dispatch(hideLoading());
  }
  }
  const getUsersData = async () => {
    try {
        dispatch(showLoading());
        const response = await axios.get('/api/admin/get-all-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        dispatch(hideLoading());
        if(response.data.success) {
          setUsers(response.data.data)
        }
    } catch (error) {
      console.log(error)
        dispatch(hideLoading());
    }
  }

  useEffect(() => {
    getUsersData()
  }, []);

  return (
    <div className='service'>
        <div className='title-container'>
          <h1 className='title-notifications'>Lista de usuarios</h1>
          <i class="ri-user-follow-line"></i>
        </div>
        <div className='service-container'>
            {users.map((user) => (
                                <div className='employee-card'>
                                      
                                    <h2>{user.name}</h2>
                                    <div className='employee-container'>
                                    <Link 
                                      className='employee-whatsapp' 
                                      to={`https://api.whatsapp.com/send?phone=549${user.phone}`}>
                                            <i class="ri-whatsapp-line"></i> 
                                            {user.phone}
                                    </Link>
                                    </div>
                                    <p>{user.email}</p>
                                    <p>{moment(user.createdAt).format('DD-MM-YYYY')}</p>
                                    <div>
                                        <h1 className='employee-rejected' onClick={() => deleteUser(user._id)} >Borrar Usuario</h1>
                                    </div>
                                </div>
                            ))}
            </div>
        </div>
  )
}

export default UsersList