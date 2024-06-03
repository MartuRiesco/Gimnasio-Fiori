// UserDeleteButton.js
import React from 'react';
import axios from 'axios';

const UserDeleteButton = ({ userId }) => {
  const deleteUser = async () => {
    try {
      const response = await axios.delete(`https://gimnasio-fiori-production.up.railway.app/api/admin/${userId}`); // Envía una solicitud DELETE al backend
      alert(response.data.message); 
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Error al eliminar el usuario');
    }
  };

  return (
    <button onClick={deleteUser}>Eliminar Usuario</button>
  );
};

export default UserDeleteButton;
