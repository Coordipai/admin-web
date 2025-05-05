import {useState} from 'react'
import InputField from '@components/Edit/InputField'
import styled from "styled-components";
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable';
import Button from '@components/Common/Button';
import { HorizontalDivider } from '@styles/globalStyle';
import { useNavigate } from 'react-router-dom';

const Layout = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	background: ${({ theme }) => theme.colors.white};
`;

const Sidebar = styled.div`
	width: 312px;
	min-width: 240px;
	background: ${({ theme }) => theme.colors.white};
	border-right: 1px solid ${({ theme }) => theme.colors.gray200};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	font-weight: ${({ theme }) => theme.weights.semiBold};
	color: ${({ theme }) => theme.colors.gray400};
`;

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${({ theme }) => theme.gap.xl};
	padding: ${({ theme }) => theme.padding.xl};
	width: 100%;
	background: ${({ theme }) => theme.colors.white};
	max-height: 100vh;
`;

const HeaderSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.lg};
	width: 100%;
`;


const Fieldset = styled.div`
	flex: 1;
	min-height: 0;
	max-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
`;


const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${({ theme }) => theme.gap.md};
	width: 100%;
`;

const Section = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	max-height: 100%;
	flex: 1;
	min-height: 0;
	gap: ${({ theme }) => theme.gap.xl};
	overflow-y: hidden;
	overflow-x: hidden;
`;

export const BuildProject2 = () => {
	const [files, setFiles] = useState([]);
	const navigate = useNavigate();

	return (
		<Layout>
			<Sidebar>
				<Typography variant="textMD" weight="medium" value="sidebar" />
			</Sidebar>
			<MainContainer>
				<HeaderSection>
					<Typography variant="textXL" weight="bold" value="프로젝트 생성" />
					<HorizontalDivider />
				</HeaderSection>
			
				<Section>
					<Fieldset>
						<FileTable files={files} setFiles={setFiles} />
					</Fieldset>
					
					<ButtonGroup>
						<Button text="취소" type="button" onClick={() => navigate(-1)} />
						<Button text="다음" type="button" onClick={() => navigate('/buildproject3')} />
					</ButtonGroup>
				</Section>
				
			</MainContainer>
		</Layout>
	);
} 