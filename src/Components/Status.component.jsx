import { useEffect, useRef, useState } from "react"
import { auto_trade_on, get_auto_trade_status, get_funds, get_system_status, system_start } from "../api"
import { get_token_status } from "../api/token.api.js"
import { AutoTradeStopConfirmModal, SystemStopConfirmModal, TokenStopConfirmModal } from "./Modals.component.jsx"

export const Status = () => {
    const [system_status, setSystemStatus] = useState('OFF')
    const [token_status, setTokenStatus] = useState('OFF')
    const [auto_trade_status, setAutoTradeStatus] = useState('OFF')
    const [equity_balance, setEquityBalance] = useState(0)

    useEffect(() => {
        const fetchStatus = async () => {
            const system = await get_system_status()
            if (system.error) return console.error(system.error)
            setSystemStatus(system.status ? 'ON' : 'OFF')
        }
        const fetchToken = async () => {
            const token = await get_token_status()
            if (token.error) return console.error(token.error)
            setTokenStatus(token.status ? 'ON' : 'OFF')
        }
        const fetchAutoTrade = async () => {
            const auto_trade = await get_auto_trade_status()
            if (auto_trade.error) return console.error(auto_trade.error)
            setAutoTradeStatus(auto_trade.status ? 'ON' : 'OFF')
        }
        const fetchEquity = async () => {
            const equity = await get_funds()
            if (equity.error) return console.error(equity.error)
            setEquityBalance(equity.funds)
        }

        const timeout = setTimeout(() => {
            fetchStatus()
            fetchToken()
            fetchAutoTrade()
            fetchEquity()
        }, 500)

        return () => clearTimeout(timeout)
    }, [])

    const system_stop_modal = useRef(null)
    const token_stop_modal = useRef(null)
    const auto_trade_modal = useRef(null)

    const system_start_stop = async () => {
        if (system_status === 'ON') {
            system_stop_modal.current.open(() => setSystemStatus('OFF'))
            return true
        }

        const data = await system_start()
        if (data.error) return console.error(data.error)
        setSystemStatus('ON')
        return true
    }

    const token_stop = () => {
        if (token_status === 'ON') {
            token_stop_modal.current.open(() => {
                setTokenStatus('OFF')
                setAutoTradeStatus('OFF')
                setEquityBalance(0)
            })
            return true
        }

        return true
    }

    const auto_trade_start_stop = async () => {
        if (auto_trade_status === 'ON') {
            auto_trade_modal.current.open(() => setAutoTradeStatus('OFF'))
            return true
        }

        const data = await auto_trade_on()
        if (data.error) return console.error(data.error)
        setAutoTradeStatus('ON')
        return true
    }

    return (
        <div className="grid md:grid-cols-4 sm:grid-rows-4 md:gap-x-8 sm:gap-y-4">
            <SystemStopConfirmModal ref={system_stop_modal} />
            <TokenStopConfirmModal ref={token_stop_modal} />
            <AutoTradeStopConfirmModal ref={auto_trade_modal} />
            <div className="stats shadow overflow-hidden" data-theme="light">
                <div className="stat">
                    <div className="stat-figure text-nutral place-self-end text-lg">
                        <button className={"btn text-neutral-content btn-xs " + (system_status === 'ON' ? 'btn-error' : 'btn-success')} onClick={system_start_stop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200">
                                <path fill="currentColor" d="M513.94 0v693.97h172.12V0zM175.708 175.708C67.129 284.287 0 434.314 0 600c0 331.371 268.629 600 600 600s600-268.629 600-600c0-165.686-67.13-315.713-175.708-424.292l-120.85 120.85c77.66 77.658 125.684 184.952 125.684 303.442c0 236.981-192.146 429.126-429.126 429.126c-236.981 0-429.126-192.145-429.126-429.126c0-118.49 48.025-225.784 125.684-303.442z" />
                            </svg>
                        </button>
                    </div>
                    <div className={"stat-title"}>System Status</div>
                    <div className={"stat-value text-" + (system_status === 'ON' ? 'success' : 'error')}>{system_status}</div>
                </div>
            </div>

            <div className="stats shadow overflow-hidden" data-theme="light">
                <div className="stat">
                    <div className="stat-figure text-nutral place-self-end text-xl">
                        <button {...(token_status === 'ON' ? {} : { disabled: 'disabled' })} className={"btn text-neutral-content btn-xs " + (token_status === 'ON' ? ' btn-error' : '')} onClick={token_stop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
                                <rect width="20" height="20" fill="none" />
                                <path fill="currentColor" d="M1.22 0L0 1.22l3.06 3.06a9 9 0 0 0 12.66 12.66L18.78 20L20 18.78zM5 11V9h2.78l2 2zm5-10a9 9 0 0 0-4.26 1.08L12.66 9H15v2h-.34l3.26 3.26A9 9 0 0 0 10 1" />
                            </svg>
                        </button>
                    </div>
                    <div className="stat-title">Access Token</div>
                    <div className={"stat-value text-" + (token_status === 'ON' ? 'success' : 'error')}>{token_status}</div>
                </div>
            </div>

            <div className="stats shadow overflow-hidden" data-theme="light">
                <div className="stat">
                    <div className="stat-figure text-nutral place-self-end text-lg">
                        <button {...(token_status === 'ON' ? {} : { disabled: 'disabled' })} className={"btn text-neutral-content btn-xs " + (auto_trade_status === 'ON' ? 'btn-error' : 'btn-success')} onClick={auto_trade_start_stop}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200">
                                <path fill="currentColor" d="M513.94 0v693.97h172.12V0zM175.708 175.708C67.129 284.287 0 434.314 0 600c0 331.371 268.629 600 600 600s600-268.629 600-600c0-165.686-67.13-315.713-175.708-424.292l-120.85 120.85c77.66 77.658 125.684 184.952 125.684 303.442c0 236.981-192.146 429.126-429.126 429.126c-236.981 0-429.126-192.145-429.126-429.126c0-118.49 48.025-225.784 125.684-303.442z" />
                            </svg>
                        </button>
                    </div>
                    <div className="stat-title">Auto Trade</div>
                    <div className={"stat-value text-" + (auto_trade_status === 'ON' ? 'success' : 'error')}>{auto_trade_status}</div>
                </div>
            </div>

            <div className="stats shadow overflow-hidden" data-theme="light">
                <div className="stat">
                    <div className="stat-figure text-nutral place-self-end text-xl">
                        <button disabled="disabled" className="btn btn-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                                <rect width="512" height="512" fill="none" />
                                <path fill="currentColor" d="M298.7 213.3V0h-85.4v213.3H0v85.4h213.3V512h85.4V298.7H512v-85.4z" />
                            </svg>
                        </button>
                    </div>
                    <div className="stat-title">Equity Balance</div>
                    <div className={"stat-value text-" + (equity_balance > 0 ? 'success' : 'error')}>₹{equity_balance}</div>
                </div>
            </div>
        </div >
    )
}

export default Status