import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
import { server } from '../setupTests';
import { Event, EventForm } from '../types';

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user };
};

const newEvent: Omit<Event, 'id' | 'notificationTime' | 'repeat'> = {
  title: '새 회의',
  date: '2024-10-15',
  startTime: '14:00',
  endTime: '15:00',
  description: '프로젝트 진행 상황 논의',
  location: '회의실 A',
  category: '업무',
};

const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.selectOptions(screen.getByLabelText('카테고리'), category);

  await user.click(screen.getByTestId('event-submit-button'));
};

it('zen폼값이 제대로 입력이 됐는가', async () => {
  setupMockHandlerCreation();

  const { user } = setup(<App />);

  await saveSchedule(user, newEvent);

  const eventList = within(screen.getByTestId('event-list'));
  expect(eventList.getByText('새 회의')).toBeInTheDocument();
  expect(eventList.getByText('2024-10-15')).toBeInTheDocument();
  expect(eventList.getByText('14:00 - 15:00')).toBeInTheDocument();
  expect(eventList.getByText('프로젝트 진행 상황 논의')).toBeInTheDocument();
  expect(eventList.getByText('회의실 A')).toBeInTheDocument();
  expect(eventList.getByText('카테고리: 업무')).toBeInTheDocument();
});
describe('(필수) 반복 유형 선택', () => {
  it('일정 생성 시 반복 유형을 선택할 수 있다.(매일).', async () => {
    // setupMockHandlerCreation();
    // const { user } = setup(<App />);
    // await saveSchedule(user, {
    //   title: '헤이즐넛라떼 3샷에 우유많이',
    //   date: '2025-02-01',
    //   startTime: '14:00',
    //   endTime: '15:00',
    //   description: '매일 반복',
    //   location: '5층 카페',
    //   category: '업무',
    //   // repeat: { type: 'daily', interval: 0 },
    //   notificationTime: 1,
    // });
  });
  it('일정 생성 시 반복 유형을 선택할 수 있다.(매주).', async () => {});
  it('일정 생성 시 반복 유형을 선택할 수 있다.(매월).', async () => {});
  it('일정 생성 시 반복 유형을 선택할 수 있다.(매년).', async () => {});
  it('일정 수정 시 반복 유형을 선택할 수 있다.(매일).', async () => {});
  it('일정 수정 시 반복 유형을 선택할 수 있다.(매주).', async () => {});
  it('일정 수정 시 반복 유형을 선택할 수 있다.(매월).', async () => {});
  it('일정 수정 시 반복 유형을 선택할 수 있다.(매년).', async () => {});
  it('윤년(2/29) 반복일정 설정 시 4년에 한번 반복하도록 저장된다.', async () => {});
  it("1월 31일부터 '매월 31일' 반복 저장/ 종료일 5월 31일인 경우 31일이 있는 월인 1월, 3월, 5월만 저장된다.", async () => {});
  it("(필수아님)매월 '월말' 반복 저장 시 윤년의 29일에 저장된다.", async () => {});
  it("(필수아님)매월 '월말' 반복 저장 시 일반적 2월의 28일에 저장된다.", async () => {});
  it("(필수아님)매월 '월말' 반복 저장 시 3월의 31일에 저장된다.", async () => {});
  it("(필수아님)매월 '월말' 반복 저장 시 4월의 30일에 저장된다.", async () => {});
});

describe('(필수) 반복 간격 설정', () => {
  it("2025-02-3부터 '3일마다 한번'씩 일정을 설정하고 종료일을 2/9일로 설정하는 경우 2/6, 2/9일에 일정이 등록된다.", async () => {});
  it("2025-02-3일부터 '3주마다 한번'씩 일정을 설정하고 종료일을 2025-03-31 로 설정하는 경우 2/24, 3/17일에도 저장된다.", async () => {});
  it("2025-02-03일부터 '2개월마다 한번'씩 일정을 설정하고 종료일을 2025-05-01 로 설정하는 경우 03-03, 04-03일에도 저장된다.", async () => {});
});

describe('(필수) 반복 일정 표시', () => {
  it('반복 일정은 title 앞에 🔄가 표시된다', async () => {});
});

describe('(필수) 반복 종료', () => {
  it('2025-02-01부터 2025-06-30 까지 매 달 1일 반복하는 일정을 저장할 수 있다. ', async () => {});
  it('2025-02-01부터 매 달 1일, 3번 반복하는 일정을 저장할 수 있다. ', async () => {});
  it('2025-02-01부터 매 달 1일에 반복하는 일정을 저장 할 수 있다. ', async () => {});
});

describe('(필수) 반복 일정 단일 수정', () => {
  it('반복일정을 수정하면 단일 일정으로 변경되고, 반복일정 아이콘이 사라진다. ', async () => {});
  it('기존에 저장된 다른 반복 일정은 사라지지 않는다.', async () => {});
});
describe('(필수) 반복 일정 단일 삭제', () => {
  it('반복일정을 삭제하면 해당 일정만 삭제합니다.', async () => {});
});
// describe('일정 CRUD 및 기본 기능', () => {
//   it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
//     setupMockHandlerCreation();

//     const { user } = setup(<App />);

//     await saveSchedule(user, {
//       title: '새 회의',
//       date: '2024-10-15',
//       startTime: '14:00',
//       endTime: '15:00',
//       description: '프로젝트 진행 상황 논의',
//       location: '회의실 A',
//       category: '업무',
//     });

//     const eventList = within(screen.getByTestId('event-list'));
//     expect(eventList.getByText('새 회의')).toBeInTheDocument();
//     expect(eventList.getByText('2024-10-15')).toBeInTheDocument();
//     expect(eventList.getByText('14:00 - 15:00')).toBeInTheDocument();
//     expect(eventList.getByText('프로젝트 진행 상황 논의')).toBeInTheDocument();
//     expect(eventList.getByText('회의실 A')).toBeInTheDocument();
//     expect(eventList.getByText('카테고리: 업무')).toBeInTheDocument();
//   });
// });
