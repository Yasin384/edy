import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

// Icons (replace with your preferred icons)
import { FaHome, FaTrophy, FaCalendarAlt, FaBook, FaUser } from 'react-icons/fa';

const TouchBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #6a5acd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const TouchBarItem = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => (props.$active ? '#fff' : '#dcdcdc')};
  font-size: 12px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s;

  &:hover {
    color: #fff;
    transform: scale(1.1);
  }

  svg {
    font-size: 20px;
    margin-bottom: 5px;
  }
`;

const TouchBarLabel = styled.span`
  font-size: 10px;
  font-weight: bold;
`;

export default function TouchBar() {
  const router = useRouter();

  const menuItems = [
    { icon: <FaHome />, label: 'Home', route: '/' },
    { icon: <FaTrophy />, label: 'Leaderboard', route: '/leaderboard' },
    { icon: <FaCalendarAlt />, label: 'Schedule', route: '/schedule' },
    { icon: <FaBook />, label: 'Diary', route: '/diary' },
    { icon: <FaUser />, label: 'Profile', route: '/profile' },
  ];

  return (
    <TouchBarContainer>
      {menuItems.map((item, index) => (
        <TouchBarItem
          key={index}
          $active={router.pathname === item.route}
          onClick={() => router.push(item.route)}
        >
          {item.icon}
          <TouchBarLabel>{item.label}</TouchBarLabel>
        </TouchBarItem>
      ))}
    </TouchBarContainer>
  );
}
