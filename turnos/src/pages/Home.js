import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Employee from '../components/Employee';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';

function Home() {
    const [ employees, setEmployees ] = useState([]);
    const dispath = useDispatch();
    const getData = async () => {
        try {
            dispath(showLoading())
            const response = await axios.get('/api/user/get-all-employees', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            dispath(hideLoading());
            if(response.data.success) {
                console.log(response);
                setEmployees(response.data.data)
                

            }
        } catch (error) {
            dispath(hideLoading())
        }
    }

    useEffect(() => {
        getData();
    }, [])
    return (
            <div className='service'>
                <div className='title-container'>
                    <h1 className='title-notifications'>Seleccione la clase a la que quiere inscribirse.</h1>
                    <i class="ri-add-circle-line"></i>
                </div>
                <div className='service-container'>
                    <div className='service-container'>
                       
                        {employees.map((employee) => (
                           
                            <div className='service-card' >
                                <Employee employee={employee} />
                            </div>
                        ))}
                    </div>
                </div> 
            </div>
    )
}

export default Home