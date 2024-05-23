import React from 'react';
import { useNavigate } from 'react-router-dom';

function Employee({ employee }) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/book-appointment/${employee._id}`)}>
            <h2>{employee.name}</h2>
            <div>
                {employee.classes.map((classInfo, index) => (
                    <div key={index}>
                        <p className='clases'> Clase: {classInfo.name} - {classInfo.day} </p>
                        <h3>{classInfo.timings[0]}:00 - {classInfo.timings[1]}:00</h3>
                    </div>
                ))}
            </div>
            <i className="arrow ri-arrow-right-line"></i>
        </div>
    );
}

export default Employee;
