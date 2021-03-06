import 'bootstrap/dist/css/bootstrap.min.css';
import "tailwindcss/tailwind.css";
import "@material-tailwind/react/tailwind.css";
import "../styles.css";
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
  
  <SessionProvider session={pageProps.session}>  
  <Head>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  </Head>
  <Component {...pageProps} />
  </SessionProvider>

  );
}

export default MyApp;
