import { TYearMonthDate } from 'types/calendar';

const getYearMonthDate = (selectedDate: Date): TYearMonthDate => {
  const newDate = selectedDate;
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const date = newDate.getDate();

  return { year, month, date };
};

const changeDate = (date: Date): string =>
  `${date.getFullYear()}.${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}.${
    date.getDate() < 10 ? '0' : ''
  }${date.getDate()}`;

export { getYearMonthDate, changeDate };
