import { delete_idea, get_ideas } from "../api"
import { BuyModal } from "./Modals.component"
import { useEffect, useRef, useState } from "react"

export const Ideas = () => {
    const [ideas, setIdeas] = useState([])

    useEffect(() => {
        const fetchIdeas = async () => {
            const ideas = await get_ideas()
            if (ideas.error) return console.error(ideas.error)
            setIdeas(ideas)
        }
        const timeout = setTimeout(fetchIdeas, 500)

        return () => clearTimeout(timeout)
    }, [])

    const delete_handler = async (id) => {
        const data = await delete_idea(id)
        if (data.error) return console.error(data.error)
        setIdeas(ideas.filter(idea => idea.idea_id !== id))
        return true
    }

    const buy_modal = useRef(null)

    return (
        <>
            <BuyModal ref={buy_modal} />
            <div className="shadow md:h-[70vh] sm:max-h-[60vh] sm:min-h-[30vh] overflow-y-scroll flex flex-col relative rounded-box">
                <div className="flex items-stretch justify-strech gap-x-2 shadow py-4 px-2 sticky top-0" data-theme="light">
                    <span className="basis-[15%] flex-1 mr-2 truncate">Symbol</span>
                    <span className="basis-[15%] flex-1 truncate">Time</span>
                    <span className="basis-[10%] flex-1 truncate">Entry</span>
                    <span className="basis-[10%] flex-1 truncate">Target</span>
                    <span className="basis-[10%] flex-1 truncate">Stop</span>
                    <span className="basis-[10%] flex-1 truncate">Qty</span>
                    <span className="basis-[15%] flex-1 truncate">Action</span>
                </div>
                {
                    ideas.map(({ idea_id, symbol, time, entry, target, stop, qty }) => {
                        time = /(\d{2})(\d{2})$/.exec(time)
                        time = `${time[1] > 12 ? time[1] - 12 : time[1]}:${time[2]}${time[1] > 11 ? 'PM' : 'AM'}`

                        const chart_link = `https://www.tradingview.com/chart/?${new URLSearchParams({
                            symbol: 'NSE:' + symbol,
                            interval: "15"
                        }).toString()}`

                        const delete_idea = () => delete_handler(idea_id)
                        const trade_idea = () => buy_modal.current.open({ idea_id, symbol, entry, target, stop, qty })

                        return (
                            <div className="flex items-stretch justify-strech gap-x-2 shadow py-4 px-2" key={idea_id}>
                                <span className="basis-[15%] flex-1 break-all mr-2"><a target="_blank" className="underline" href={chart_link}>{symbol}</a></span>
                                <span className="basis-[15%] flex-1 break-all">{time}</span>
                                <span className="basis-[10%] flex-1 break-all">{entry}</span>
                                <span className="basis-[10%] flex-1 break-all">{target}</span>
                                <span className="basis-[10%] flex-1 break-all">{stop}</span>
                                <span className="basis-[10%] flex-1 break-all">{qty}</span>
                                <span className="basis-[15%] flex-1 flex items-stretch justify-around flex-wrap gap-2">
                                    <button className="btn btn-square btn-outline btn-error w-8 btn-xs" onClick={delete_idea}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <button className="btn btn-square btn-primary btn-xs w-8 text-base" onClick={trade_idea}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                                            <rect width="512" height="512" fill="none" />
                                            <path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0m149.3 277.3c0 11.8-9.5 21.3-21.3 21.3h-85.3V384c0 11.8-9.5 21.3-21.3 21.3h-42.7c-11.8 0-21.3-9.6-21.3-21.3v-85.3H128c-11.8 0-21.3-9.6-21.3-21.3v-42.7c0-11.8 9.5-21.3 21.3-21.3h85.3V128c0-11.8 9.5-21.3 21.3-21.3h42.7c11.8 0 21.3 9.6 21.3 21.3v85.3H384c11.8 0 21.3 9.6 21.3 21.3z" />
                                        </svg>
                                    </button>
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Ideas