/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination);

  const prismic = getPrismicClient();
  async function loadMorePostsButton(): Promise<void> {
    const postsResponse = await prismic.query(
      [Prismic.Predicates.at('document.type', 'posts')],
      {
        fetch: ['posts.title', 'posts.content'],
        page: 2,
      }
    );

    const fetchedPosts = postsResponse.results;

    const formatedItens = {
      next_page: postsResponse.next_page,
      results: fetchedPosts,
    };
    setPosts(formatedItens);
  }

  return (
    <div>
      <Header />
      {posts.results.map(post => (
        <div key={post.uid}>
          <Link href={`/post/${post.uid}`}>
            <h1>{post.data.title}</h1>
          </Link>
          <p>{post.data.subtitle}</p>
          <p>
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </p>
          <p>{post.data.author}</p>
        </div>
      ))}

      {postsPagination.next_page === 'link' && (
        <>
          <button type="button" onClick={() => loadMorePostsButton()}>
            Carregar mais posts
          </button>
        </>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.content'],
    }
  );

  const posts = postsResponse.results;
  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return { props: { postsPagination } };
};
