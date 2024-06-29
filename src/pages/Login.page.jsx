import { useState } from 'react'
import { login } from '../api'
import Login, { Logo, Submit, Title, Username, Password } from '@react-login-page/page1'
import './login.page.css'

const style = {
    '--login-bg': '#edeff3',
    '--login-bg-from': '#46acfc',
    '--login-bg-to': '#3ffbd8',
}

export const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    return (
        <Login className='full-page' style={style} >
            <Logo style={{ fontFamily: 'initial' }}>🪄</Logo>
            <Title>Trade Station</Title>
            <Username value={username} onChange={({ target: { value } }) => { setUsername(value); setMessage('') }} />
            <Password value={password} onChange={({ target: { value } }) => { setPassword(value); setMessage('') }} />
            {message && <p style={{ zIndex: 1 }}>{message}</p>}
            <Submit onClick={async () => setMessage((await login({ username, password })).error)} />
        </Login>
    )
}

export default LoginPage