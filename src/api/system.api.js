import request, { SYSTEM_START, SYSTEM_STATUS, SYSTEM_STOP, api_acknowledge } from "./configs.api"

export const get_system_status = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: SYSTEM_STATUS
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const system_start = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: SYSTEM_START
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)

        return { success: data.message }
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}

export const system_stop = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: SYSTEM_STOP
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)

        return { success: data.message }
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}