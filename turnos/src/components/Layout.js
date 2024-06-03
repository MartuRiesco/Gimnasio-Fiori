import React from 'react';
import './styles.css';
//import Logo from '../Logo/logo';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, /* useNavigate */ } from 'react-router-dom';

//import axios from 'axios';
function Layout({ children }) {

  
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const location = useLocation();
const clearCacheAndStorage = () => {
    // Limpiar el localStorage
    localStorage.clear();

    // Limpiar el caché del navegador
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            cacheNames.forEach(function(cacheName) {
                caches.delete(cacheName);
            });
        });
    }

    // Redirigir al usuario a la página de login
    navigate('/login');
    window.location.reload();
};

  const adminMenu = [
    {
        name: 'Carga de Usuarios',
        path: '/register',
        icon: 'ri-user-add-line'
    },
    {
        name: 'Lista de Usuarios',
        path: '/admin/users',
        icon: 'ri-user-line'
    },
    {
        name: 'Cierre mensual',
        path: '/admin/cierre',
        icon: 'ri-refund-2-line' 
        
    },
    
  ];

  const employeeMenu = [

    {
        name: 'Lista de usuarios',
        path: '/admin/users',
        icon: 'ri-user-add-line'
    },
    {
        name: 'Mi Perfil',
        path: `/employee/profile/${user?._id}`,
        icon: 'ri-user-line'
    }

  ];

  const welcome = 'Bienvenido a nuestro centro de administración ';
  const menuToBeRendered = user?.isAdmin ? adminMenu : employeeMenu ;
  const role = user?.isAdmin ? 'Admin' : user?.isEmployee ? 'Profesional' : 'Cliente';

  return (
    <div className='main'>
        <div className='layout'>

            <div className='welcome'>
                <h1>Hola!</h1>
                <p className='welcome-name'>{welcome} </p>
                <p className='role'>{role}</p>
            </div>

            <div className='sidebar'>
                    <div className="sidebar-header">
                    </div>

                    <div className="menu">
                        { menuToBeRendered.map((menu) => {
                            const isActive = location.pathname === menu.path;
                            return  <Link to={menu.path} className='menu-bg'>
                                        <div className={`menu-item ${isActive && 'active-menu-item'}`}>
                                            <i className={menu.icon}></i>
                                            <p>{menu.name}</p>
                                        </div>
                                        </Link>
                        })}
                                <div className='menu-bg' onClick={ clearCacheAndStorage} >
                                        <div className='menu-item'>
                                            <i className='ri-logout-box-line'></i>
                                            <p>Logout</p>
                                        </div>
                                </div>
                          
                    </div>
            </div>

            <div className="body">
                    { children }
                </div>
        </div>
    </div>
  )
}

export default Layout;