import { useState, forwardRef, useRef, useCallback } from "react"
import { system_stop, token_set_auth_code, token_stop, place_buy_order, cancel_order, sell_order, auto_trade_off } from "../api"
import { connect_api_acknowledge } from "../api/configs.api"

export const BuyModal = forwardRef(function BuyModal(prop, ref) {
    const [idea_id, setIdeaId] = useState('')
    const [symbol, setSymbol] = useState('')
    const [entry, setEntry] = useState(1)
    const [target, setTarget] = useState(1)
    const [stop, setStop] = useState(1)
    const [qty, setQty] = useState(1)
    const [type, setType] = useState(2)

    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open({ idea_id, symbol, entry, target, stop, qty }) {
            setIdeaId(idea_id)
            setSymbol(symbol)
            setEntry(entry)
            setTarget(target)
            setStop(stop)
            setQty(qty)
            setType(2)
            callback_fn.current = prop.fn || (_ => _)
            modal.current.showModal()
        }
    }

    const buy = async () => {
        const data = await place_buy_order({ idea_id, entry, target, stop, type, qty })
        modal.current.close()
        if (data.error) return console.error(data.error)
        callback_fn.current()
        return true
    }

    return (
        <dialog id="buy-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Buy</h3>
                <p className="py-4 text-lg">{symbol}</p>
                <div className="flex flex-col gap-y-2" >
                    <label htmlFor="inp-price" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Price
                        <input type="number" name="price" id="inp-price" placeholder="Price" value={entry} min="1" onChange={({ target: { value } }) => setEntry(parseInt(value, 10) || '')} className="grow" />
                    </label>
                    <label htmlFor="inp-quantity" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Quantity
                        <input type="number" name="quantity" id="inp-quantity" placeholder="Quantity" value={qty} min="1" onChange={({ target: { value } }) => setQty(parseInt(value, 10) || '')} className="grow" />
                    </label>
                    <label htmlFor="inp-total" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Total
                        <input type="number" name="total" id="inp-total" placeholder="Total price" readOnly value={entry * qty} min={1} className="grow" />
                    </label>
                    <div className="flex justify-between gap-x-8">
                        <label htmlFor="inp-type" className="input input-bordered flex items-center gap-2 grow" data-theme="nord">
                            Type
                            <select name="type" id="inp-type" value={type} onChange={({ target: { value } }) => setType(parseInt(value, 10) || 1)} className="grow" data-theme="nord">
                                <option value="1">LIMIT</option>
                                <option value="2">MARKET</option>
                                <option value="3" disabled>STOP-MARKET</option>
                                <option value="4" disabled>STOP-LIMIT</option>
                            </select>
                        </label>
                        <button className="btn btn-active btn-primary" onClick={buy}>Buy</button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
})

export const SellModal = forwardRef(function SellModal(_, ref) {
    const [symbol, setSymbol] = useState('')
    const [buy_order_id, setBuyOrderId] = useState('')
    const [exit, setExit] = useState(1)
    const [type, setType] = useState(2)
    const [qty, setQty] = useState(1)

    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open({ symbol, buy_order_id, exit, qty, type = 2, fn }) {
            setSymbol(symbol)
            setBuyOrderId(buy_order_id)
            setExit(exit)
            setType(type)
            setQty(qty)
            callback_fn.current = fn || (_ => _)
            modal.current.showModal()
        }
    }

    const sell = async () => {
        const data = await sell_order({ symbol, buy_order_id, exit, type })
        modal.current.close()
        if (data.error) return console.error(data.error)
        callback_fn.current()
        return true
    }

    return (
        <dialog id="sell-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Sell</h3>
                <p className="py-4 text-lg">{symbol}</p>
                <div className="flex flex-col gap-y-2" data-theme="nord">
                    <label htmlFor="inp-price" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Price
                        <input type="number" name="price" id="inp-price" placeholder="Price" value={exit} min="1" onChange={({ target: { value } }) => setExit(value)} className="grow" />
                    </label>
                    <label htmlFor="inp-quantity" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Quantity
                        <input type="number" name="quantity" id="inp-quantity" placeholder="Quantity" value={qty} readOnly className="grow" />
                    </label>
                    <label htmlFor="inp-total" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Total
                        <input type="number" name="total" id="inp-total" placeholder="Total price" readOnly value={exit * qty} min={1} className="grow" />
                    </label>
                    <div className="flex justify-between gap-x-8">
                        <label htmlFor="inp-type" className="input input-bordered flex items-center gap-2 grow" data-theme="nord">
                            Type
                            <select name="type" id="inp-type" value={type} onChange={({ target: { value } }) => setType(value)} className="grow" data-theme="nord">
                                <option value="1">LIMIT</option>
                                <option value="2">MARKET</option>
                                <option value="3" disabled>STOP-M</option>
                                <option value="4" disabled>STOP-L</option>
                            </select>
                        </label>
                        <button className="btn btn-active btn-error text-neutral-content" onClick={sell}>Sell</button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
})

