import React from 'react';
import { styled } from 'styled-components';

type WaitingListData = {
	id?: string;
	no: number;
	name: string;
	tel: string;
	status: string;
	date: number;
	personNum: number;
};

type WaitingItemProps = {
	waitingList: WaitingListData[];
};

const WaitingItem = (props: WaitingItemProps) => {
	const { waitingList } = props;
	const waitingInfo = waitingList.filter((value) => value.status === 'waiting');

	const formatTel = (tel: string) => {
		const cleanNumber = tel.replace(/\D/g, '');
		const firstPart = cleanNumber.slice(0, 3);
		const secondPart = cleanNumber.slice(3, 7);
		const thirdPart = cleanNumber.slice(7);
		return `${firstPart}-${secondPart}-${thirdPart}`;
	};

	const showWaitingList = () => {
		return waitingInfo
			.sort((a, b) => a.no - b.no)
			.map((value) => (
				<WaitingItemWrapper key={value.id}>
					<td width={'130px'}>{value.no}번</td>
					<td width={'110px'}>{value.name}</td>
					<td width={'120px'}>{value.personNum}명</td>
					<td width={'250px'}>{formatTel(value.tel)}</td>
					<WatingBtnWrapper width={'300px'}>
						<ShortBtn>알림</ShortBtn>
						<ShortBtn>취소</ShortBtn>
						<LongBtn>착석 완료</LongBtn>
					</WatingBtnWrapper>
				</WaitingItemWrapper>
			));
	};

	return <>{showWaitingList()}</>;
};

export default WaitingItem;

const WaitingItemWrapper = styled.tr`
	background-color: ${({ theme }) => (theme.lightColor ? theme.textColor.white : theme.darkColor?.background)};
	color: ${({ theme }) => (theme.lightColor ? theme.textColor.black : theme.textColor.white)};
	border: ${({ theme }) => (theme.lightColor ? 'none' : `1px solid ${theme.textColor.white}`)};
	width: 982px;
	height: 72px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	padding-left: 40px;
	padding-right: 30px;
	margin: 0 auto;
	margin-bottom: 12px;
	font-size: ${({ theme }) => theme.fontSize['2xl']};

	td {
		display: flex;
		justify-content: center;
	}
`;

const WatingBtnWrapper = styled.td`
	width: 300px;
	height: 48px;
	color: ${({ theme }) => theme.textColor.white};
	display: flex;
	justify-content: center;
`;

const ShortBtn = styled.button`
	width: 65px;
	height: 48px;
	margin-right: 14px;
	border-radius: 10px;
	background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor?.yellow.sub : theme.darkColor?.main)};
`;

const LongBtn = styled.button`
	width: 113px;
	height: 48px;
	border-radius: 10px;
	background-color: ${({ theme }) => (theme.lightColor ? theme.lightColor?.yellow.sub : theme.darkColor?.main)};
`;
