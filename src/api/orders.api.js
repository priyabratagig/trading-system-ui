import request, { ORDERS_GET, ORDER_BUY, ORDER_CANCEL, ORDER_SELL, api_acknowledge } from "./configs.api"


export const place_buy_order = async ({ idea_id, entry, target, stop, type, qty }) => {
    try {
        if (!idea_id) throw new Error('Idea ID is required')
        if (!entry) throw new Error('Entry price is required')
        if (!target) throw new Error('Target price is required')
        if (!stop) throw new Error('Stop price is required')
        if (!type || ![1, 2, 3, 4].includes(parseInt(type, 10))) throw new Error('Correct order type is required')
        if (!qty) throw new Error('Quantity is required')

        const reqConfig = {
            method: 'POST',
            url: ORDER_BUY,
            data: {
                idea_id,
                entry,
                target,
                stop,
                type,
                qty
            }
        }
        const response = await request(reqConfig)
        api_acknowledge('Order placed successfully')

        return response
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}

export const get_orders = async () => {
    try {
        const reqConfig = {
            method: 'GET',
            url: ORDERS_GET
        }
        return await request(reqConfig)
    }
    catch ({ message }) {
        console.error(message)

        return { error: message }
    }
}

export const cancel_order = async ({ order_id, symbol }) => {
    try {
        if (!order_id) throw new Error('Order ID is required')
        if (!symbol) throw new Error('Symbol is required')

        const reqConfig = {
            method: 'POST',
            url: ORDER_CANCEL,
            data: {
                order_id,
                symbol
            }
        }
        const response = await request(reqConfig)
        api_acknowledge('Order cancelled successfully')

        return response
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}

export const sell_order = async ({ symbol, buy_order_id, exit, type }) => {
    try {
        if (!symbol) throw new Error('Symbol is required')
        if (!buy_order_id) throw new Error('Buy Order ID is required')
        if (!exit) throw new Error('Exit price is required')
        if (!type || ![1, 2, 3, 4].includes(parseInt(type, 10))) throw new Error('Correct order type is required')

        const reqConfig = {
            method: 'POST',
            url: ORDER_SELL,
            data: {
                symbol,
                buy_order_id,
                exit,
                type
            }
        }
        const response = await request(reqConfig)
        api_acknowledge('Order placed successfully')

        return response
    }
    catch ({ message }) {
        console.error(message)
        api_acknowledge(message)

        return { error: message }
    }
}