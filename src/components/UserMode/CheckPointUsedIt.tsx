import React, { useState } from 'react';
import { styled, useTheme } from 'styled-components';
import { ModalContainer } from './UsePointUser';
import { CloseBtn, PointInput } from './AddPointModal';
import { darkTheme, defaultTheme } from '../../style/theme';
import { ModalAndModalType } from '../../types/ModalOpenTypes';
interface CheckPointUsedIt extends ModalAndModalType {
	onClickOpenModal: () => void;
	isOpenModal: boolean;
	points: number | null;
	onUsePoints: (usedPoints: number) => Promise<void>;
}
function CheckPointUsedIt({ isOpenModal, onClickOpenModal, points, onUsePoints }: CheckPointUsedIt) {
	const theme = useTheme();
	const [point, setPoint] = useState('');

	const handleConfirmClick = async () => {
		try {
			const enteredPoints = parseInt(point, 10);
			if (points && enteredPoints >= 1000 && enteredPoints <= points) {
				await onUsePoints(enteredPoints);
				onClickOpenModal();
			} else {
				alert('포인트를 확인하세요');
			}
		} catch (error) {
			console.error('err:', error);
		}
	};
	const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPoint(e.target.value);
	};
	const handlePointClick = () => {
		setPoint(points?.toString() ?? '');
	};
	return isOpenModal ? (
		<ModalContainer onClick={onClickOpenModal}>
			<DialogBox onClick={(e) => e.stopPropagation()}>
				<div className="guide-ment">
					<p>0 0 0 0 님, </p>
					<p>사용하실 포인트 입력 해주세요 </p>
					<img
						src={theme === defaultTheme ? '/assets/user/yellowcloud_light.svg' : '/assets/user/pinkcloud_dark.svg'}
						alt=""
						width={95}
					/>
				</div>
				<div className="point-check-allBtn">
					<button onClick={handlePointClick}>전액</button>
					<p>잔여 : {points?.toLocaleString() ?? '0'} point</p>
				</div>
				<InputExplain>
					<label htmlFor="point" hidden />
					<input
						type="number"
						id="point"
						name="point"
						value={point}
						placeholder="숫자만 입력해주세요"
						onChange={handlePointChange}
					></input>
					<p>1,000 포인트 이상 사용 가능합니다. </p>
				</InputExplain>
				<BtnContainer>
					<CloseBtn onClick={() => handleConfirmClick()}>확인</CloseBtn>
				</BtnContainer>
			</DialogBox>
		</ModalContainer>
	) : null;
}
const BtnContainer = styled.div`
	display: flex;
	width: 390px;
	justify-content: flex-end;
	font-size: ${({ theme }) => theme.fontSize['2xl']};
`;
const DialogBox = styled.dialog`
	width: 500px;
	height: 500px;
	position: absolute;
	bottom: 0;
	left: 350px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.white : darkTheme.textColor.black)};
	border: none;
	border-radius: 10px;
	box-sizing: border-box;
	z-index: 10000;
	.guide-ment {
		position: relative;
		text-align: center;
		font-weight: ${({ theme }) => theme.fontWeight.bold};
		font-size: ${({ theme }) => theme.fontSize['3xl']};
		color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.black : darkTheme.textColor.white)};
		p {
			padding-top: 10px;
		}
		img {
			position: absolute;
			bottom: -10px;
			left: 95px;
			z-index: -1;
		}
	}
	.point-check-allBtn {
		display: flex;
		align-items: end;
		justify-content: space-between;
		width: 370px;
		padding-top: 50px;
		font-size: ${({ theme }) => theme.fontSize.sm};
		button {
			background-color: ${({ theme }) => theme.textColor.lightgray};
			padding: 5px 20px;
			border-radius: 10px;
		}
		p {
			color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.black : darkTheme.textColor.lightgray)};
		}
	}
`;

const InputExplain = styled(PointInput)`
	p {
		font-size: ${({ theme }) => theme.fontSize.sm};
		color: ${({ theme }) => theme.textColor.lightgray};
		display: flex;
		justify-content: end;
		margin: 10px 0;
	}
`;
export default CheckPointUsedIt;
