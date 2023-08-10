import React, { useCallback, useState } from 'react';
import { ModalDefaultType } from '../../types/ModalOpenTypes';
import { styled } from 'styled-components';
import CheckPointUsedIt from './CheckPointUsedIt';
import { darkTheme, defaultTheme } from '../../style/theme';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

function UsePointUser({ onClickToggleModal }: ModalDefaultType) {
	const [isOpenModal, setModalOpen] = useState<boolean>(false);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [userPoints, setUserPoints] = useState<number | null>(null);

	const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(e.target.value);
	};

	const handleCloseBtnClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClickToggleModal();
	};

	const onClickOpenModal = useCallback(async () => {
		const pointsCollection = collection(db, 'point');
		const q = query(pointsCollection, where('phoneNumber', '==', phoneNumber));

		const matchingDocs = await getDocs(q);
		if (!matchingDocs.empty) {
			const existingDoc = matchingDocs.docs[0];
			const points = existingDoc.data().point || 0;
			setUserPoints(points);
			setModalOpen(true);
		} else {
			alert('회원만 포인트 사용이 가능합니다!');
			setModalOpen(false);
			onClickToggleModal();
		}
	}, [phoneNumber]);

	const handleUsePoints = async (usedPoints: number) => {
		if (userPoints !== null && userPoints >= usedPoints) {
			const remainingPoints = userPoints - usedPoints;
			setUserPoints(remainingPoints);

			const pointsCollection = collection(db, 'point');
			const q = query(pointsCollection, where('phoneNumber', '==', phoneNumber));
			const matchingDocs = await getDocs(q);
			if (!matchingDocs.empty) {
				const existingDoc = matchingDocs.docs[0];
				const docRef = doc(db, 'point', existingDoc.id);
				await updateDoc(docRef, { point: remainingPoints });
			}
		} else {
			alert('포인트가 부족합니다.');
		}
	};
	return (
		<ModalContainer onClick={onClickToggleModal}>
			<DialogBox onClick={(e) => e.stopPropagation()}>
				<p>핸드폰 번호를 입력해주세요 </p>
				<PointInput>
					<label htmlFor="phone-number" hidden />
					<input
						type="number"
						id="phone-number"
						name="phonnumber"
						value={phoneNumber}
						placeholder="숫자만 입력해주세요"
						onChange={handlePhoneNumberChange}
					></input>
					<button>
						<img src="/assets/user/BackBtn_light.svg" alt="지우기" width={45} />
					</button>
				</PointInput>
				<BtnContainer>
					<CloseBtn onClick={handleCloseBtnClick}>취소</CloseBtn>
					<CloseBtn onClick={onClickOpenModal}>확인</CloseBtn>
				</BtnContainer>
			</DialogBox>
			{isOpenModal && (
				<CheckPointUsedIt
					onClickOpenModal={onClickToggleModal}
					isOpenModal={isOpenModal}
					points={userPoints}
					onUsePoints={handleUsePoints}
				/>
			)}
			<Backdrop
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					if (onClickToggleModal) {
						onClickToggleModal();
					}
				}}
			/>
		</ModalContainer>
	);
}
export const ModalContainer = styled.div`
	width: 100%;
	height: 100%;
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
	box-shadow: 0 0 30px rgba(30, 30, 30, 0.185);
	box-sizing: border-box;
	z-index: 10000;
	p {
		font-size: ${({ theme }) => theme.fontSize.xl};
		font-weight: ${({ theme }) => theme.fontWeight.semibold};
		color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.black : darkTheme.textColor.white)};
	}
`;

const PointInput = styled.div`
	font-size: ${({ theme }) => theme.fontSize.base};
	margin-top: 50px;
	input {
		background-color: ${({ theme }) =>
			theme === defaultTheme ? theme.textColor.lightgray : darkTheme.textColor.white};
		border: 1px solid ${({ theme }) => (theme === defaultTheme ? theme.textColor.lightbrown : 'none')};
		position: relative;
		width: 390px;
		padding: 20px;
		border-radius: 10px;
	}
	button {
		position: absolute;
		margin-top: 6px;
		padding: 7px;
		right: 60px;
		background-color: ${({ theme }) =>
			theme === defaultTheme ? theme.textColor.lightgray : darkTheme.textColor.white};
		border-radius: 10px;
	}
	input:focus {
		outline: none;
	}
	/* input type number일때 증가 감소 버튼 없앰 */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;
const CloseBtn = styled.button`
	margin-top: 50px;
	margin-left: 20px;
	border-radius: 10px;
	background-color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.lightgray : darkTheme.darkColor?.sub)};
	width: 110px;
	height: 35px;
	font-size: ${({ theme }) => theme.fontSize.xl};
	color: ${({ theme }) => (theme === defaultTheme ? theme.textColor.black : darkTheme.textColor.white)};
`;
const BtnContainer = styled.div`
	display: flex;
	width: 390px;
	justify-content: flex-end;
	font-size: ${({ theme }) => theme.fontSize['2xl']};
`;
const Backdrop = styled.div`
	width: 1194px;
	height: 834px;
	position: fixed;
	top: 0;
	left: 50%;
	transform: translate(-50%, 0);
	z-index: 9999;
	background-color: rgba(0, 0, 0, 0.2);
`;
export default UsePointUser;
