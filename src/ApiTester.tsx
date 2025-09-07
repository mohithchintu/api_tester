import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helper to parse cookies string into array of { key, value }
function parseCookies(cookieString: string) {
    return cookieString
        .split(';')
        .map(cookie => cookie.trim())
        .filter(Boolean)
        .map(cookie => {
            const [key, ...rest] = cookie.split('=')
            return { key, value: rest.join('=') }
        })
}

// Helper to parse localStorage into array of { key, value }
function parseLocalStorage() {
    const items = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
            items.push({ key, value: localStorage.getItem(key) ?? '' })
        }
    }
    return items
}

export default function ApiTester() {
    const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET')
    const [endpoint, setEndpoint] = useState('/')
    const [body, setBody] = useState('{}')
    const [response, setResponse] = useState('')
    const [cookies, setCookies] = useState(document.cookie)
    const [localStorageData, setLocalStorageData] = useState(JSON.stringify(localStorage, null, 2))

    const handleSend = async () => {
        try {
            const url = `${API_BASE_URL}${endpoint}`
            let res
            if (method === 'GET' || method === 'DELETE') {
                res = await axios({
                    url,
                    method,
                    withCredentials: true,
                })
            } else {
                res = await axios({
                    url,
                    method,
                    data: body ? JSON.parse(body) : undefined,
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
            }
            setResponse(typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2))
            setCookies(document.cookie)
            setLocalStorageData(JSON.stringify(localStorage, null, 2))
        } catch (e: any) {
            if (e.response) {
                setResponse(typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data, null, 2))
            } else {
                setResponse(String(e))
            }
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">API Tester</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <select
                    value={method}
                    onChange={e => setMethod(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono"
                >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                </select>
                <input
                    value={endpoint}
                    onChange={e => setEndpoint(e.target.value)}
                    placeholder="/api/endpoint"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
            </div>
            {(method === 'POST' || method === 'PUT') && (
                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder='{"key": "value"}'
                />
            )}
            <button
                onClick={handleSend}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition-colors"
            >
                Send
            </button>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Response</h3>
                <pre className="bg-gray-100 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800 font-mono">{response}</pre>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Cookies</h3>
                <table className="min-w-full bg-gray-50 border border-gray-200 rounded-md text-sm font-mono">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 border-b text-left">Key</th>
                            <th className="px-3 py-2 border-b text-left">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parseCookies(cookies).length === 0 ? (
                            <tr>
                                <td className="px-3 py-2 text-gray-400" colSpan={2}>No cookies</td>
                            </tr>
                        ) : (
                            parseCookies(cookies).map(({ key, value }) => (
                                <tr key={key}>
                                    <td className="px-3 py-2 border-b">{key}</td>
                                    <td className="px-3 py-2 border-b break-all">{value}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">LocalStorage</h3>
                <table className="min-w-full bg-gray-50 border border-gray-200 rounded-md text-sm font-mono">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 border-b text-left">Key</th>
                            <th className="px-3 py-2 border-b text-left">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parseLocalStorage().length === 0 ? (
                            <tr>
                                <td className="px-3 py-2 text-gray-400" colSpan={2}>No localStorage data</td>
                            </tr>
                        ) : (
                            parseLocalStorage().map(({ key, value }) => (
                                <tr key={key}>
                                    <td className="px-3 py-2 border-b">{key}</td>
                                    <td className="px-3 py-2 border-b break-all">{value}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}