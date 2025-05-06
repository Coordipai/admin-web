import React from 'react'
import PropTypes from 'prop-types'
import { theme } from '@styles/theme'

/**
 * @param {object} props - 컴포넌트의 props
 * @param {string} [props.variant='textMD'] - 텍스트 스타일의 종류를 결정합니다. `theme.texts` 객체의 키 값 중 하나를 사용합니다.
 * @param {string} [props.weight='medium'] - 텍스트 굵기를 결정합니다. `theme.weights` 객체의 키 값 중 하나를 사용합니다.
 * @param {string} [props.value='test'] - 렌더링할 텍스트 값입니다.
 * @param {string} [props.color='gray900'] - 텍스트 색상을 결정합니다. `theme.colors` 객체의 키 값 중 하나를 사용합니다.
 * @returns {JSX.Element} 스타일이 적용된 텍스트를 담는 `div` 엘리먼트를 반환합니다.
 *
 * @example
 * // 작은 글씨체와 보통 굵기, 회색으로 "반갑습니다"를 렌더링
 * <Typography variant="textSM" weight="regular" color="gray500" value="반갑습니다" />
 */
const Typography = ({ variant = 'textMD', weight = 'medium', color = 'gray700', value = 'test' }) => {
  const style = {
    ...parseCSS(theme.texts[variant]),
    fontWeight: theme.weights[weight],
    color: theme.colors[color],
    textAlign: 'left', // 글씨를 왼쪽 정렬로 설정
    width: 'fit-content' // 너비를 컨텐츠에 맞게 설정
  }

  return <div style={style}>{value}</div>
}

// Helper function to parse CSS string into an object
const parseCSS = (cssString) => {
  return cssString
    .split(';')
    .filter((rule) => rule.trim() !== '')
    .reduce((acc, rule) => {
      const [property, value] = rule.split(':').map((item) => item.trim())
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
      acc[camelCaseProperty] = value
      return acc
    }, {})
}

Typography.propTypes = {
  variant: PropTypes.oneOf(Object.keys(theme.texts)).isRequired,
  weight: PropTypes.oneOf(Object.keys(theme.weights)).isRequired,
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  value: PropTypes.string.isRequired
}

export default Typography
