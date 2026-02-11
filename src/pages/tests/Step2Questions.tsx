import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, setStep } from '../../store/slice/createTest.slice'
import {
  createQuestionsBulk,
  getTopicsBySubject,
  getSubTopicsByTopic
} from '../../api/test.api'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

/* ======================
   TYPES
====================== */

type SubmitAction = 'next' | 'publish'

interface Topic {
  id: string
  name: string
}

interface SubTopic {
  id: string
  name: string
}

interface QuestionFormValues {
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: 'option1' | 'option2' | 'option3' | 'option4'
  solution?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  topic?: string
  sub_topic?: string
}

interface CreateQuestionPayload {
  type: 'mcq'
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: string
  explanation?: string
  difficulty?: string
  subject: string
  test_id: string
}

interface RootState {
  createTest: {
    testId: string
    noOfQuestions: number
    subjectId: string
  }
}

/* ======================
   COMPONENT
====================== */

export default function Step2Questions ({mode}: {mode?: string}) {
  const dispatch = useDispatch()
  console.log('Step 2 mode:', mode) // 🔥 DEBUG

  const testId = useSelector((s: RootState) => s.createTest.testId)
  const totalQuestions = useSelector(
    (s: RootState) => s.createTest.noOfQuestions
  )
  const subjectId = useSelector((s: RootState) => s.createTest.subjectId)

  const [currentIndex, setCurrentIndex] = useState<number>(1)
  const [submitAction, setSubmitAction] = useState<SubmitAction>('next')
  console.log('Current submit action:', submitAction)
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting }
  } = useForm<QuestionFormValues>()

  const selectedTopic = watch('topic')

  /* ======================
     FETCH TOPICS
  ====================== */
  useEffect(() => {
    if (!subjectId) return

    getTopicsBySubject(subjectId)
      .then(res => setTopics(res.data.data as Topic[]))
      .catch(() => toast.error('Failed to load topics'))
  }, [subjectId])

  /* ======================
     FETCH SUB-TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedTopic) {
      setSubTopics([])
      return
    }

    getSubTopicsByTopic(selectedTopic)
      .then(res => setSubTopics(res.data.data as SubTopic[]))
      .catch(() => toast.error('Failed to load sub-topics'))
  }, [selectedTopic])

  /* ======================
     SUBMIT HANDLER
  ====================== */
  const onSubmit = async (data: QuestionFormValues) => {
    if (!testId || !totalQuestions) {
      toast.error('Invalid test state')
      return
    }

    const payload: CreateQuestionPayload = {
      type: 'mcq',
      question: data.question,
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      correct_option: data.correct_option,
      explanation: data.solution,
      difficulty: data.difficulty,
      subject: String(subjectId),
      test_id: testId
    }

    try {
      await createQuestionsBulk({
        questions: [payload]
      })

      dispatch(addQuestion(payload))
      reset()

      // ✅ LAST QUESTION → AUTO STEP 3
      if (currentIndex === totalQuestions) {
        toast.success('All questions added successfully 🎉')
        dispatch(setStep(3))
        return
      }

      // ✅ NEXT QUESTION
      setCurrentIndex(prev => prev + 1)
      toast.success(`Question ${currentIndex} saved`)
    } catch {
      toast.error('Failed to save question')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white border rounded-xl p-6 max-w-7xl'
    >
      {/* -------- HEADER -------- */}
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-lg font-semibold'>Test Creation</h2>
          <p className='text-xs text-gray-500'>
            Question {currentIndex} of {totalQuestions}
          </p>
        </div>

        <button
          type='submit'
          disabled={currentIndex !== totalQuestions}
          onClick={() => setSubmitAction('publish')}
          className='px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md disabled:opacity-50'
        >
          Publish
        </button>
      </div>

      <div className='flex gap-6'>
        {/* -------- LEFT LIST -------- */}
        <aside className='w-[220px] border rounded-lg p-3 space-y-2'>
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-md text-sm border ${
                i + 1 === currentIndex
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'text-gray-400'
              }`}
            >
              Question {i + 1}
            </div>
          ))}
        </aside>

        {/* -------- MAIN FORM -------- */}
        <div className='flex-1'>
          <textarea
            {...register('question', { required: true })}
            placeholder='Type your question...'
            className='w-full h-[120px] border rounded-md px-3 py-2 mb-4'
          />

          {(['option1', 'option2', 'option3', 'option4'] as const).map(
            (opt, i) => (
              <label key={opt} className='flex gap-3 mb-3 border p-2 rounded'>
                <input
                  type='radio'
                  value={opt}
                  {...register('correct_option', { required: true })}
                />
                <input
                  {...register(opt, { required: true })}
                  placeholder={`Option ${i + 1}`}
                  className='flex-1'
                />
              </label>
            )
          )}

          <textarea
            {...register('solution')}
            placeholder='Solution (optional)'
            className='w-full h-[80px] border rounded-md px-3 py-2 my-4'
          />

          <div className='grid grid-cols-3 gap-4 mb-6'>
            <select {...register('difficulty')} className='border p-2 rounded'>
              <option value=''>Difficulty</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>

            <select {...register('topic')} className='border p-2 rounded'>
              <option value=''>Topic</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select {...register('sub_topic')} className='border p-2 rounded'>
              <option value=''>Sub Topic</option>
              {subTopics.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-between items-center'>
            <button
              type='button'
              onClick={() => dispatch(setStep(1))}
              className='px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md'
            >
              Exit Test Creation
            </button>

            <button
              type='submit'
              onClick={() => setSubmitAction('next')}
              disabled={isSubmitting}
              className='px-6 py-2 bg-blue-500 text-white rounded'
            >
              {isSubmitting ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
