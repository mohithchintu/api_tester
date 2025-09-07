import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ApiTester() {
    const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET')
    const [endpoint, setEndpoint] = useState('/')
    const [body, setBody] = useState('{}')
    const [response, setResponse] = useState('')
    const [cookies, setCookies] = useState(document.cookie)
    const [localStorageData, setLocalStorageData] = useState(JSON.stringify(localStorage, null, 2))

    const handleSend = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(method !== 'GET' && method !== 'DELETE' ? { body } : {}),
                credentials: 'include',
            })
            const text = await res.text()
            setResponse(text)
            setCookies(document.cookie)
            setLocalStorageData(JSON.stringify(localStorage, null, 2))
        } catch (e) {
            setResponse(String(e))
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
                <pre className="bg-gray-100 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800 font-mono">{cookies}</pre>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">LocalStorage</h3>
                <pre className="bg-gray-100 border border-gray-200 rounded-md p-4 overflow-x-auto text-sm text-gray-800 font-mono">{localStorageData}</pre>
            </div>
        </div>
    )
}