import React from 'react';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const { user } = useSelector((state) => state.user);
  //const [ collapsed, setCollapsed ] = useState(false);
  const navigate = useNavigate();
  return (
    <div className='content'>
                <div className="header">
                        <i
                            className="ri-arrow-left-line header-action-icon" onClick={() => navigate(-1)}>
                        </i>

                    <div className='d-flex align-items-center'>
                    
                        <Badge count={user?.unseenNotifications.length} onClick={()=>navigate('/notifications')}>
                            <i className="ri-notification-line header-action-icon"></i>
                        </Badge>
                    </div>
                </div>
                
            </div>
  )
}

export default Header