import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { resetTest } from '../../store/slice/createTest.slice'
import { publishTest } from '../../api/test.api'
import type { RootState } from '../../store'

export default function Step4Publish ({mode}: {mode?: string}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const testId = useSelector((s: RootState) => s.createTest.testId)
  const totalQuestions = useSelector(
    (s: RootState) => s.createTest.noOfQuestions
  )

  const [publishing, setPublishing] = useState<boolean>(false)

  const confirmPublish = async () => {
    if (!testId) {
      toast.error('Test ID not found')
      return
    }

    try {
      setPublishing(true)

      // ✅ Publish Test
      await publishTest(testId)

      toast.success('Test published successfully 🚀')

      dispatch(resetTest())
      navigate('/dashboard')
    } catch (error) {
      console.error('Publish failed:', error)
      toast.error('Failed to publish test')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className='bg-white border rounded-xl p-6 max-w-7xl'>
      {/* -------- HEADER -------- */}
      <div className='mb-4'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          Test created
          <span className='px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full'>
            All questions done
          </span>
        </h2>
      </div>

      <div className='flex gap-6'>
        {/* -------- LEFT QUESTION LIST -------- */}
        <aside className='w-[220px] border rounded-lg p-3 space-y-2'>
          {Array.from({ length: totalQuestions || 0 }).map((_, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-md text-sm ${
                i === 0
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'border text-gray-500'
              }`}
            >
              Question {i + 1}
            </div>
          ))}
        </aside>

        {/* -------- MAIN CONTENT -------- */}
        <div className='flex-1'>
          {/* Test Meta */}
          <div className='flex justify-between items-start mb-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <span className='px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs'>
                  Chapter Wise
                </span>
                <span className='px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs'>
                  Easy
                </span>
              </div>

              <div className='text-sm text-gray-600 space-y-1'>
                <p>Subject: Maths</p>
                <p>
                  Topic:{' '}
                  <span className='px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs'>
                    Grammar
                  </span>{' '}
                  <span className='px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs'>
                    Writing
                  </span>
                </p>
                <p>
                  Sub Topic:{' '}
                  <span className='px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs'>
                    Application
                  </span>
                </p>
              </div>
            </div>

            {/* Hide Toggle */}
            <div className='flex items-center gap-2 text-sm'>
              <span>Hide from Moderator</span>
              <input type='checkbox' defaultChecked />
            </div>
          </div>

          {/* Publish Tabs */}
          <div className='flex gap-4 border-b mb-4'>
            <button className='pb-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600'>
              Schedule Publish
            </button>
            <button className='pb-2 text-sm text-gray-500'>Publish Now</button>
            <button className='pb-2 text-sm text-gray-500'>
              Save to Question Bank
            </button>
          </div>

          {/* Schedule Date & Time */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div>
              <label className='text-xs text-gray-500'>
                Select Date and Time
              </label>
              <input
                placeholder='Select Date'
                className='mt-1 w-full h-[38px] border rounded-md px-3 text-sm'
              />
            </div>
            <div>
              <label className='text-xs text-gray-500'>&nbsp;</label>
              <input
                placeholder='Select Time'
                className='mt-1 w-full h-[38px] border rounded-md px-3 text-sm'
              />
            </div>
          </div>

          {/* Live Until */}
          <div className='mb-6'>
            <h3 className='text-sm font-medium mb-2'>Live Until</h3>
            <p className='text-xs text-gray-500 mb-3'>
              Choose how long this test should remain available on the platform.
            </p>

            <div className='grid grid-cols-3 gap-y-3 text-sm'>
              {[
                'Always Available',
                '1 Week',
                '2 Weeks',
                '3 Weeks',
                '1 Month',
                'Custom Duration'
              ].map((label, i) => (
                <label key={label} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='liveUntil'
                    defaultChecked={i === 5}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-4 mt-4'>
              <input
                placeholder='Select End Date'
                className='h-[38px] border rounded-md px-3 text-sm'
              />
              <input
                placeholder='Select End Time'
                className='h-[38px] border rounded-md px-3 text-sm'
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='px-6 py-2 text-sm border rounded-md text-gray-600'
            >
              Cancel
            </button>

            <button
              type='button'
              onClick={confirmPublish}
              disabled={publishing}
              className='px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60'
            >
              {publishing ? 'Publishing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
