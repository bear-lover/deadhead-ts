import { XIcon } from '@heroicons/react/outline'
import { RefreshIcon, PlusIcon } from '@heroicons/react/outline'
import { SHOWBIZ_TOKEN_ADDRESS } from 'config/constants'
import { useShowBiz } from 'providers/token/ShowBizProvider'
import { useWeb3Connection } from 'providers/Web3ConnectionProvider'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { isUserRejectedError, parseTransactionError } from 'utils/helper.util'
export default function () {
    const { connected, account, domain, connect, disconnect } =
        useWeb3Connection()
    const { balance, loading, refresh } = useShowBiz()

    const handleAddToMetamask = useCallback(async () => {
        const tokenAddress = SHOWBIZ_TOKEN_ADDRESS
        const tokenSymbol = 'SHOW'
        const tokenDecimals = 18
        // const tokenImage = 'http://placekitten.com/200/300';

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        // image: tokenImage, // A string url of the token logo
                    },
                },
            })

            if (wasAdded) {
                toast.success(`The token has been added into your wallet.`)
            } else {
                toast.error('Failed to add the token into your wallet.')
            }
        } catch (error) {
            if (!isUserRejectedError(error)) {
                console.log(error)
                toast.error(
                    parseTransactionError(error) ||
                        'An error occurred while adding the token into your wallet.'
                )
            }
        }
    }, [])

    return (
        <div className="flex w-full flex-wrap gap-4 md:w-auto">
            {!connected ? (
                <button
                    className="h-12 w-full rounded-xl border border-tinted-white bg-dark-gray px-4 text-sm text-tinted-white hover:bg-tinted-white hover:text-dark-gray md:w-auto md:min-w-[270px]"
                    onClick={connect}
                >
                    Connect your wallet
                </button>
            ) : (
                <>
                    <button
                        className="h-12 w-full justify-between gap-4 rounded-xl border border-valid bg-dark-gray px-4 text-sm text-tinted-white hover:border-tinted-white hover:bg-tinted-white hover:text-dark-gray md:w-auto lg:min-w-[270px]"
                        title={account!}
                        onClick={disconnect}
                    >
                        <div className="flex shrink items-center overflow-hidden">
                            <span className="mr-2 h-2 w-2 shrink-0 rounded-full bg-valid" />
                            <span className="overflow-hidden text-ellipsis">
                                {domain ||
                                    account?.substring(0, 20).toLowerCase()}
                            </span>
                        </div>
                        <XIcon className="h-4 w-4 shrink-0" />
                    </button>
                    <div
                        className="flex h-12 w-full justify-between rounded-xl border border-tinted-white/80 bg-tinted-white pl-4 text-sm text-dark-gray hover:border-tinted-white disabled:border-tinted-white/80 md:w-auto md:bg-dark-gray md:text-tinted-white lg:min-w-[215px]"
                        title={`$SHOW ${balance.toString()}, Click to Refresh`}
                    >
                        <button disabled={loading} onClick={refresh}>
                            <div className="flex shrink items-baseline overflow-hidden">
                                <span className="mr-4 flex items-center font-vimland text-xl">
                                    $SHOW
                                </span>
                                <div className="min-w-[128px]">
                                    <div
                                        className={`overflow-hidden text-ellipsis text-left text-base font-semibold ${
                                            loading && 'text-gray-1'
                                        }`}
                                    >
                                        <p>
                                            {balance.integerValue().toFormat()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <RefreshIcon
                                className={`ml-auto h-5  w-5 shrink-0 text-gray-1 ${
                                    loading && 'animate-reverse-spin'
                                }`}
                            />
                        </button>
                        <button
                            className="flex items-center"
                            disabled={!window.ethereum}
                        >
                            <PlusIcon
                                className="z-10 box-content h-5 w-5 shrink-0 p-3 text-gray-1 ease-in-out hover:text-white"
                                onClick={handleAddToMetamask}
                            />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
