import {   Button,Tabs } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { setUser } from '../redux/userSlice';


function Notifications() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state)=> state.user)
    const markAllAsSeen = async()=>{
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/mark-all-notifications-as-seen', {userId: user._id}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token' )}`
            }}
            );
            dispatch(hideLoading())
            if(response.data.success) {
              toast.success(response.data.message);
            dispatch(setUser(response.data.ada))
            } else {
              toast.success(response.data.message)
            }
          } catch (error) {
              dispatch(hideLoading());
              toast.error('Something went wrong');  
          }
    }
    const deleteAll = async()=>{
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/delete-all-notifications', {userId: user._id}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token' )}`
            }}
            );
            dispatch(hideLoading())
            if(response.data.success) {
              toast.success(response.data.message);
            dispatch(setUser(response.data.ada))
            } else {
              toast.success(response.data.message)
            }
          } catch (error) {
              dispatch(hideLoading());
              toast.error('Something went wrong');  
          }
    }

  return (
    
    <div className='container-notifications'>
        <div className='title-container'>
            <h1 className='title-notifications'>Centro de notificaciones.</h1>
            <i class="ri-discuss-line"></i>
        </div>
        <section className='green-dot-container'>
            <div className='green-dot'></div>
        </section>
        <Tabs>
            <Tabs.TabPane tab='No leidas' className='noleidas' key={0}>
                <div className='d-flex justify-content-end m-3'>
                    <h1 className='anchor' onClick={()=>markAllAsSeen()}>Leer todas</h1>

                </div>
                {
                    user?.unseenNotifications.map((notification)=>(
                    <div className='card p-2' onClick={()=>navigate(notification.onClickPath)}>
                        <div className='card-text'>
                            {notification.message} <i class="ri-arrow-right-line"></i>
                        </div>
                    </div>
                    ))
                }
            </Tabs.TabPane>
            <Tabs.TabPane tab='Leidas' className='leidas' key={1}>
                <div className='d-flex justify-content-end m-3'>
                    <h1 className='anchor' onClick={()=>deleteAll()}>Borrar todas</h1>
                </div>
                {
                    user?.seenNotifications.map((notification)=>(
                    <div className='card p-2' onClick={()=>navigate(notification.onClickPath)}>
                        <div className='card-text'>
                            {notification.message} <i class="ri-arrow-right-line"></i>
                        </div>
                    </div>
                    ))
                }

            </Tabs.TabPane>
        </Tabs>
    
    </div>
  )
}

export default Notifications