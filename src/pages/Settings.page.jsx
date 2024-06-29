import { useEffect, useRef, useState } from 'react'
import { AutoTradeStopConfirmModal, SystemStopConfirmModal, TokenModalupdate, TokenStopConfirmModal } from '../Components'
import { Link } from 'react-router-dom'
import { auto_trade_on, get_auto_trade_status, get_log_files, get_system_status, get_token_status, logout, system_start, token_auth_code, token_refresh } from '../api'
import { LOG_FILE_DOWNLOAD, ROOT } from '../api/configs.api'

export const Settings = () => {
    const [system_status, setSystemStatus] = useState('OFF')
    const [token_status, setTokenStatus] = useState('OFF')
    const [auto_trade_status, setAutoTradeStatus] = useState('OFF')
    const [auth_code, setAuthCode] = useState('#')
    const [log_files, setLogFiles] = useState([])

    useEffect(() => {
        const fetchSystemStatus = async () => {
            const system = await get_system_status()
            if (system.error) return console.error(system.error)
            setSystemStatus(system.status ? 'ON' : 'OFF')
        }
        const fetchTokenStatus = async () => {
            const token = await get_token_status()
            if (token.error) return console.error(token.error)
            setTokenStatus(token.status ? 'ON' : 'OFF')
        }
        const fetchAutoTrade = async () => {
            const auto_trade = await get_auto_trade_status()
            if (auto_trade.error) return console.error(auto_trade.error)
            setAutoTradeStatus(auto_trade.status ? 'ON' : 'OFF')
        }
        const fetchAuthCode = async () => {
            const code = await token_auth_code()
            if (code.error) return console.error(code.error)
            setAuthCode(code['auth_link'])
        }
        const fetchLogFiles = async () => {
            const logs = await get_log_files()
            if (logs.error) return console.error(logs.error)
            setLogFiles(logs)
        }

        const timeout = setTimeout(() => {
            fetchSystemStatus()
            fetchTokenStatus()
            fetchAutoTrade()
            fetchAuthCode()
            fetchLogFiles()
        }, 500)

        return () => clearTimeout(timeout)
    }, [])

    const token_modal = useRef(null)
    const token_stop_modal = useRef(null)
    const system_stop_modal = useRef(null)
    const auto_trade_modal = useRef(null)

    const fyersLogout = () => {
        token_stop_modal.current.open(() => {
            setTokenStatus('OFF')
            setAutoTradeStatus('OFF')
        })
    }

    const fyersLogin = () => {
        token_modal.current.open(() => setTokenStatus('ON'))
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

    return (
        <div className="dashboard-page" data-theme="nord">
            <Link role="button" className="btn  btn-link text-lg absolute top-[-0.5rem] right-4" to="/">Homepage</Link>
            <AutoTradeStopConfirmModal ref={auto_trade_modal} />
            <TokenModalupdate ref={token_modal} />
            <SystemStopConfirmModal ref={system_stop_modal} />
            <TokenStopConfirmModal ref={token_stop_modal} />
            <h1 className="font-bold text-2xl ">Settings</h1>
            <hr className="border-solid" />
            <div className="flex gap-x-4 items-start justify-between md:mx-8">
                <a role="button" className="btn btn-neutral" onClick={logout}>Logout</a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Trading System {system_status === 'OFF' ? "Start" : "Stop"}</span>
                <a role="button" className={"btn  text-neutral-content mr-5 " + (system_status === 'ON' ? 'btn-error' : 'btn-success')} onClick={system_start_stop}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200">
                        <path fill="currentColor" d="M513.94 0v693.97h172.12V0zM175.708 175.708C67.129 284.287 0 434.314 0 600c0 331.371 268.629 600 600 600s600-268.629 600-600c0-165.686-67.13-315.713-175.708-424.292l-120.85 120.85c77.66 77.658 125.684 184.952 125.684 303.442c0 236.981-192.146 429.126-429.126 429.126c-236.981 0-429.126-192.145-429.126-429.126c0-118.49 48.025-225.784 125.684-303.442z" />
                    </svg>
                </a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Auto Trade {auto_trade_status === 'ON' ? 'Stop' : 'Start'}</span>
                <a role="button" className={"btn mr-5 text-neutral-content " + (auto_trade_status === 'ON' ? 'btn-error' : 'btn-success')} {...(token_status === 'OFF' ? { disabled: 'disabled' } : {})} onClick={auto_trade_start_stop}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200">
                        <path fill="currentColor" d="M513.94 0v693.97h172.12V0zM175.708 175.708C67.129 284.287 0 434.314 0 600c0 331.371 268.629 600 600 600s600-268.629 600-600c0-165.686-67.13-315.713-175.708-424.292l-120.85 120.85c77.66 77.658 125.684 184.952 125.684 303.442c0 236.981-192.146 429.126-429.126 429.126c-236.981 0-429.126-192.145-429.126-429.126c0-118.49 48.025-225.784 125.684-303.442z" />
                    </svg>
                </a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Generate Fyers Auth Code</span>
                <a role="button" className="btn  btn-link" target="_blank" href={auth_code}>Generate</a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Login to Fyers, Set Auth Code</span>
                <a role="button" className="btn btn-primary mr-4" onClick={fyersLogin}>Set</a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Refresh Fyers Access Token</span>
                <a role="button" className={"btn " + (token_status === 'OFF' ? '' : 'btn-primary')} {...(token_status === 'OFF' ? { disabled: 'disabled' } : {})} onClick={token_refresh}>Refresh</a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Logot from Fyers</span>
                <a role="button" className={"btn mr-1 " + (token_status === 'OFF' ? '' : 'btn-neutral')} {...(token_status === 'OFF' ? { disabled: 'disabled' } : {})} onClick={fyersLogout}>Logout</a>
            </div>
            <div className="flex gap-x-4 items-start justify-between md:mx-8 p-2 shadow">
                <span className="text-lg basis-2/3">Downlod Logs</span>
                <div className="dropdown dropdown-top dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-info mr-2">Files</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow" data-theme="nord">
                        {log_files.map((file, idx) => (
                            <li key={idx}><a role="button" className="btn  btn-link" download={file} href={`${ROOT}${LOG_FILE_DOWNLOAD}/${file}`}>{file}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Settings