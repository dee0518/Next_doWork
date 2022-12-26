import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState, ChangeEvent } from 'react';
import { useReduxSelector, useReduxDispatch } from 'hooks/useRedux';
import Button from 'components/Common/Button';
import GlobalNavBar from 'components/Common/GlobalNavBar';
import InputForm from 'components/Common/InputForm';
import ServiceMain from 'components/Common/ServiceMain';
import Confirm from 'components/Mypage/Confirm';
import MembershipCard from 'components/Mypage/MembershipCard';
import MypagePannel from 'components/Mypage/MypagePannel';
import styled from 'styled-components';
import { flexbox } from 'styles/mixin';
import defaultProfile from 'images/mypage/profile.svg';
import { MYPAGE } from 'constants/navigation';
import { iUserInfo } from 'types/auth';
import { authActions } from 'redux/auth';

const EditAccount: NextPage = () => {
  const router = useRouter();
  const dispatch = useReduxDispatch();
  const { user } = useReduxSelector(state => state.auth);
  const { id, email, name, profile, career, introduce } = user as iUserInfo;
  const [userInfo, setUserInfo] = useState({
    name,
    profile,
    career,
    introduce,
  });
  const [file, setFile] = useState<Blob | null>(null);
  const [pwError, setPwError] = useState<boolean>(false);
  const [isShowCard, setIsShowCard] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const onChangePw = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setPassword(value);
  };

  const onCancel = () => router.push(MYPAGE);

  const onSubmit = async () => {
    const { name, career, introduce } = userInfo;
    // 유효성 검사 추가하기
    const response = await fetch(`/api/auth/user/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, career, introduce }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    if (json && json.result) {
      dispatch(authActions.setUser({ ...(user as iUserInfo), name, career, introduce }));
      router.push(MYPAGE);
    }
  };

  const onConfirmUser = async () => {
    if (isShowCard) {
      onSubmit();
    } else {
      const res = await signIn('credentials', { email, password, redirect: false });

      if (res && res.ok) setIsShowCard(true);
      else setPwError(true);
    }
  };

  const encodeFileToBase64 = (fileBlob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      setUserInfo(prev => ({ ...prev, profile: reader.result as ArrayBuffer }));
    };
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    if (name === 'profile') {
      const files = (e.target as HTMLInputElement).files as FileList;
      setFile(files[0]);
      encodeFileToBase64(files[0]);
      return;
    }
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Head>
        <title>마이페이지 - 정보 수정 : doWork</title>
      </Head>
      <GlobalNavBar />
      <MypagePannel />
      <Wrapper>
        <Confirm
          title="Edit Account"
          subTitle="나는 어떤 사람인가요?"
          guide={['같이 일하는 사람들에게 나를 소개해주세요.', '새로운 정보를 업데이트해주세요.']}
          error={pwError}
          pwValue={password}
          onChange={onChangePw}
          isEdit={isShowCard}
        />
        {isShowCard && (
          <MembershipCard>
            <InfoGroup>
              <Greeting>
                <span>안녕하세요</span>
                <span>저는 {name}입니다.</span>
              </Greeting>
              <InputForm
                input={{
                  id: 'name',
                  type: 'text',
                  name: 'name',
                  value: userInfo.name,
                  onChange,
                  placeholder: '이름을 입력해주세요.',
                }}
                label={{ htmlFor: 'name', children: 'name' }}
              />
              <InputForm
                input={{
                  id: 'career',
                  type: 'text',
                  name: 'career',
                  value: userInfo.career,
                  onChange,
                  placeholder: '직업을 입력해주세요.',
                }}
                label={{ htmlFor: 'career', children: 'career' }}
              />
              <div>
                <label htmlFor="introduce">introduce</label>
                <textarea
                  id="introduce"
                  name="introduce"
                  placeholder="나를 소개해주세요:)"
                  value={userInfo.introduce}
                  onChange={onChange}
                />
              </div>
            </InfoGroup>
            <FileGroup>
              <InputForm
                input={{ id: 'profile', name: 'profile', type: 'file', onChange }}
                label={{ htmlFor: 'profile', labelClass: 'blind', children: 'profile' }}
              />
              <Profile
                src={userInfo.profile !== '' ? userInfo.profile : defaultProfile}
                width={250}
                height={250}
                alt="profile"
              />
              <Email>
                <span>email</span>
                <span>{email}</span>
              </Email>
            </FileGroup>
          </MembershipCard>
        )}
        <ButtonGroup>
          <Button type="button" category="cancel" onClick={onCancel}>
            취소
          </Button>
          <Button type="button" category="primary" onClick={onConfirmUser}>
            확인
          </Button>
        </ButtonGroup>
      </Wrapper>
    </>
  );
};

export default EditAccount;

const Wrapper = styled(ServiceMain)`
  padding-top: 50px;

  .membership__card {
    margin-top: 20px;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 20px;
  ${flexbox('row', 'nowrap', 'flex-end', 'center')}
  gap:10px;

  button {
    width: 180px;
  }
`;

const InfoGroup = styled.div`
  width: 60%;

  .input__form {
    margin-bottom: 25px;
  }

  label {
    display: block;
    font-size: 1.3rem;
    margin-bottom: 8px;
    text-transform: capitalize;
  }

  input {
    width: 100%;
  }

  textarea {
    width: 100%;
    padding: 13px;
    border: 0;
    border-radius: 6px;
    font-size: 1.3rem;
    line-height: 1.3;
    background: ${({ theme }) => theme.color_gray_10};
    resize: none;
  }
`;

const Greeting = styled.p`
  margin-bottom: 50px;
  font-size: 2rem;
  line-height: 1.3;
  font-weight: bold;

  span {
    display: block;
  }
`;

const FileGroup = styled.div`
  ${flexbox('column', 'nowrap', 'flex-end', 'flex-start')}
  position: relative;
  padding: 30px;

  input {
    display: none;
  }

  label {
    position: absolute;
    left: 50%;
    top: 230px;
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color_purple_50} url(/images/mypage/camera.svg) no-repeat;
    background-position: center;
    text-indent: -9999px;
    transform: translate3d(60px, 0, 0);
    overflow: hidden;
  }
`;

const Profile = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const Email = styled.p`
  margin-top: 24px;
  font-size: 1.5rem;
  line-height: 1.3;

  span {
    display: block;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.color_gray_70};

    &:first-child {
      margin-bottom: 8px;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.color_gray_100};
      text-transform: capitalize;
    }
  }
`;
