import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login'
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyEmployee from './pages/ApplyEmployee';
import Notifications from './pages/Notifications';
import UsersList from './pages/Admin/UsersList';
import EmployeeList from './pages/Admin/EmployeeList';
import Profile from './pages/Employee/Profile';
import Layout from './components/Layout';
import BookAppointment from './pages/BookAppointment';
import Header from './components/Header';
import UserInfo from './pages/UserInfo';
import Appoinments from './pages/Appoinments';
import EmployeeAppoinments from './pages/Employee/EmployeeAppointments';
import AppointmentBooked from './pages/AppointmentBooked';
//import WhatsApp from './components/Whatsapp';


function App() {

  const { loading } = useSelector(state => state.alerts);

  return (
    <div className='App'>
      <BrowserRouter>
      <div>
          {loading && (
                <div className='spinner-parent'>
                <div class="spinner-border" role="status">
                </div>
              </div>
            )}
          <Toaster
                position="top-center"
                reverseOrder={false}
            />
          
          <Routes>
              <Route path='/login' element={ 
                  <PublicRoute>
                      <Login /> 
                  </PublicRoute>}/>
              <Route path='/register' element={ 
                  <PublicRoute>
                      <Register /> 
                  </PublicRoute>
                }/>
              <Route path='/' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Layout /> 
                  </ProtectedRoute>
                }/>

              <Route path='/home' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Home /> 
                  </ProtectedRoute>
                }/>
                <Route path='/apply-employee-account' element={ 
                  <ProtectedRoute>
                    <Header />
                      <ApplyEmployee /> 
                  </ProtectedRoute>
                  
                }/>
                <Route path='/notifications' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Notifications /> 
                  </ProtectedRoute>
                }/>
                 <Route path='/appointment-booked' element={ 
                  <ProtectedRoute>
                    <Header />
                      <AppointmentBooked /> 
                  </ProtectedRoute>
                }/>
                 <Route path='/get-user-info-by-id' element={ 
                  <ProtectedRoute>
                    <Header />
                    <UserInfo />
                      
                  </ProtectedRoute>
                }/>

                <Route path='/admin/users' element={ 
                  <ProtectedRoute>
                    <Header />
                      <UsersList /> 
                  </ProtectedRoute>
                }/>

                <Route path='/admin/employees' element={ 
                  <ProtectedRoute>
                    <Header />
                      <EmployeeList /> 
                  </ProtectedRoute>
                }/>

                <Route path='/employee/profile/:employeeId' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Profile /> 
                  </ProtectedRoute>
                }/>

              <Route path='/book-appointment/:employeeId' element={ 
                  <ProtectedRoute>
                    <Header />
                      <BookAppointment /> 
                  </ProtectedRoute>
                }/>

              <Route path='/appointments' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Appoinments /> 
                  </ProtectedRoute>
                }/>

              <Route path='/employee/appointments' element={ 
                  <ProtectedRoute>
                    <Header />
                      <EmployeeAppoinments /> 
                  </ProtectedRoute>
                }/>
                <Route path='/admin/appointments' element={ 
                  <ProtectedRoute>
                    <Header />
                      <Appoinments /> 
                  </ProtectedRoute>
                }/>
          </Routes>
          {/* <WhatsApp/> */}
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
