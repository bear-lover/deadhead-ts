import { useMobileMenuToggle } from 'providers/MobileMenuToggleProvider'
import Footer from './components/Footer'
import Header from './components/Header'
import Navigation from './components/Navigation'

const Main = ({ children }) => {
    const { visible } = useMobileMenuToggle()

    return (
        <div className="flex min-h-screen w-full flex-row">
            <div
                className={`fixed bottom-0 top-0 z-50 w-full shrink-0 transition duration-300 md:static md:w-60 ${
                    visible
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-full opacity-0'
                } md:translate-x-0 md:opacity-100`}
            >
                <Navigation />
            </div>
            <div className="flex grow flex-col">
                <Header />
                <main className="grow px-6 md:px-8">{children}</main>
                <Footer />
            </div>
        </div>
    )
}

export default Main
