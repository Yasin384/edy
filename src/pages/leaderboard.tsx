import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';
import TouchBar from '../components/TouchBar';

// Interface for leaderboard items
interface LeaderboardItem {
  id: number;
  user_profile: {
    user: {
      username: string;
    };
    xp: number;
    level: number;
  };
  rank: number;
}

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0 60px;
  min-height: 100vh;
  background-color: #f9f9ff;
  font-family: 'Arial', sans-serif;
`;

const LeaderboardTitle = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #4a4a4a;
  margin: 15px 0;
`;

const LeaderboardList = styled.ul`
  width: 90%;
  max-width: 400px;
  margin-top: 10px;
  padding: 0;
  list-style: none;
`;

const LeaderboardItemContainer = styled.li<{ $highlight: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.$highlight ? '#e6e6ff' : '#fff')};
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${(props) => (props.$highlight ? '#d4d4ff' : '#f0f0f0')};
    transform: translateY(-2px);
  }
`;

const RankCircle = styled.div`
  width: 36px;
  height: 36px;
  background-color: #6a5acd;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  p {
    margin: 2px 0;
    font-size: 14px;
    color: #333;

    &.username {
      font-weight: bold;
    }
  }
`;

const XPTag = styled.div`
  background-color: #ffe4b5;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
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

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard/');
        console.log('API Response:', response.data); // Debugging API response
        setLeaderboard(response.data.results || []); // Use `results` key for paginated data
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to fetch leaderboard.');
      }
    };

    fetchLeaderboard();
  }, []);

  if (leaderboard === null && error === null) {
    return <LoadingText>Loading leaderboard...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (leaderboard?.length === 0) {
    return <ErrorText>No leaderboard data available.</ErrorText>;
  }

  return (
    <PageContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <LeaderboardList>
        {leaderboard.map((item) => (
          <LeaderboardItemContainer
            key={item.id}
            $highlight={item.user_profile.user.username === 'yasin'}
          >
            <RankCircle>{item.rank}</RankCircle>
            <UserInfo>
              <p className="username">{item.user_profile.user.username}</p>
              <p>Level: {item.user_profile.level}</p>
            </UserInfo>
            <XPTag>{item.user_profile.xp} XP</XPTag>
          </LeaderboardItemContainer>
        ))}
      </LeaderboardList>
      <TouchBar />
    </PageContainer>
  );
}
