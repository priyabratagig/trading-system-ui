import request, { FUND_GET } from "./configs.api"


export const get_funds = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: FUND_GET
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}