export const CancelModal = forwardRef(function CancelModal(_, ref) {
    const [symbol, setSymbol] = useState('')
    const [order_id, setOrderId] = useState('')

    const modal = useRef(null)

    ref.current = {
        open({ order_id, symbol }) {
            setOrderId(order_id)
            setSymbol(symbol)
            modal.current.showModal()
        }
    }

    const cancel = async () => {
        const data = await cancel_order({ order_id, symbol })
        modal.current.close()
        if (data.error) return console.error(data.error)
        return true
    }

    return (
        <dialog id="cancel-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">{symbol}</h3>
                <p className="py-4">Cancle order</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="mr-12 btn btn-active btn-primary text-primary-content" onClick={cancel}>Cancel</button>
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})

export const TokenModalupdate = forwardRef(function TokenModalUpdate(_, ref) {
    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open(fn) {
            const inp = document.getElementById('inp-code')
            inp.placeholder = 'Paste auth code here'
            callback_fn.current = fn || (_ => _)

            modal.current.showModal()
        }
    }

    const update = useCallback(async () => {
        const inp = document.getElementById('inp-code')
        const code = inp.value
        if (!code) {
            inp.placeholder = 'No code provided'
            return console.error('No code provided')
        }

        const data = await token_set_auth_code(code)
        modal.current.close()
        if (data.error) {
            inp.value = ''
            inp.placeholder = data.error
            return console.error(data.error)
        }
        callback_fn.current()
        return true
    }, [])

    return (
        <dialog id="token-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Update</h3>
                <p className="py-4 text-lg">Auth Token</p>
                <div className="flex flex-col gap-y-4">
                    <label htmlFor="inp-code" className="input input-bordered flex items-center gap-2" data-theme="nord">
                        Code
                        <input type="text" name="code" id="inp-code" placeholder="Paste auth code here" className="grow" />
                    </label>
                    <div className="flex justify-end">
                        <button className="btn btn-active btn-primary" onClick={update}>Set</button>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
})

export const TokenStopConfirmModal = forwardRef(function TokenStopConfirmModal(_, ref) {
    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open(fn) {
            modal.current.showModal()
            callback_fn.current = fn || (_ => _)
        }
    }

    const stop = useCallback(async () => {
        const data = await token_stop()
        modal.current.close()
        if (data.error) return console.error(data.error)
        callback_fn.current()

        return true
    }, [])

    return (
        <dialog id="token-stop-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Fyers Logout</h3>
                <p className="py-4">Are you sure you want to logout from ferys?</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="mr-12 btn btn-active btn-error text-neutral-content" onClick={stop}>Stop</button>
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})

export const SystemStopConfirmModal = forwardRef(function SystemStopConfirmModal(_, ref) {
    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open(fn) {
            modal.current.showModal()
            callback_fn.current = fn || (_ => _)
        }
    }

    const stop = useCallback(async () => {
        const data = await system_stop()
        modal.current.close()
        if (data.error) return console.error(data.error)
        callback_fn.current()

        return true
    }, [])

    return (
        <dialog id="system-stop-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Stop System</h3>
                <p className="py-4">Are you sure you want to stop the trading system?</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="mr-12 btn btn-active btn-error text-neutral-content" onClick={stop}>Stop</button>
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})

export const AutoTradeStopConfirmModal = forwardRef(function AutoTradeStopConfirmModal(_, ref) {
    const modal = useRef(null)
    const callback_fn = useRef(_ => _)

    ref.current = {
        open(fn) {
            modal.current.showModal()
            callback_fn.current = fn || (_ => _)
        }
    }

    const stop = useCallback(async () => {
        const data = await auto_trade_off()
        modal.current.close()
        if (data.error) return console.error(data.error)
        callback_fn.current()

        return true
    }, [])

    return (
        <dialog id="system-stop-modal" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Stop Auto-Trade</h3>
                <p className="py-4">Are you sure you want to stop the auto trading?</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="mr-12 btn btn-active btn-error text-neutral-content" onClick={stop}>Stop</button>
                        <button className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
})

export const APIAcknowledgeModal = () => {
    const modal = useRef(null)
    const [message, setMessage] = useState('')

    connect_api_acknowledge((msg) => {
        setMessage(msg)
        modal.current.showModal()
    })

    return (
        <dialog id="" className="modal" ref={modal} >
            <div className="modal-box" data-theme="nord">
                <h3 className="font-bold text-lg">Trade Station</h3>
                <p className="py-4">{message}</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}