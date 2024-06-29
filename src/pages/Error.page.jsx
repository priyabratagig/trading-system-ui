import propTypes from 'prop-types'

export const NotFoundPage = () => {
    return (
        <div className="full-page flex items-center justify-center" data-theme="nord">
            <h1 className="text-9xl">404</h1>
            <h2 className="text-2xl">Page Not Found</h2>
        </div>
    )
}

export const ErrorPage = ({ message }) => {
    return (
        <div className="full-page flex items-center justify-center" data-theme="nord">
            <h1 className="text-9xl">500</h1>
            <h2 className="text-2xl">Page Crashed {message}</h2>
        </div>
    )
}

ErrorPage.propTypes = {
    message: propTypes.string
}

export default NotFoundPage