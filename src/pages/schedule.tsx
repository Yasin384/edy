import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';
import TouchBar from '../components/TouchBar';

// Interface for schedule items
interface ScheduleItem {
  id: number;
  class_obj: { id: number; name: string };
  subject: { id: number; name: string };
  teacher: { id: number; username: string };
  room: string;
  weekday: number;
  start_time: string;
  end_time: string;
}

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0 60px;
  min-height: 100vh;
  background: linear-gradient(180deg, #faf9ff, #ecebff);
  font-family: 'Arial', sans-serif;
`;

const DateNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 20px 20px;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow-x: auto;
`;

const DateButton = styled.button<{ $active: boolean }>`
  background: ${(props) => (props.$active ? '#6a5acd' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : '#6a5acd')};
  border: ${(props) => (props.$active ? 'none' : '1px solid #6a5acd')};
  border-radius: 12px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: bold;
  margin: 0 5px;
  cursor: pointer;
  flex-shrink: 0; /* Prevent shrinking */
  min-width: 60px;

  &:hover {
    background: #ddd;
    color: #6a5acd;
  }
`;

const RemainingTime = styled.p`
  margin: 10px 0;
  color: #6a5acd;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const ScheduleList = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0 10px;
`;

const ScheduleCard = styled.div<{ $empty?: boolean }>`
  display: flex;
  align-items: center;
  background: ${(props) => (props.$empty ? '#f5f5f5' : '#6a5acd')};
  color: ${(props) => (props.$empty ? '#aaa' : '#fff')};
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  background: ${(props) => (props.$empty ? '#e0e0e0' : '#ffffff')};
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 20px;
  color: ${(props) => (props.$empty ? '#ccc' : '#6a5acd')};
  margin-right: 10px;
`;

const CardInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const RoomNumber = styled.div`
  font-size: 12px;
  color: ${(props: { $empty?: boolean }) => (props.$empty ? '#ccc' : '#ddd')};
  margin-bottom: 5px;
`;

const SubjectName = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 5px;
`;

const Time = styled.p`
  font-size: 12px;
  color: ${(props: { $empty?: boolean }) => (props.$empty ? '#bbb' : '#fff')};
  margin-top: 5px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  text-align: center;
  color: #aaa;
`;

// Wrapper for mobile responsiveness
const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    ${DateButton} {
      font-size: 12px;
      padding: 6px 12px;
    }
    ${ScheduleCard} {
      flex-direction: row;
      align-items: center;
      padding: 10px;
    }
    ${IconContainer} {
      margin-right: 10px;
      width: 35px;
      height: 35px;
    }
    ${SubjectName} {
      font-size: 13px;
    }
    ${Time} {
      font-size: 11px;
    }
  }
`;

export default function Schedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules/');
        console.log('API Response:', response.data); // Debugging API response
        setSchedule(response.data.results || []); // Use `results` key for paginated data
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError('Failed to fetch schedules.');
      }
    };

    fetchSchedules();
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderScheduleForDay = (day: number) => {
    if (!schedule) return [];

    return schedule.filter((item) => item.weekday === day);
  };

  const todaySchedule = renderScheduleForDay(selectedDay);

  return (
    <ResponsiveWrapper>
      <PageContainer>
        <DateNavigation>
          {daysOfWeek.map((day, index) => (
            <DateButton
              key={index}
              $active={index === selectedDay}
              onClick={() => setSelectedDay(index)}
            >
              {day}
            </DateButton>
          ))}
        </DateNavigation>

        <RemainingTime>
          {todaySchedule.length > 0
            ? `Next class starts in X minutes`
            : 'No classes remaining for today'}
        </RemainingTime>

        <ScheduleList>
          {todaySchedule.length > 0 ? (
            todaySchedule.map((item) => (
              <ScheduleCard key={item.id}>
                <IconContainer $empty={false}>📚</IconContainer>
                <CardInfo>
                  <RoomNumber>{item.room || 'No Room Assigned'}</RoomNumber>
                  <SubjectName>{item.subject.name}</SubjectName>
                  <Time>
                    {item.start_time} - {item.end_time}
                  </Time>
                </CardInfo>
              </ScheduleCard>
            ))
          ) : (
            <ScheduleCard $empty>
              <IconContainer $empty>🚫</IconContainer>
              <CardInfo>
                <EmptyText>No classes available for this time slot.</EmptyText>
              </CardInfo>
            </ScheduleCard>
          )}
        </ScheduleList>

        <TouchBar />
      </PageContainer>
    </ResponsiveWrapper>
  );
}
