import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import MainLayout from 'layouts/Main'
import Providers from 'providers'

const MyApp = ({ Component, pageProps }: AppProps) => (
    <>
        <Head>
            <title>DeadHeads - Owners Dapp</title>
        </Head>
        <Providers>
            <MainLayout>
                <Component {...pageProps} />
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </MainLayout>
        </Providers>
    </>
)

export default MyApp
