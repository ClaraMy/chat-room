import "@/styles/globals.scss";
import { Gaegu, Poppins } from 'next/font/google'

const gaegu = Gaegu({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

// const poppins = Poppins({ 
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// }) 

export default function App({ Component, pageProps }) {
    return (
      <main className={gaegu.className}>
        <Component {...pageProps} />
      </main>
    );
  }