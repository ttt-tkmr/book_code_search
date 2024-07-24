import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BookSearch() {
  const [isbn, setIsbn] = useState('')
  const [bookInfo, setBookInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setCopyStatus('')
    try {
      const response = await fetch(`/api/book?isbn=${isbn}`)
      if (!response.ok) {
        throw new Error('Failed to fetch book information')
      }
      const data = await response.json()
      setBookInfo(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyBookInfo = async () => {
    if (!bookInfo) {
      setCopyStatus('No data to copy')
      setTimeout(() => setCopyStatus(''), 2000)
      return
    }
  
    const fields = ['title', 'author', 'publisher', 'publicationdate', 'description', 'pagecount', 'coverimage', 'genre', 'isbn']
    const tsvContent = fields.map(field => bookInfo[field] || 'Not found').join('\t')
  
    try {
      // テキストとしてコピー
      await navigator.clipboard.writeText(tsvContent)
  
      // HTML形式でもコピー（Excelライクなフォーマット）
      const htmlContent = `
        <table>
          <tr>
            ${fields.map(field => `<td>${bookInfo[field] || 'Not found'}</td>`).join('')}
          </tr>
        </table>
      `
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([tsvContent], { type: 'text/plain' }),
          'text/html': new Blob([htmlContent], { type: 'text/html' })
        })
      ])
  
      setCopyStatus('Copied')
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (err) {
      console.error('コピーに失敗しました:', err)
      setCopyStatus('Copy failed')
      setTimeout(() => setCopyStatus(''), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-skin-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-yellow-light px-6 py-5 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Book Details</h2>
          </div>
          <div className="px-6 py-5">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-grow">
                <Label htmlFor="isbn" className="sr-only">ISBN</Label>
                <Input 
                  id="isbn" 
                  type="text" 
                  placeholder="Enter ISBN" 
                  className="w-full text-black"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-skin-light hover:bg-yellow-light text-black" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {bookInfo && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-yellow-light px-6 py-4 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">Search Results</h2>
              <div className="flex items-center gap-2">
                <Button onClick={copyBookInfo} className="bg-green-600 hover:bg-green-700 text-white">
                  Copy
                </Button>
                {copyStatus && (
                  <span className="text-sm text-gray-600">{copyStatus}</span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Title', 'Author', 'Publisher', 'Publication Date', 'Description', 'Page Count', 'Cover Image', 'Genre', 'ISBN'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bookInfo.title || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.author || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.publisher || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.publicationdate || 'Not found'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{(bookInfo.description && bookInfo.description.length > 100) ? bookInfo.description.substring(0, 100) + '...' : (bookInfo.description || 'Not found')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.pagecount || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.coverimage || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.genre || 'Not found'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bookInfo.isbn || 'Not found'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <footer className="bg-brown-light py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-text">
            Book code search by ttt-tkmr
          </p>
        </div>
      </footer>
    </div>
  )
}