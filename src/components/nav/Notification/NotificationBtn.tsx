'use client'

import { useEffect, useRef, useState } from "react";
import { UserInfo } from "../NavBar";
import NotificationContainer from "./NotificationContainer";
import { BsBellFill } from 'react-icons/bs';

interface Props {
  myUserInfo: UserInfo | undefined
}

const NotificationBtn: React.FC<Props> = ({ myUserInfo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowNotification(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div ref={ref} className="relative inline-block h-full">
      <button onClick={toggleNotification} className="p-3 text-[#fff] bg-[#798597] hover:bg-[#94B0DD] rounded-full font-medium focus:outline-none">
        <BsBellFill className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <div className={showNotification ? "" : "hidden"}>
        {myUserInfo ?
          <NotificationContainer myUserInfo={myUserInfo} setUnreadCount={setUnreadCount} showNotification={showNotification} /> : null
        }
      </div>
    </div>
  );
};

export default NotificationBtn;