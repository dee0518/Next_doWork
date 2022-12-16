import ContentInner from 'components/Common/ContentInner';
import Title from 'components/Common/Title';
import styled from 'styled-components';
import { mediaQuery1024 } from 'styles/mediaQuery';
import { flexbox } from 'styles/mixin';
import { TProcessItem } from 'types/home';

const processList: TProcessItem[] = [
  {
    id: 'start',
    imgUrl: '',
    content: 'doWork와 함께가는 여정 시작!',
    complete: true,
  },
  {
    id: 'step1',
    imgUrl: '',
    content: '회원가입과 로그인이 가능하고 일정을 관리할 수 있어요',
    complete: false,
  },
  {
    id: 'step2',
    imgUrl: '',
    content: 'Trello를 이용하여 해야할 일과 끝낸 일 등으로 프로젝트를 관리할 수 있어요 ',
    complete: false,
  },
  {
    id: 'step3',
    imgUrl: '',
    content: '디자인 툴을 사용하여 유연하게 프로젝트를 관리해봐요',
    complete: false,
  },
  {
    id: 'final',
    imgUrl: '',
    content: 'Docs를 통해 doWork 서비스를 알아가봐요>ㅁ<',
    complete: false,
  },
];

const ProcessSection = () => {
  const calcStep = processList.findIndex(process => !process.complete) - 1;

  return (
    <Container>
      <ContentInner>
        <Title>Process</Title>
        <ContentWrap>
          <LineWrap>
            <Line aria-hidden="true" index={4} />
            <Line aria-hidden="true" index={calcStep} />
          </LineWrap>
          <ProcessList>
            {processList.map(({ id, imgUrl, content, complete }, i) => (
              <ProcessItem key={id} className={complete ? 'on' : ''}>
                <ItemImageWrap />
                <ItemDescWrap>
                  <H3>{id.indexOf('step') === -1 ? id : `step ${i}`}</H3>
                  <Description>{content}</Description>
                </ItemDescWrap>
              </ProcessItem>
            ))}
          </ProcessList>
        </ContentWrap>
      </ContentInner>
    </Container>
  );
};

export default ProcessSection;

const Container = styled.section`
  padding: 80px 0 100px;
  ${({ theme }) => `background: rgba(${theme.color_purple_0}, .15)`};
`;

const ContentWrap = styled.div`
  position: relative;
  margin-top: 50px;

  ${mediaQuery1024} {
    margin-top: 80px;
  }
`;

const LineWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 150px;

  ${mediaQuery1024} {
    width: calc(100% - 300px);
    left: 150px;
    top: 75px;
  }
`;

const Line = styled.span<{ index: number }>`
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 5px;
  ${({ index }) => `height: calc(173px * ${index})`};
  background: ${({ theme }) => theme.color_gray_40};
  transform: translate3d(-50%, 0, 0);

  &:last-child {
    background: ${({ theme }) => theme.color_purple_50};
    transition: height 0.5s ease;
  }

  ${mediaQuery1024} {
    ${({ index }) => `width: calc(25% * ${index})`};
    height: 5px;
    transform: translate3d(0, -50%, 0);

    &:last-child {
      transition: width 0.5s ease;
    }
  }
`;

const ProcessList = styled.ul`
  position: relative;
  z-index: 1;

  ${mediaQuery1024} {
    ${flexbox('row', 'nowrap', 'space-between', 'center')}
  }
`;

const ProcessItem = styled.li`
  position: relative;
  margin-bottom: 60px;

  &:nth-child(2n) > div:last-child {
    left: auto;
    right: 0;
  }

  &.on {
    & > div:first-child {
      border-color: ${({ theme }) => theme.color_purple_50};
    }

    & > div:last-child {
      ${({ theme }) => `background: rgba(${theme.color_purple_0}, .7)`};
    }

    h3 {
      color: ${({ theme }) => theme.point_orange};
    }

    p {
      color: ${({ theme }) => theme.color_gray_100};
    }
  }

  ${mediaQuery1024} {
    margin-bottom: 0;

    &:last-child > div:first-child {
      margin-left: 25px;
    }
  }
`;

const ItemImageWrap = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.color_gray_40};
  background: ${({ theme }) => theme.white};

  ${mediaQuery1024} {
    margin: 0;
  }
`;

const ItemDescWrap = styled.div`
  position: absolute;
  left: 0;
  top: 30px;
  width: 30%;
  padding: 15px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color_gray_10};

  ${mediaQuery1024} {
    width: 175px;
    margin-top: 30px;
    position: static;
  }
`;

const H3 = styled.h3`
  margin-bottom: 5px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.color_gray_70};
  text-transform: capitalize;

  ${mediaQuery1024} {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.color_gray_50};

  ${mediaQuery1024} {
    font-size: 1.6rem;
    line-height: 1.5;
  }
`;
