import {useState} from 'react'
import InputField from '@components/Edit/InputField'
import styled from "styled-components";
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import { HorizontalDivider } from '@styles/globalStyle';
import Button from '@components/Common/Button';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@components/Edit/DatePicker';
import Header from '@components/Header';
import { MainBox } from '@styles/globalStyle';


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
	const [error, setError] = useState({});
	const navigate = useNavigate();

	const handleNext = () => {
		const newError = {};
		if (!projectName) newError.projectName = true;
		if (!deadline) newError.deadline = true;
		if (!sprint) newError.sprint = true;
		if (!github) newError.github = true;
		if (!discord) newError.discord = true;
		setError(newError);
		if (Object.keys(newError).length === 0) {
			navigate('/buildproject2');
		}
	};

	return (
		<MainBox>
			<Header text='프로젝트 생성' />
				<Section>
					<Fieldset>
						<InputField
							label="프로젝트 명 입력"
							placeholder="입력하세요"
							value={projectName}
							onChange={e => {
								setProjectName(e.target.value);
								if (error.projectName && e.target.value) setError(prev => ({ ...prev, projectName: false }));
							}}
							require
							error={error.projectName}
						/>
						<DropDownWrapper>
							<div style={{ width: '100%' }}>
								<DatePicker
									label="마감기한 설정"
									require
									paramYear={deadline ? Number(deadline.split('-')[0]) : undefined}
									paramMonth={deadline ? Number(deadline.split('-')[1]) : undefined}
									paramDate={deadline ? Number(deadline.split('-')[2]) : undefined}
									setPickedDate={date => {
										setDeadline(date);
										if (error.deadline && date) setError(prev => ({ ...prev, deadline: false }));
									}}
									error={error.deadline}
								/>
							</div>
							<DropDown
								label="스프린트 단위"
								placeholder="Select team member"
								value={sprint}
								onChange={v => {
									setSprint(v);
									if (error.sprint && v !== '') setError(prev => ({ ...prev, sprint: false }));
								}}
								options={[
									{ value: '', label: 'Select team member' },
									{ value: '1주', label: '1주' },
									{ value: '2주', label: '2주' },
									{ value: '1개월', label: '1개월' },
								]}
								require
								error={error.sprint}
							/>
						</DropDownWrapper>
						<InputField
							label="Github Repo 주소 입력"
							placeholder="입력하세요"
							value={github}
							onChange={e => {
								setGithub(e.target.value);
								if (error.github && e.target.value) setError(prev => ({ ...prev, github: false }));
							}}
							require
							error={error.github}
						/>
						<InputField
							label="Discord 서버 ID 입력"
							placeholder="입력하세요"
							value={discord}
							onChange={e => {
								setDiscord(e.target.value);
								if (error.discord && e.target.value) setError(prev => ({ ...prev, discord: false }));
							}}
							require
							error={error.discord}
						/>
					</Fieldset>
				<ButtonGroup>
					<Button text="취소" type="button" onClick={() => navigate('/')} />
					<Button text="다음" type="button" onClick={handleNext} />
				</ButtonGroup>
				</Section>
		</MainBox>
	);
}
