import { API_ENDPOINT } from 'config/constants'
import axios from 'axios'

export function createAxiosInstance(accessToken?: string | null) {
    const instance = axios.create({ baseURL: API_ENDPOINT })
    if (accessToken) {
        instance.defaults.headers.common[
            'Authorization'
        ] = `Bearer ${accessToken}`
    }
    return instance
}

const defaultInstance = createAxiosInstance()
export default defaultInstance
