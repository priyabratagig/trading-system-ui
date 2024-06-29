import request, { IDEAS_TODAY, IDEA_DELETE, api_acknowledge } from "./configs.api"


export const get_ideas = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: IDEAS_TODAY
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const delete_idea = async (id) => {
    try {
        const reqConfig = {
            method: 'DELETE',
            url: `${IDEA_DELETE}/${id}`
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