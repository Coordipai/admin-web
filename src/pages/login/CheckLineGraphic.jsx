// src/pages/Login/CheckLineGraphic.jsx

export default function CheckLineGraphic () {
  return (
    <svg width='200' height='60' xmlns='http://www.w3.org/2000/svg'>

      <line x1='0' y1='30' x2='70' y2='30' stroke='#D1D5DB' strokeWidth='2' strokeDasharray='5,5' />

      <circle cx='100' cy='30' r='14' fill='#ECFDF5' stroke='#10B981' strokeWidth='2' />

      <polyline points='94,30 99,35 106,24' fill='none' stroke='#10B981' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />

      <line x1='130' y1='30' x2='200' y2='30' stroke='#D1D5DB' strokeWidth='2' strokeDasharray='5,5' />
    </svg>

  )
}
