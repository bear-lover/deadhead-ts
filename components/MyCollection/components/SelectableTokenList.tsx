import AssetImage from 'components/shared/AssetImage'
import { Token } from 'config/types'
import { ReactNode, useMemo } from 'react'

export function defaultRenderItem(token: Token, selected: boolean, selectable=true) {
    return (
        <>
            <div
                className={`relative aspect-square w-[135px] overflow-hidden rounded-xl border-4 transition ${
                    selected
                        ? 'border-tinted-white'
                        : selectable ? 'border-transparent hover:border-tinted-white/50' :'border-transparent'
                }`}
            >
                <AssetImage {...token} />
            </div>
            <div className="mt-2 text-center font-vimland uppercase">
                {token.name}
            </div>
        </>
    )
}

interface SelectableTokenListProps {
    tokens: Token[]
    selectedTokens?: Token[]
    selectToken?: (token: Token) => void
    renderItem?: (token: Token, selected: boolean) => ReactNode
}
export default function SelectableTokenList({
    tokens,
    selectedTokens,
    selectToken,
    renderItem,
}: SelectableTokenListProps) {
    const selectedTokenIds: string[] = useMemo(
        () => (selectedTokens && selectedTokens.map(({ id }) => id)) || [],
        [selectedTokens]
    )

    return (
        <>
            {tokens.map((token) => {
                const selected = selectedTokenIds.includes(token.id)

                return (
                    <div
                        key={`selectable-token-${token.name}`}
                        className="h-fit cursor-pointer"
                        onClick={() => selectToken && selectToken(token)}
                    >
                        {renderItem
                            ? renderItem(token, selected)
                            : defaultRenderItem(token, selected)}
                    </div>
                )
            })}
        </>
    )
}
