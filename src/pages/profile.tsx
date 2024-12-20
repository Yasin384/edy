import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import api from '../utils/api';
import TouchBar from '../components/TouchBar';

// Interface for user data
interface UserProfile {
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  xp: number;
  level: number;
  achievements: { id: number; name: string }[];
}

// Styled components for profile page design
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 60px; /* Leave space for TouchBar */
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  background-color: #6a5acd;
  color: white;
  text-align: center;
  padding: 20px 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #6a5acd;
`;

const Username = styled.h2`
  margin-top: 10px;
  font-size: 20px;
`;

const RoleTag = styled.p`
  font-size: 14px;
  margin-top: 5px;
`;

const StatsContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StatLabel = styled.span`
  font-size: 16px;
  color: #555;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const AchievementsContainer = styled.div`
  width: 90%;
  max-width: 400px;
  margin: 20px auto;
`;

const AchievementCard = styled.div`
  background: #e8f5e9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AttendanceButton = styled.button`
  background-color: #6a5acd;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin: 20px auto;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5b4bb7;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
  margin-top: 20px;
`;

const LoadingText = styled.p`
  color: #6a5acd;
  font-size: 16px;
  margin-top: 20px;
`;

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/me/');
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, []);

  if (profile === null && error === null) {
    return <LoadingText>Loading profile...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  const handleAttendanceClick = () => {
    router.push('/attendance');
  };

  return (
    <PageContainer>
      <Header>
        <Avatar>{profile?.username[0].toUpperCase()}</Avatar>
        <Username>{profile?.username}</Username>
        <RoleTag>{profile?.role}</RoleTag>
      </Header>

      <StatsContainer>
        <StatsRow>
          <StatLabel>XP:</StatLabel>
          <StatValue>{profile?.xp}</StatValue>
        </StatsRow>
        <StatsRow>
          <StatLabel>Level:</StatLabel>
          <StatValue>{profile?.level}</StatValue>
        </StatsRow>
      </StatsContainer>

      <AttendanceButton onClick={handleAttendanceClick}>
        View Attendance Records
      </AttendanceButton>

      <AchievementsContainer>
        <h3>Achievements</h3>
        {profile?.achievements.length > 0 ? (
          profile.achievements.map((achievement) => (
            <AchievementCard key={achievement.id}>{achievement.name}</AchievementCard>
          ))
        ) : (
          <p>No achievements yet.</p>
        )}
      </AchievementsContainer>

      <TouchBar />
    </PageContainer>
  );
}
