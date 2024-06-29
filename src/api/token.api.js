import request, { TOKEN_AUTH_CODE, TOKEN_REFRESH, TOKEN_SET_AUTH_CODE, TOKEN_STATUS, TOKEN_STOP, api_acknowledge } from "./configs.api"

export const get_token_status = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: TOKEN_STATUS
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const token_stop = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: TOKEN_STOP
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)

        return data
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}

export const token_auth_code = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: TOKEN_AUTH_CODE
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const token_set_auth_code = async (code) => {
    try {
        const reqConfig = {
            method: 'POST',
            url: TOKEN_SET_AUTH_CODE,
            data: {
                "auth_code": code
            }
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)

        return data
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}

export const token_refresh = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: TOKEN_REFRESH
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)

        return data
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}