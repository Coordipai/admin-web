import {useState} from 'react'
import InputField from '../../components/Edit/InputField'
import styled from "styled-components";
import Typography from '../../components/Edit/Typography'
import DropDown from '../../components/Edit/DropDown'

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
	gap: 32px;
	padding: 32px;
	width: 100%;
	background: ${({ theme }) => theme.colors.white};
	max-height: 100vh;
`;


const HeaderSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 24px;
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
	gap: 32px;
	width: 100%;
	align-items: center;
`;

const DropDownWrapper = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.margin.xl};
	width: 100%;
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 16px;
	margin-top: 32px;
	width: 100%;
`;

const Button = styled.button`
	padding: 0.625rem 1.125rem;
	border-radius: ${({ theme }) => theme.radius.lg};
	border: 1px solid ${({ theme }) => theme.colors.brand500};
	background: ${({ theme }) => theme.colors.brand500};
	color: ${({ theme }) => theme.colors.white};
	font-family: Poppins, sans-serif;
	font-weight: ${({ theme }) => theme.weights.semiBold};
	font-size: 1rem;
	cursor: pointer;
	transition: background 0.2s;
	&:hover {
		background: ${({ theme }) => theme.colors.brand600};
	}
`;

const CancelButton = styled(Button)`
	background: ${({ theme }) => theme.colors.white};
	color: ${({ theme }) => theme.colors.brand500};
`;

const Section = styled.section`
width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	
`;

export const BuildProject = () => {
	const [projectName, setProjectName] = useState('');
	const [deadline, setDeadline] = useState('');
	const [sprint, setSprint] = useState('');
	const [github, setGithub] = useState('');
	const [discord, setDiscord] = useState('');

	return (
		<Layout>
			<Sidebar>sidebar</Sidebar>
			<MainContainer>
				<HeaderSection>
					<Title>프로젝트 생성</Title>
					<Divider />
				</HeaderSection>
			
					<Section>
						<Fieldset>
							<InputField
								label="프로젝트 명 입력"
								placeholder="입력하세요"
								value={projectName}
								onChange={e => setProjectName(e.target.value)}
							/>
							<DropDownWrapper>
								<DropDown
									label="프로젝트 기한"
									placeholder="Select team member"
									value={deadline}
									onChange={setDeadline}
									options={[
										{ value: '', label: 'Select team member' },
										{ value: '1주', label: '1주' },
										{ value: '2주', label: '2주' },
										{ value: '1개월', label: '1개월' },
										{ value: '3개월', label: '3개월' },
									]}
								/>
								<DropDown
									label="스프린트 단위"
									placeholder="Select team member"
									value={sprint}
									onChange={setSprint}
									options={[
										{ value: '', label: 'Select team member' },
										{ value: '1주', label: '1주' },
										{ value: '2주', label: '2주' },
										{ value: '1개월', label: '1개월' },
									]}
								/>
							</DropDownWrapper>
							<InputField
								label="Github Repo 주소 입력"
								placeholder="입력하세요"
								value={github}
								onChange={e => setGithub(e.target.value)}
							/>
							<InputField
								label="Discord 서버 ID 입력"
								placeholder="입력하세요"
								value={discord}
								onChange={e => setDiscord(e.target.value)}
							/>
						</Fieldset>
					
					<ButtonGroup>
						<Button type="button">취소</Button>
						<Button type="submit">다음</Button>
					</ButtonGroup>
					</Section>
				
			</MainContainer>
		</Layout>
	);
}
