import { useState } from 'react'
import InputField from '@components/Edit/InputField'
import styled from "styled-components";
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable';
import Button from '@components/Common/Button';
import { HorizontalDivider, MainBox } from '@styles/globalStyle';
import { useNavigate } from 'react-router-dom';
import Header from '@components/Header';

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
		<MainBox>
			<Header text="프로젝트 생성"/>

			<Section>
				<Fieldset>
					<FileTable files={files} setFiles={setFiles} />
				</Fieldset>
				
				<ButtonGroup>
					<Button text="취소" type="button" onClick={() => navigate(-1)} />
					<Button text="다음" type="button" onClick={() => navigate('/buildproject3')} />
				</ButtonGroup>
			</Section>
		</MainBox>
	)
} 