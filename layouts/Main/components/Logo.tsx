import { Link } from 'components/shared/Link'
import Image from 'next/image'
import logo from 'public/logo.png'
import Hamburger from 'hamburger-react'
import { useMobileMenuToggle } from 'providers/MobileMenuToggleProvider'

export default function ({ scrolling = false }) {
    const { visible, toggle } = useMobileMenuToggle()
    return (
        <div className="flex w-full items-center justify-between">
            <div className="md:w-full md:py-6">
                <Link
                    href="/"
                    className={`block transition-all px-6 ${scrolling ? 'py-4' : 'py-6'}`}
                    onClick={toggle}
                >
                    {/* <Image src={logo} height={21.56} width={130} /> */}
                    <Image src={logo} height={30.02} width={181} />
                    <h1 className="text-center font-inter text-[9.1px] uppercase leading-4 tracking-[3px]">
                        Owners Dapp
                    </h1>
                </Link>
            </div>
            <div className="mr-4 select-none md:hidden">
                <Hamburger
                    toggled={visible}
                    toggle={toggle}
                    size={25}
                    label="Show/Hide the menu"
                />
            </div>
        </div>
    )
}
