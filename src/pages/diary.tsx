import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../utils/api';
import TouchBar from '../components/TouchBar';

// Interface for diary items
interface DiaryItem {
  subject: { id: number; name: string } | string;
  teacher: { username: string } | string | null;
  grades: Array<{ grade: number; date: string }> | null;
  average: { value: string } | string | null;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding-bottom: 60px;
  background: linear-gradient(180deg, #f4f5ff, #eae9ff);
  font-family: 'Arial', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6a5acd;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 0 0 15px 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Dropdown = styled.select`
  background-color: white;
  color: #333;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const DiaryList = styled.ul`
  width: 100%;
  max-width: 400px;
  margin: 20px 0;
  padding: 0;
  list-style: none;
`;

const DiaryItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const SubjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    margin: 2px 0;
    font-size: 14px;
    color: #555;

    &.subject {
      font-weight: bold;
      font-size: 16px;
    }
  }
`;

const GradeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6a5acd;
  color: white;
  width: 50px;
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #5a4eb0;
  }
`;

export default function Diary() {
  const [diary, setDiary] = useState<DiaryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState('I Четверть');
  const [modalData, setModalData] = useState<{ subject: string; grades: string } | null>(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await api.get('/grades/');
        console.log('API Response:', response.data); // Debug the grades response
        setDiary(response.data?.results || []);
      } catch (err) {
        console.error('Error fetching diary:', err);
        setError('Failed to fetch diary data.');
      }
    };

    fetchDiary();
  }, [selectedQuarter]);

  const openModal = (subject: string, grades: Array<{ grade: number; date: string }> | null) => {
    if (!grades || grades.length === 0) {
      setModalData({ subject, grades: 'No grades available' });
    } else {
      const gradesDisplay = grades.map((g) => `Grade: ${g.grade}, Date: ${g.date}`).join('\n');
      setModalData({ subject, grades: gradesDisplay });
    }
  };

  const closeModal = () => setModalData(null);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <PageContainer>
      <Header>
        <span>Diary</span>
        <Dropdown value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
          <option value="I Четверть">I Четверть</option>
          <option value="II Четверть">II Четверть</option>
          <option value="III Четверть">III Четверть</option>
          <option value="IV Четверть">IV Четверть</option>
          <option value="Итоговые">Final</option>
        </Dropdown>
      </Header>
      <DiaryList>
        {diary.map((item, index) => (
          <DiaryItemContainer
            key={index}
            onClick={() =>
              openModal(
                typeof item.subject === 'object' ? item.subject.name : item.subject,
                item.grades
              )
            }
          >
            <SubjectInfo>
              <p className="subject">
                {typeof item.subject === 'object' ? item.subject.name : item.subject}
              </p>
              <p>{item.teacher?.username || 'No teacher assigned'}</p>
            </SubjectInfo>
            <GradeContainer>
              {typeof item.average === 'object' ? item.average.value : item.average || '-'}
            </GradeContainer>
          </DiaryItemContainer>
        ))}
      </DiaryList>
      {modalData && (
        <ModalOverlay>
          <ModalContent>
            <h3>{modalData.subject}</h3>
            <pre>{modalData.grades}</pre> {/* Use <pre> for better formatting */}
            <CloseButton onClick={closeModal}>Close</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
      <TouchBar />
    </PageContainer>
  );
}
