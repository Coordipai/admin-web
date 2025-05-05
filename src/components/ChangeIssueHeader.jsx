import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { ButtonBase, HorizontalDivider } from "@styles/globalStyle";
import EditHeaderTabs from "@components/EditHeaderTabs";

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const HeaderLayout = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: space-between;
`;

const HeaderTextBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const HeaderText = styled.span`
    ${({ theme }) => theme.texts.displayXS}
    font-weight: ${({ theme }) => theme.weights.semiBold};
    color: ${({ theme }) => theme.colors.gray900};
`;

const HeaderActionsBox = styled.div`
    display: flex;
    gap: 0.5rem;
    align-self: flex-start;
`;

const Header = ({ text, buttonsData = [], isTab }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    
    return (
    <HeaderContainer>
        <HeaderLayout>
            <HeaderTextBox>
                <HeaderText>{text}</HeaderText>
            </HeaderTextBox>
            <HeaderActionsBox>
                {buttonsData.map((item, index) => {
                return (
                    <ButtonBase
                        key={index}
                        $isHighlighted={item.isHighlighted}
                        onClick={item.onClick}
                    >
                        {item.icon}
                        {item.value}
                    </ButtonBase>
                );
                })}
            </HeaderActionsBox>
        </HeaderLayout>
        {isTab ? <EditHeaderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}/> : <HorizontalDivider />}
    </HeaderContainer>
  );
};

Header.propTypes = {
  text: PropTypes.string.isRequired,
  buttonsData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      icon: PropTypes.element,
    })
  ),
  isTab: PropTypes.bool,
};

export default Header;