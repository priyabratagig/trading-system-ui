import request, { AUTO_TRADE_OFF, AUTO_TRADE_ON, AUTO_TRADE_STATUS, api_acknowledge } from "./configs.api"


export const get_auto_trade_status = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: AUTO_TRADE_STATUS
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const auto_trade_on = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: AUTO_TRADE_ON
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

export const auto_trade_off = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: AUTO_TRADE_OFF
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