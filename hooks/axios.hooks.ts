// import { useAuth0Token } from 'providers/Auth0TokenProvider'
import { createAxiosInstance } from 'utils/axios.util'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { AxiosError, AxiosRequestConfig } from 'axios'

interface UseAxiosConfig {
    immediate?: boolean
    needAuthenticated?: boolean
}
type UseAxiosResult = [
    { response: any; loading: boolean; error: any },
    Function
]
type UseAxios = (
    options: AxiosRequestConfig,
    config?: UseAxiosConfig
) => UseAxiosResult

export const useAxios: UseAxios = (
    options: AxiosRequestConfig,
    config?: UseAxiosConfig
) => {
    const { immediate = false, needAuthenticated = false } = config || {}

    const token = null // needAuthenticated ? useAuth0Token() : null
    const axios = useMemo(() => createAxiosInstance(token), [token])

    const [response, setResponse] = useState<any>()
    const [error, setError] = useState<any>()
    const [loading, setLoading] = useState<boolean>(immediate)

    const refetch = useCallback(
        async (params?) => {
            let _response: any = null
            let _error: any = null
            try {
                setLoading(true)
                const result = await axios.request({ ...options, ...params })
                _response = result.data
                setResponse(_response)
            } catch (error) {
                _error =
                    error instanceof AxiosError
                        ? error?.response?.data?.message ?? error.message
                        : error
                setError(_error)
            } finally {
                setLoading(false)
            }

            return { response: _response, error: _error }
        },
        [axios, options]
    )

    useEffect(() => {
        immediate && (!needAuthenticated || token) && refetch()
    }, [token])

    return [{ response, error, loading }, refetch]
}

export const useAthenticatedAxios: UseAxios = (
    options: AxiosRequestConfig,
    config?: UseAxiosConfig
) => useAxios(options, { ...config, needAuthenticated: true })
