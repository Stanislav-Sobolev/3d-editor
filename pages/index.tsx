import React from 'react'
import Head from 'next/head'
import { Provider } from 'react-redux';
import { store } from '../store/store';
import App from '../components/App';

const Home: React.FC = () => (
  <>
    <Head>
      <title>3d-editor</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Provider store={store}>
      <App />
    </Provider>
  </>
);

export default Home
