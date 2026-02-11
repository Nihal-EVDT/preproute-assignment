import { useEffect, useState } from 'react'
import { getAllTests } from '../../api/test.api'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/DashboardLayout'

interface TestItem {
  id: string
  name: string
  subject: string
  status: string
  created_at: string
}

export default function Dashboard () {
  const [tests, setTests] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      setLoading(true)
      const res = await getAllTests()
      setTests(res.data.data || [])
    } catch (error) {
      console.error('error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-xl font-semibold'>Test Creation</h1>
          <p className='text-sm text-gray-500'>Create & manage your tests</p>
        </div>

        <button
          onClick={() => navigate('/tests/create')}
          className='bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600'
        >
          + Create Test
        </button>
      </div>

      {/* TABLE */}
      <div className='bg-white rounded-lg border overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 text-left'>
            <tr>
              <th className='px-4 py-3'>Test Name</th>
              <th className='px-4 py-3'>Subject</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Created On</th>
              <th className='px-4 py-3'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className='text-center py-6'>
                  Loading tests...
                </td>
              </tr>
            ) : tests.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center py-6 text-gray-500'>
                  No tests found
                </td>
              </tr>
            ) : (
              tests.map(test => (
                <tr key={test.id} className='border-t hover:bg-gray-50'>
                  <td className='px-4 py-3 font-medium'>{test.name}</td>
                  <td className='px-4 py-3'>{test.subject}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        test.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {new Date(test.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3 space-x-3'>
                    <button
                      onClick={() =>
                        navigate(`/tests/create/${test.id}?mode=edit`)
                      }
                      className='text-blue-600 text-xs'
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/tests/create/${test.id}?mode=view`)
                      }
                      className='text-gray-600 text-xs'
                    >
                      View
                    </button>
                    <button className='text-red-500 text-xs'>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
