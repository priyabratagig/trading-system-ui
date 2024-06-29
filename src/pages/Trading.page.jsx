import { Link } from "react-router-dom"
import { Ideas, Orders, Status } from "../Components"

export const TradingPage = () => {
    return (
        <div className="dashboard-page" data-theme="nord">
            <Link role="button" className="btn btn-active btn-link text-lg absolute top-[-0.5rem] right-4" to="/settings">Settings</Link>
            <Status />
            <div className="grid md:grid-cols-[3fr_2fr] md:gap-x-4 sm:gap-y-4">
                <Ideas />
                <Orders />
            </div>
        </div >
    )
}
export default TradingPage