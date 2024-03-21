import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import { ConfigProvider } from 'antd'
import AuthProvider from './components/AuthProvider'
import AxiosInterceptor from './components/Interceptor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    // <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#0e7490',
                        colorLink: '#0e7490',
                        colorBgLayout: '#f9fafb'
                    },
                    components: {
                        Menu: { itemHoverColor: '#0e7490' },
                    },
                }}
            >
                <AuthProvider>
                    <AxiosInterceptor />
                    <App />
                </AuthProvider>
            </ConfigProvider>
        </BrowserRouter>
    // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
