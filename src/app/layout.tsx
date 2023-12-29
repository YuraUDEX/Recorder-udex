import type { Metadata } from 'next'
import Head from 'next/head'
import '../styles/global.sass'
import { Header } from '@/Components/Header/page'
import { Footer } from '@/Components/Footer/page'

export const metadata: Metadata = {
  title: 'Recorder-UDEX',
  description: 'Generated by create next app',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <div className="wrapper">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}

export default RootLayout
