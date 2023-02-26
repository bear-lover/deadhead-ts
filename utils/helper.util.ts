import { PINATA_GATEWAY } from 'config/constants'

export function randomStr(
    len = 20,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
) {
    const arr = charset.split('')
    let result = ''

    for (let i = len; i > 0; i--) {
        result += arr[Math.floor(Math.random() * arr.length)]
    }

    return result
}

export function isAbsoluteURI(url: string) {
    return new RegExp('^(?:[a-z+]+:)?//', 'i').test(url)
}

export function usePrivateIPFSGateway(url: string) {
    return (
        url
            // .replace('ipfs://', `https://ipfs.io/ipfs/`)
            .replace('ipfs://', `https://${PINATA_GATEWAY}/ipfs/`)
            .replace('ipfs.io', PINATA_GATEWAY)
    )
}

export function isUserRejectedError(
    e: any | { code: number; message: string }
) {
    return e.code === 4001
}

export function parseTransactionError(ex: any) {
    if (ex) {
        let msg = ex.message
        if (!msg) return ex as string

        const matches = msg.match(/"message": "(.+)"/i)
        if (matches?.length) return matches[1]
        return msg
    }

    return ''
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
