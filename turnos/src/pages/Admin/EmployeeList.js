import React, { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';

function EmployeeList() {
  const [employees, setEmployee] = useState([]);
  //const navigate = useNavigate()
  const dispatch = useDispatch()
  const getEmployeeData = async () => {
    try {
        dispatch(showLoading());
        const response = await axios.get('https://gimnasio-fiori-production.up.railway.app/api/admin/get-all-employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        dispatch(hideLoading());
        if(response.data.success) {
          setEmployee(response.data.data)
        }
    } catch (error) {
        dispatch(hideLoading());
    }
  }
  const deleteService = async (employeeId)=>{
    try {
      dispatch(showLoading());
      const response = await axios.delete('/api/admin/delete-service', 
      { data: {
        employeeId: employeeId
      }},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideLoading());
      if(response.data.success) {
        setEmployee(employees.filter(employee => employee._id !== employeeId));
      }
  } catch (error) {
      dispatch(hideLoading());
  }
  }
  const changeEmployeeStatus = async (record, status) => {
    try {
        dispatch(showLoading());
        const response = await axios.post('/api/admin/change-employee-status', { employeeId: record._id, userId: record.userId, status: status}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        dispatch(hideLoading());
        if(response.data.success) {
          toast.success(response.data.message);
          getEmployeeData();
        }
    } catch (error) {
        toast.error('Error cambiando el estado del empleado')
        dispatch(hideLoading());
    }
  }

  useEffect(() => {
    getEmployeeData()
  }, []);

  

  return (
  
<div className='service'>
        <div className='title-container'>
            <h1 className='title-notifications'>Lista de servicios.</h1>
            <i class="ri-file-list-line"></i>
        </div>
<div className='service-container'>
    {employees.map((employee) => (
      
                        <div className='user-card'>
                            <h2>{employee.name}</h2>
                            <p>{employee.email}</p>
                            {
                              employee.classes.map((clas)=>(
                               <p>{clas.name} {clas.day} {clas.timings[0]}-{clas.timings[1]} hs</p>
                              ))
                            }
                            
                            <p>{moment(employee.createAt).format('DD-MM-YYYY')}</p>
                            
                                                          
                            <div className='block-approve-employee'>
                                <h1 className='user-block' onClick={()=> deleteService(employee._id)}>Borrar servicio</h1>
                                {employee.status === 'pendiente' && <h1 className='user-block' onClick={() => changeEmployeeStatus(employee, 'aprobado')}>Aprobar</h1>}
                              {employee.status === 'aprobado' && <h1 className='user-block' onClick={() => changeEmployeeStatus(employee, 'blocked')}>Bloquear</h1>}
                            </div>
                        </div>
                    ))}
    </div>
</div>
  )
}

export default EmployeeList;