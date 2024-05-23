import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function AppointmentBooked() {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bookedAppointment = state ? state.bookedAppointment : null;

    const goBack = async () => {
        dispatch(showLoading());
        dispatch(hideLoading());
        navigate('/');
    };

    const goToAppointments = async () => {
        dispatch(showLoading());
        dispatch(hideLoading());
        navigate('/appointments');
    };

    return (
        <div className='booked-container'>
            <div className='title-container'>
                <h1 className='title-notifications'>Su inscripción a la clase</h1>
                <i className="ri-calendar-check-line"></i>
            </div>
            {bookedAppointment ? (
                <div>
                    <section className='green-dot-container booked'>
                        <div className='green-dot'></div>
                    </section>
                    <div className='booked-notification'>
                        <h2 className='title-appointment-notifications'>
                            Su inscripción ha sido confirmada para la clase: {bookedAppointment.className} de los dias {bookedAppointment.classDay} en el horario de {bookedAppointment.classTime[0]} a {bookedAppointment.classTime[1]}.
                        </h2>
                        <div className='buttons-appointment'>
                            <h1 className='button-booked' onClick={goBack}>
                                Volver
                            </h1>
                            <h1 className='button-booked' onClick={goToAppointments}>
                                Mis clases
                            </h1>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No se han proporcionado datos de inscripción.</p>
            )}
        </div>
    );
}

export default AppointmentBooked;