import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/DashboardLayout'

import Step1Basic from './Step1Basic'
import Step2Questions from './Step2Questions'
import Step3Confirm from './Step3Confirm'
import Step4Publish from './Step4Publish'

import {
  setTestId,
  setStep,
  resetTest,
  setGetById
} from '../../store/slice/createTest.slice'

import { getTestById } from '../../api/test.api'

interface RootState {
  createTest: {
    currentStep: number
  }
}

export default function CreateTest () {
  const dispatch = useDispatch()
  const step = useSelector((state: RootState) => state.createTest.currentStep)

  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') // edit | view

  /* ======================
     LOAD TEST FOR EDIT / VIEW
  ====================== */
  const loadTest = useCallback(
    async (testId: string) => {
      try {
        // 🔥 reset first to avoid duplicate questions
        dispatch(resetTest())

        const res = await getTestById(testId)
        const test = res.data.data
        dispatch(setTestId(test.id))
        dispatch(setGetById(test))

        dispatch(setStep(1))
      } catch (err) {
        console.error('Failed to load test', err)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (!id) return
    loadTest(id)
  }, [id, loadTest])

  /* ======================
     RESET WHEN CREATE MODE
  ====================== */
  useEffect(() => {
    if (!id) {
      dispatch(resetTest())
    }
  }, [id, dispatch])

  return (
    <AdminLayout>
      {step === 1 && <Step1Basic mode={mode as string} />}
      {step === 2 && <Step2Questions mode={mode as string} />}
      {step === 3 && <Step3Confirm mode={mode as string} />}
      {step === 4 && <Step4Publish mode={mode as string} />}
    </AdminLayout>
  )
}
