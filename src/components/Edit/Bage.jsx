import React from 'react';
import styled, { useTheme } from 'styled-components';
import PropTypes from 'prop-types';

const BadgeWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border-radius: 11px;
  padding: 2px 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
`;

const Dot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $dot }) => $dot};
`;

const Bage = ({ priority }) => {
  const theme = useTheme();
  // 타입별 색상 매핑
  const styleMap = {
    M: {
      bg: theme.colors.error50,
      color: theme.colors.error500,
      dot: theme.colors.error300,
      label: '[M] Must Have',
    },
    S: {
      bg: theme.colors.orange50,
      color: theme.colors.orange500,
      dot: theme.colors.orange300,
      label: '[S] Should Have',
    },
    C: {
      bg: theme.colors.warning50,
      color: theme.colors.warning500,
      dot: theme.colors.warning300,
      label: '[C] Could Have',
    },
    W: {
      bg: theme.colors.success50,
      color: theme.colors.success500,
      dot: theme.colors.success300,
      label: '[W] Won\'t Have',
    },
    DEFAULT: {
      bg: theme.colors.gray100,
      color: theme.colors.gray700,
      dot: theme.colors.gray400,
      label: priority || 'N/A',
    },
  };
  const style = styleMap[priority] || styleMap.DEFAULT;
  return (
    <BadgeWrapper $bg={style.bg} $color={style.color}>
      <Dot $dot={style.dot} />
      {style.label}
    </BadgeWrapper>
  );
};

Bage.propTypes = {
  priority: PropTypes.string
};

export default Bage;
