import {useState} from 'react'
import InputField from '../../components/Edit/InputField'
import styled from "styled-components";
import Typography from '../../components/Edit/Typography'
import DropDown from '../../components/Edit/DropDown'
import FileTable from '../../components/Edit/FileTable';
import Button from '../../components/Common/Button';

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

const Title = styled.div`
	font-family: Poppins, sans-serif;
	font-weight: ${({ theme }) => theme.weights.bold};
	font-size: 1.5rem;
	color: ${({ theme }) => theme.colors.gray900};
`;

const Divider = styled.div`
	width: 100%;
	height: 1px;
	background: ${({ theme }) => theme.colors.gray200};
`;

const Fieldset = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
`;

const DropDownWrapper = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
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
	gap: 32px;
	overflow-y: hidden;
	overflow-x: hidden;
`;

export const BuildProject2 = () => {
	const [files, setFiles] = useState([]);

	return (
		<Layout>
			<Sidebar>
				<Typography variant="textMD" weight="medium" value="sidebar" />
			</Sidebar>
			<MainContainer>
				<HeaderSection>
					<Typography variant="textXL" weight="bold" value="프로젝트 생성" />
					<Divider />
				</HeaderSection>
			
				<Section>
					<Fieldset>
						<FileTable files={files} setFiles={setFiles} />
					</Fieldset>
					
					<ButtonGroup>
						<Button text="취소" type="button" onClick={() => {}} />
						<Button text="다음" type="submit" />
					</ButtonGroup>
				</Section>
				
			</MainContainer>
		</Layout>
	);
} 