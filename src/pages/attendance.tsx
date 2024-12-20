import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

interface AttendanceRecord {
  date: string;
  status: string;
  class_obj?: { name: string };
  school?: { name: string };
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #f9f9ff;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.h2`
  margin-top: 20px;
  font-size: 24px;
  color: #4a4a4a;
`;

const AttendanceList = styled.ul`
  width: 90%;
  max-width: 400px;
  margin-top: 20px;
  padding: 0;
  list-style: none;
`;

const AttendanceItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoContainer = styled.div`
  flex: 1;
  text-align: left;

  p {
    margin: 2px 0;
    font-size: 14px;
    color: #333;
  }
`;

const StatusTag = styled.div<{ status: string }>`
  background-color: ${(props) =>
    props.status === 'present' ? '#6a5acd' : '#ff6b6b'};
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
`;

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get('/attendances/today/');
        console.log('Attendance response:', response.data);
        setAttendanceRecords(response.data || []);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to fetch attendance records.');
      }
    };

    fetchAttendance();
  }, []);

  if (!attendanceRecords.length && !error) {
    return <p>Loading attendance records...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <PageContainer>
      <Header>Attendance Records</Header>
      <AttendanceList>
        {attendanceRecords.map((record, index) => (
          <AttendanceItem key={index}>
            <InfoContainer>
              <p>Date: {record.date || 'Unknown'}</p>
              <p>Class: {record.class_obj?.name || 'N/A'}</p>
              <p>School: {record.school?.name || 'N/A'}</p>
            </InfoContainer>
            <StatusTag status={record.status}>{record.status}</StatusTag>
          </AttendanceItem>
        ))}
      </AttendanceList>
    </PageContainer>
  );
}
