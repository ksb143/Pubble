import { useState, useEffect } from 'react';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import { getProject } from '@/apis/project.ts';

interface Event {
  eventStart: Date;
  eventEnd: Date | '';
  eventName: string;
  eventColor: string;
}

interface Project {
  projectId: number;
  prdId: string;
  startAt: string;
  endAt: string;
  projectTitle: string;
  people: number;
  progressRatio: number; // 프로젝트 진행률(실수)
  status: 'in progress' | 'complete' | 'before start'; // 프로젝트 상태
}

const Calendar = () => {
  const today = new Date();
  const monthNames: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const dayNames: string[] = ['일', '월', '화', '수', '목', '금', '토'];
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startingBlankDays, setStartingBlankDays] = useState<number[]>([]);
  const [endingBlankDays, setEndingBlankDays] = useState<number[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProject();
        if (response.data && response.data.length > 0) {
          const projectData = response.data.map((project: Project) => ({
            eventStart: new Date(project.startAt),
            eventEnd: new Date(project.endAt),
            eventName: project.projectTitle,
            eventColor: getRandomColor(),
          }));
          setEvents(projectData);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setEvents([]);
      }
    };
    fetchProjects();
  }, []);

  // 프로젝트 스케줄 랜덤 색상 반영
  const getRandomColor = () => {
    const colors = ['sky', 'indigo', 'yellow', 'emerald', 'red'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const isToday = (date: number): boolean => {
    const day = new Date(year, month, date);
    return today.toDateString() === day.toDateString();
  };

  const getEvents = (date: number): Event[] => {
    return events.filter(
      (e) =>
        new Date(e.eventStart).toDateString() ===
        new Date(year, month, date).toDateString(),
    );
  };

  const eventColor = (color: string): string => {
    switch (color) {
      case 'sky':
        return 'text-white bg-sky-500';
      case 'indigo':
        return 'text-white bg-indigo-500';
      case 'yellow':
        return 'text-white bg-amber-500';
      case 'emerald':
        return 'text-white bg-emerald-500';
      case 'red':
        return 'text-white bg-rose-400';
      default:
        return '';
    }
  };

  const getDays = (): void => {
    const days: number = new Date(year, month + 1, 0).getDate();

    const startingBlankDaysArray: number[] = [];
    const endingBlankDaysArray: number[] = [];

    const startingDayOfWeek: number = new Date(year, month).getDay();
    for (let i = 0; i < startingDayOfWeek; i++) {
      startingBlankDaysArray.push(i);
    }

    const endingDayOfWeek: number = new Date(year, month + 1, 0).getDay();
    for (let i = 1; i < 7 - endingDayOfWeek; i++) {
      endingBlankDaysArray.push(i);
    }

    setStartingBlankDays(startingBlankDaysArray);
    setEndingBlankDays(endingBlankDaysArray);
    setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
  };

  const handleNextMonth = () => {
    if (month === 11) {
      // 12월인 경우 (월 인덱스는 0부터 시작하므로 11이 12월을 의미)
      setMonth(0); // 1월로 설정
      setYear(year + 1); // 연도 증가
    } else {
      setMonth(month + 1);
    }
    getDays();
  };

  const handlePreviousMonth = () => {
    if (month === 0) {
      // 1월인 경우
      setMonth(11); // 12월로 설정
      setYear(year - 1); // 연도 감소
    } else {
      setMonth(month - 1);
    }
    getDays();
  };

  const handleToday = () => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    getDays();
  };

  useEffect(() => {
    getDays();
  }, [month, year]);

  return (
    <div className='flex max-h-[36rem] overflow-hidden'>
      {/* Content area */}
      <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
        <main className='grow'>
          <div className='max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8'>
            {/* Page header */}
            <div className='sticky top-0 z-10 mb-4 bg-gray-50 sm:flex sm:items-center sm:justify-between'>
              {/* Left: Title */}
              <div className='mb-4 sm:mb-0'>
                <h1 className='text-2xl font-bold text-slate-800 md:text-3xl dark:text-slate-100'>
                  <span>{`${year}년 ${monthNames[month]}월`}</span> ✨
                </h1>
              </div>

              {/* Right: Actions */}
              <div className='grid grid-flow-col justify-start gap-2 sm:auto-cols-max sm:justify-end'>
                {/* Previous month button */}
                <button
                  onClick={handleToday}
                  className='btn rounded border-slate-200 bg-white p-2 text-slate-500 hover:bg-gray-200'>
                  Today
                </button>
                <button
                  className='btn rounded border-slate-200 bg-white p-2 text-slate-500 hover:bg-gray-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
                  disabled={
                    month === 0 && year === today.getFullYear() - 100
                      ? true
                      : false
                  }
                  onClick={handlePreviousMonth}>
                  <ChevronLeftIcon className='h-5 w-5' />
                </button>

                {/* Next month button */}
                <button
                  className='btn rounded border-slate-200 bg-white p-2 text-slate-500 hover:border-slate-300 hover:bg-gray-200 hover:text-slate-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
                  disabled={
                    month === 11 && year === today.getFullYear() + 100
                      ? true
                      : false
                  }
                  onClick={handleNextMonth}>
                  <ChevronRightIcon className='h-5 w-5' />
                </button>
              </div>
            </div>

            {/* Calendar table */}
            <div className='overflow-hidden rounded-sm bg-white shadow dark:bg-slate-800'>
              {/* Days of the week */}
              <div className='grid grid-cols-7 gap-px border-b border-slate-200 dark:border-slate-700'>
                {dayNames.map((day) => {
                  return (
                    <div className='px-1 py-3' key={day}>
                      <div className='text-center text-sm font-medium text-slate-500 lg:hidden'>
                        {day.substring(0, 3)}
                      </div>
                      <div className='hidden text-center text-sm font-medium text-slate-500 lg:block dark:text-slate-400'>
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Day cells */}
              <div className='grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700'>
                {/* Diagonal stripes pattern */}
                <svg className='sr-only'>
                  <defs>
                    <pattern
                      id='stripes'
                      patternUnits='userSpaceOnUse'
                      width=''
                      height='5'
                      patternTransform='rotate(135)'>
                      <line
                        className='stroke-current text-slate-200 opacity-50 dark:text-slate-700'
                        x1='0'
                        y='0'
                        x2='0'
                        y2='5'
                        strokeWidth='2'
                      />
                    </pattern>
                  </defs>
                </svg>
                {/* Empty cells (previous month) */}
                {startingBlankDays.map((blankday) => {
                  return (
                    <div
                      className='h-20 bg-slate-50 sm:h-10 lg:h-36 dark:bg-slate-800'
                      key={blankday}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='100%'
                        height='100%'>
                        <rect width='100%' height='100%' fill='url(#stripes)' />
                      </svg>
                    </div>
                  );
                })}
                {/* Days of the current month */}
                {daysInMonth.map((day) => {
                  return (
                    <div
                      className='relative h-20 overflow-hidden bg-white sm:h-28 lg:h-36 dark:bg-slate-800'
                      key={day}>
                      <div className='flex h-full flex-col justify-between'>
                        {/* Events */}
                        <div className='relative flex grow flex-col overflow-hidden p-0.5 sm:p-1.5'>
                          {getEvents(day).map((event) => {
                            return (
                              <button
                                className='relative mb-1 w-full text-left'
                                key={event.eventName}>
                                <div
                                  className={`overflow-hidden rounded px-2 py-0.5 ${eventColor(event.eventColor)}`}>
                                  {/* Event name */}
                                  <div className='truncate text-xs font-semibold'>
                                    {event.eventName}
                                  </div>
                                  {/* Event time */}
                                  <div className='hidden truncate text-xs uppercase sm:block'>
                                    {/* Start date */}
                                    {event.eventStart && (
                                      <span>
                                        {event.eventStart.toLocaleTimeString(
                                          [],
                                          {
                                            hour12: true,
                                            hour: 'numeric',
                                            minute: 'numeric',
                                          },
                                        )}
                                      </span>
                                    )}
                                    {/* End date */}
                                    {event.eventEnd && (
                                      <span>
                                        -{' '}
                                        <span>
                                          {event.eventEnd.toLocaleTimeString(
                                            [],
                                            {
                                              hour12: true,
                                              hour: 'numeric',
                                              minute: 'numeric',
                                            },
                                          )}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                          <div
                            className='pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent dark:from-slate-800'
                            aria-hidden='true'></div>
                        </div>
                        {/* Cell footer */}
                        <div className='flex items-center justify-between p-0.5 sm:p-1.5'>
                          {/* More button (if more than 2 events) */}
                          {getEvents(day).length > 2 && (
                            <button className='whitespace-nowrap rounded border border-slate-200 px-0.5 text-center text-xs font-medium text-slate-500 sm:px-2 sm:py-0.5 dark:border-slate-700 dark:text-slate-300'>
                              <span className='md:hidden'>+</span>
                              <span>{getEvents(day).length - 2}</span>{' '}
                              <span className='hidden md:inline'>more</span>
                            </button>
                          )}
                          {/* Day number */}
                          <button
                            className={`ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-center text-xs font-medium hover:bg-indigo-100 sm:text-sm dark:text-slate-300 dark:hover:bg-slate-600 ${isToday(day) && 'text-indigo-500'}`}>
                            {day}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Empty cells (next month) */}
                {endingBlankDays.map((blankday) => {
                  return (
                    <div
                      className='h-20 bg-slate-50 sm:h-28 lg:h-36 dark:bg-slate-800'
                      key={blankday}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='100%'
                        height='100%'>
                        <rect width='100%' height='100%' fill='url(#stripes)' />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
