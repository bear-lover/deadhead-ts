import React, { ReactNode, useCallback, useContext, useState } from 'react'

interface MobileMenuToggleContext {
    visible: boolean
    toggle: () => void
}

const MobileMenuToggleContext: React.Context<MobileMenuToggleContext> =
    React.createContext<MobileMenuToggleContext>({
        visible: false,
        toggle: () => {},
    })

interface MobileMenuToggleProvider {
    children: ReactNode
}

export function MobileMenuToggleProvider({
    children,
}: MobileMenuToggleProvider) {
    const [visible, setVisible] = useState<boolean>(false)

    const toggle = useCallback(() => setVisible((visible) => !visible), [])

    return (
        <MobileMenuToggleContext.Provider
            value={{
                visible,
                toggle,
            }}
        >
            {children}
        </MobileMenuToggleContext.Provider>
    )
}

export const useMobileMenuToggle = (): MobileMenuToggleContext => {
    const context = useContext<MobileMenuToggleContext>(MobileMenuToggleContext)
    return context
}
