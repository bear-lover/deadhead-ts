import { TokenType } from 'config/types'
import React, { ReactNode, useCallback, useContext, useState } from 'react'
import { sleep } from 'utils/helper.util'
import TypeSelectDialog from './TypeSelectDialog'

interface TypeSelectContext {
    dialogOpen: boolean
    setDialogOpen: (open: boolean) => void
    tokenType?: TokenType
    setTokenType: (type: TokenType) => void

    setConsumer: (consumer: Function) => void
    openWithConsumer: (consumer: any) => void
    dispatch: (type: TokenType) => void
}

const TypeSelectContext: React.Context<TypeSelectContext> =
    React.createContext<TypeSelectContext>({
        dialogOpen: false,
        setDialogOpen: (open: boolean) => {},
        tokenType: undefined,
        setTokenType: (type: TokenType) => {},

        setConsumer: () => {},
        openWithConsumer: () => {},
        dispatch: () => {},
    })

interface TypeSelectProvider {
    children: ReactNode
}

export function TypeSelectProvider({ children }: TypeSelectProvider) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [tokenType, setTokenType] = useState<TokenType>()

    const [consumer, setConsumer] = useState<any>()

    const openWithConsumer = useCallback((consumer) => {
        setDialogOpen(true)
        setConsumer(consumer)
    }, [])

    const dispatch = useCallback(
        async (type: TokenType) => {
            setTokenType(type)
            setDialogOpen(false)

            await sleep(400)

            consumer.setTokenType(type)
            consumer.setTokens([])
            consumer.setDialogOpen(true)
        },
        [tokenType, consumer]
    )

    return (
        <TypeSelectContext.Provider
            value={{
                dialogOpen,
                setDialogOpen,
                tokenType,
                setTokenType,

                setConsumer,
                openWithConsumer,
                dispatch,
            }}
        >
            {children}
            <TypeSelectDialog />
        </TypeSelectContext.Provider>
    )
}

export const useTypeSelect = (): TypeSelectContext => {
    const context = useContext<TypeSelectContext>(TypeSelectContext)
    return context
}
