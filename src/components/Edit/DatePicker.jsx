import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import InputField from './InputField'

import { ButtonBase } from '@styles/globalStyle'

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 24, 40, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`

const ModalLayout = styled.div`
  width: 20.5rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  background-color: white;
`

const CalendarCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
`

const CalendarMonthRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const CalendarMonthText = styled.span`
  ${({ theme }) => theme.texts.textMD}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray700};
`

const CalendarActions = styled.div`
  display: flex;
  gap: 0.75rem;
`

const CalendarDates = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
`

const CalendarCell = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: ${({ theme, $isSelected, $isDisabled }) =>
    $isSelected
      ? theme.colors.white
      : $isDisabled
      ? theme.colors.gray400
      : theme.colors.gray700};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected && theme.colors.brand600};
  cursor: ${({ $isHeader }) => !$isHeader && 'pointer'};

  &:hover {
    color: ${({ $isSelected, $isHeader }) =>
      !$isHeader && !$isSelected && '#182230'};
    background-color: ${({ theme, $isSelected, $isHeader }) =>
      !$isHeader && !$isSelected && theme.colors.gray50};
  }
`

const ModalActions = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.75rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.gray200};
`

const ChevronLeftIcon = ({ onClick }) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ cursor: 'pointer' }} onClick={onClick}>
    <path d='M15 18L9 12L15 6' stroke='#101828' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)
const ChevronRightIcon = ({ onClick }) => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ cursor: 'pointer' }} onClick={onClick}>
    <path d='M9 6L15 12L9 18' stroke='#101828' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
)

const DatePicker = ({ paramYear, paramMonth, paramDate, setPickedDate, label, require, error, helperText }) => {
  const [showModal, setShowModal] = useState(false)
  const [calendarData, setCalendarData] = useState([])
  const [year, setYear] = useState(paramYear)
  const [month, setMonth] = useState(paramMonth)
  const [date, setDate] = useState(paramDate)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const isError = error
  let showHelper
  if (isError) {
    showHelper = helperText || (require ? '필수 입력 항목입니다.' : undefined)
  }

  function generateCalendar (year, month, date) {
    if (month < 1) {
      month = 12
      year = year - 1
    } else if (month > 12) {
      month = 1
      year = year + 1
    }
    setYear(year)
    setMonth(month)
    setDate(date)

    // 해당 월의 첫 번째 날과 마지막 날 계산
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)

    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    // 첫 번째 row를 채우기 위해 이전 달 날짜 계산
    const previousMonthLastDay = new Date(year, month - 1, 0).getDate() // 이전 달 마지막 날짜
    const previousMonthYear = month === 1 ? year - 1 : year // 이전 달의 연도
    const previousMonth = month === 1 ? 12 : month - 1 // 이전 달의 월
    const previousMonthDays = Array.from({ length: startDay }, (_, i) => ({
      year: previousMonthYear,
      month: previousMonth,
      date: previousMonthLastDay - startDay + i + 1,
      isDisabled: true
    }))

    // 이번 달 날짜 배열 생성
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      year,
      month,
      date: i + 1,
      isSelected: i + 1 == date
    }))

    // 총 6줄을 채우기 위해 다음 달 날짜 계산
    const totalDaysNeeded = 7 * 6
    const daysFilled = previousMonthDays.length + currentMonthDays.length
    const nextMonthYear = month === 12 ? year + 1 : year // 다음 달의 연도
    const nextMonth = month === 12 ? 1 : month + 1 // 다음 달의 월
    const nextMonthDays = Array.from(
      { length: totalDaysNeeded - daysFilled },
      (_, i) => ({
        year: nextMonthYear,
        month: nextMonth,
        date: i + 1,
        isDisabled: true
      })
    )

    const allDays = [
      ...previousMonthDays,
      ...currentMonthDays,
      ...nextMonthDays
    ]
    setCalendarData(allDays)
    setSelectedMonth(`${year}년 ${String(month).padStart(2, '0')}월`)
  }

  const setOriginalDate = useCallback(() => {
    if ((!paramYear || !paramMonth || !paramDate) && selectedDate == '') {
      const curr = new Date()
      const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000
      const KR_TIME_DIFF = 9 * 60 * 60 * 1000
      const kr_curr = new Date(utc + KR_TIME_DIFF)
      const todayYear = kr_curr.getFullYear()
      const todayMonth = kr_curr.getMonth() + 1
      const todayDate = kr_curr.getDate()
      generateCalendar(todayYear, todayMonth, todayDate)
    } else if ((paramYear || paramMonth || paramDate) && selectedDate == '') {
      generateCalendar(paramYear, paramMonth, paramDate)
    }
  }, [paramDate, paramMonth, paramYear, selectedDate])

  useEffect(() => {
    setOriginalDate()
  }, [setOriginalDate])

  useEffect(() => {
    if (paramYear && paramMonth && paramDate) {
      setYear(paramYear)
      setMonth(paramMonth)
      setDate(paramDate)
      setSelectedDate(`${paramYear}-${String(paramMonth).padStart(2, '0')}-${String(paramDate).padStart(2, '0')}`)
      generateCalendar(paramYear, paramMonth, paramDate)
    }
  }, [paramYear, paramMonth, paramDate])

  return (
    <>
      <InputField
        label={label}
        require={require}
        value={selectedDate}
        onChange={() => {}}
        placeholder='날짜를 선택해주세요'
        readOnly
        error={isError}
        helperText={showHelper}
        onClick={() => {
          setOriginalDate()
          setShowModal(true)
        }}
      />
      {showModal && (
        <ModalBackdrop onClick={() => setShowModal(false)}>
          <ModalLayout onClick={(e) => e.stopPropagation()}>
            <CalendarCol>
              <CalendarMonthRow>
                <ChevronLeftIcon
                  onClick={() => {
                    generateCalendar(year, month - 1, date)
                  }}
                />
                <CalendarMonthText>{selectedMonth}</CalendarMonthText>
                <ChevronRightIcon
                  onClick={() => {
                    generateCalendar(year, month + 1, date)
                  }}
                />
              </CalendarMonthRow>
              <CalendarActions>
                <InputField
                  value={`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`}
                  readOnly
                  onChange={() => {}}
                  style={{ flex: 1 }}
                />
                <ButtonBase
                  onClick={() => {
                    const today = new Date()
                    const todayYear = today.getFullYear()
                    const todayMonth = today.getMonth() + 1
                    const todayDate = today.getDate()
                    setYear(todayYear)
                    setMonth(todayMonth)
                    setDate(todayDate)
                    generateCalendar(todayYear, todayMonth, todayDate)
                  }}
                >
                  오늘
                </ButtonBase>
              </CalendarActions>
              <CalendarDates>
                <CalendarCell $isHeader>월</CalendarCell>
                <CalendarCell $isHeader>화</CalendarCell>
                <CalendarCell $isHeader>수</CalendarCell>
                <CalendarCell $isHeader>목</CalendarCell>
                <CalendarCell $isHeader>금</CalendarCell>
                <CalendarCell $isHeader>토</CalendarCell>
                <CalendarCell $isHeader>일</CalendarCell>
                {calendarData.map((item, index) => {
                  return (
                    <CalendarCell
                      key={index}
                      onClick={() => {
                        generateCalendar(item.year, item.month, item.date)
                      }}
                      $isSelected={(item.isSelected ??= false)}
                      $isDisabled={item.isDisabled}
                    >
                      {item.date}
                    </CalendarCell>
                  )
                })}
              </CalendarDates>
            </CalendarCol>
            <ModalActions>
              <ButtonBase
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowModal(false)}
              >
                취소
              </ButtonBase>
              <ButtonBase
                style={{ flex: 1, justifyContent: 'center' }}
                $isHighlighted
                onClick={() => {
                  const newSelectedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                  setSelectedDate(newSelectedDate)
                  setPickedDate(newSelectedDate)
                  setShowModal(false)
                }}
              >
                확인
              </ButtonBase>
            </ModalActions>
          </ModalLayout>
        </ModalBackdrop>
      )}
    </>
  )
}

DatePicker.propTypes = {
  paramYear: PropTypes.number,
  paramMonth: PropTypes.number,
  paramDate: PropTypes.number,
  setPickedDate: PropTypes.func.isRequired,
  label: PropTypes.string,
  require: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string
}

export { DatePicker }
