import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Footer from 'components/Common/Footer';
import Header from 'components/Common/Header';
import NoticeDetail from 'components/Notices/NoticeDetail';
import { iNoticePromise } from 'types/notices';
import { ParsedUrlQuery } from 'querystring';

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3000/api/notices?page=1`);
  const notices = await response.json();

  const paths = notices.data.map((notice: iNoticePromise) => ({ params: { noticeId: notice._id.toString() } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:3000/api/notices/${(params as ParsedUrlQuery).noticeId}`);
  const notice = await res.json();

  return {
    props: {
      notice: notice.data,
    },
  };
};

const Notice = ({ notice }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>doWork에서 알려드립니다.</title>
      </Head>
      <Header />
      <NoticeDetail notice={notice} />
      <Footer />
    </>
  );
};

export default Notice;