import { useCallback, useEffect, useRef, useState } from "react"
import { CancelModal, SellModal } from "./Modals.component"
import { get_orders } from "../api"

export const Orders = () => {
    const [orders, setOrders] = useState([])

    const fetchOrders = useCallback(async () => {
        const orders = await get_orders()
        if (orders.error) return console.error(orders.error)
        setOrders(orders)
    }, [])

    useEffect(() => {
        const timeout = setTimeout(fetchOrders, 500)

        return () => clearTimeout(timeout)
    }, [fetchOrders])

    const sell_modal = useRef(null)
    const cancel_modal = useRef(null)

    return (
        <div className="shadow rounded flex flex-col gap-y-4 overflow-y-scroll md:h-[70vh] sm:max-h-[60vh] sm:min-h-[30vh]">
            <SellModal ref={sell_modal} />
            <CancelModal ref={cancel_modal} />
            {orders.map(({
                order_id,
                //idea_id,
                symbol,
                time,
                //entry,
                target,
                stop,
                //order_entry_time,
                //order_exit_time,
                buy_order_id,
                //sell_order_id,
                status,
                filled_qty,
                effective_entry,
                //exit_price,
                //message,
                current_price
            }) => {
                current_price = effective_entry == 0 ? '__' : current_price
                effective_entry = effective_entry == 0 ? '__' : effective_entry
                let profit = (effective_entry == 0 || isNaN(current_price)) ? '__' : (current_price - effective_entry) * filled_qty

                status = status.toUpperCase()
                const card_color = ['PENDING', 'WAITING'].includes(status) ?
                    'bg-neutral text-neutral-content' :
                    ['TRANSIST', 'FILLED'].includes(status) ?
                        'bg-primary text-primary-content' :
                        status == 'EXITED' ?
                            'bg-base-300 base-content' :
                            ''

                const onclick = ['PENDING', 'WAITING'].includes(status) ?
                    () => cancel_modal.current.open({ order_id, symbol, fn: fetchOrders }) :
                    ['TRANSIST', 'FILLED'].includes(status) ?
                        () => sell_modal.current.open({ symbol, buy_order_id, exit: current_price, qty: filled_qty, fn: fetchOrders }) :
                        status == 'EXITED' ?
                            _ => _ :
                            _ => _

                const price_color = profit > 0 ?
                    "text-success" :
                    profit < 0 ?
                        "text-error" :
                        ""

                time = /(\d{2})(\d{2})$/.exec(time)
                time = `${time[1] > 12 ? time[1] - 12 : time[1]}:${time[2]}${time[1] > 11 ? 'PM' : 'AM'}`



                return (
                    <div key={order_id} className={"shadow card cursor-pointer w-full " + card_color} onClick={onclick}>
                        <div className="card-body p-4 flex flex-col gap-y-4\2">
                            <div className="flex justify-between items-end">
                                <div className="flex gap-x-1 items-end">
                                    <span className="card-title text-xl">{symbol}</span>
                                    <span className="text-sm">{time}</span>
                                </div>
                                <span><span className="text-xl font-medium">@</span><span>₹{effective_entry}</span></span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span><span className="text-xl font-medium">!</span><span>₹{stop}</span></span>
                                <span><span className="text-xl font-medium">#</span><span>₹{target}</span></span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span>₹{current_price}</span>
                                <span className={"font-semibold " + price_color}>₹{profit}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Orders