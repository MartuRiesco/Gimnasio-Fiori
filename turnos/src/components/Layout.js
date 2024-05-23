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
};
  const userMenu = [
    {
        name: 'Clases Disponibles',
        path: '/home',
        icon: 'ri-arrow-right-line'
    },
    {
        name: 'Mis Clases',
        path: '/appointments',
        icon: 'ri-calendar-check-line'
    },
    {
        name: 'Mi Perfil',
        path: '/get-user-info-by-id',
        icon: 'ri-user-line'
    },
    {
        name: 'Cuenta Empleado',
        path:'/apply-employee-account',
        icon:'ri-user-add-line'
    }
  ];
  const adminMenu = [
    {
        name: 'Lista de Usuarios',
        path: '/admin/users',
        icon: 'ri-user-line'
    },
    {
        name: 'Clases',
        path: '/admin/appointments',
        icon: 'ri-calendar-check-line'
    },
    {
        name: 'Empleados',
        path: '/admin/employees',
        icon: 'ri-user-add-line'
    }
  ];

  const employeeMenu = [

    {
        name: 'Usuarios en Clases',
        path: '/employee/appointments',
        icon: 'ri-user-add-line'
    },
    {
        name: 'Mi Perfil',
        path: `/employee/profile/${user?._id}`,
        icon: 'ri-user-line'
    }

  ];

  const welcome = 'Bienvenido a nuestro centro de administración ';
  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isEmployee ? employeeMenu : userMenu;
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