import request, { LOG_FILES, LOG_FILE_DOWNLOAD, api_acknowledge } from "./configs.api"


export const get_log_files = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: LOG_FILES
        }
        const data = await request(reqConfig)

        return data
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const log_file_download = async (filename) => {
    try {
        const reqConfig = {
            method: 'GET',
            url: `${LOG_FILE_DOWNLOAD}/${filename}`,
            responseType: 'blob'
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