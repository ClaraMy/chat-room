import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
    return (
      <main>
        <Component {...pageProps} />
      </main>
    );
  }