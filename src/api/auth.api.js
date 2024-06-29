import request, { LOGIN, LOGOUT, api_acknowledge } from "./configs.api"


export const login = async ({ username, password }) => {
    try {
        if (typeof username != 'string' || username.length < 1) throw new Error('Username required')
        if (typeof password != 'string' || password.length < 1) throw new Error('Password required')

        const reqConfig = {
            method: 'POST',
            url: LOGIN,
            data: {
                username,
                password
            }
        }
        const data = await request(reqConfig)
        window.location.href = '/'

        return { success: data.message }
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const logout = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: LOGOUT
        }
        const data = await request(reqConfig)
        api_acknowledge(data.message)
        window.location.href = '/login'

        return { success: data.message }
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}