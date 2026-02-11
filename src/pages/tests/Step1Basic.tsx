import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  setBasicDetails,
  setNoOfQuestions,
  setStep,
  setSubjectId,
  setTestId,
  type TestDetails
} from '../../store/slice/createTest.slice'
import {
  createTest,
  getAllSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic,
  updateTest
} from '../../api/test.api'
import MultiSelectDropdown from '../../components/MultiSelectDropdown'
import toast from 'react-hot-toast'

/* ======================
   TYPES
====================== */

interface Subject {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
  subject_id: string
}

interface SubTopic {
  id: string
  name: string
  topic_id: string
}

interface Step1FormValues {
  name: string
  subject: string
  topics: string[]
  subTopics: string[]
  duration: string
  difficulty: 'easy' | 'medium' | 'difficult'
  correct: string
  wrong: string
  unattempt: string
  totalQuestions: string
}
interface RootState {
  createTest: {
    testId: string
    noOfQuestions: number
    subjectId: string
    getById: TestDetails | null
  }
}

export default function Step1Basic ({ mode }: { mode?: string }) {
  const TestGetById = useSelector((s: RootState) => s.createTest.getById)

  const dispatch = useDispatch()

  const { register, handleSubmit, watch, control, reset, setValue } =
    useForm<Step1FormValues>({
      defaultValues: {
        topics: [],
        subTopics: []
      }
    })

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])

  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [subTopicsLoading, setSubTopicsLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectedSubject = watch('subject')
  const selectedTopics = watch('topics')
  const correctMarks = watch('correct')
  const totalQuestions = watch('totalQuestions')

  /* ======================
     FETCH SUBJECTS
  ====================== */
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true)
        const res = await getAllSubjects()
        setSubjects(res.data.data)
      } catch (err) {
        console.error('Subjects error', err)
      } finally {
        setSubjectsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  /* ======================
   EDIT PREFILL
====================== */
  useEffect(() => {
    if (mode === 'edit' && TestGetById?.id) {
      // normalize difficulty
      const normalizeDifficulty = (
        value: string
      ): 'easy' | 'medium' | 'difficult' | undefined => {
        if (value === 'hard') return 'difficult'
        if (value === 'easy') return 'easy'
        if (value === 'medium') return 'medium'
        return undefined
      }

      reset({
        name: TestGetById.name,
        difficulty: normalizeDifficulty(TestGetById.difficulty),
        correct: String(TestGetById.correct_marks),
        wrong: String(TestGetById.wrong_marks),
        unattempt: String(TestGetById.unattempt_marks),
        totalQuestions: String(TestGetById.total_questions),
        duration: String(TestGetById.total_time),
        topics: [],
        subTopics: []
      })
    }
  }, [mode, TestGetById, reset])

  /* ======================
     MAP SUBJECT NAME → ID
  ====================== */
  useEffect(() => {
    if (mode === 'edit' && TestGetById?.subject && subjects.length) {
      const matched = subjects.find(s => s.name === TestGetById.subject)
      if (matched) {
        setValue('subject', matched.id)
      }
    }
  }, [subjects, mode, TestGetById, setValue])

  /* ======================
     FETCH TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedSubject) {
      setTopics([])
      return
    }

    const fetchTopics = async () => {
      try {
        setTopicsLoading(true)
        const res = await getTopicsBySubject(selectedSubject)
        setTopics(res.data.data)
      } catch (err) {
        console.error('Topics error', err)
      } finally {
        setTopicsLoading(false)
      }
    }

    fetchTopics()
  }, [selectedSubject])

  /* ======================
     MAP TOPIC NAME → IDS
  ====================== */
  useEffect(() => {
    if (mode === 'edit' && topics.length && TestGetById?.topics) {
      const matchedIds = topics
        .filter(t => TestGetById.topics.includes(t.name))
        .map(t => t.id)

      setValue('topics', matchedIds)
    }
  }, [topics, mode, TestGetById, setValue])

  /* ======================
     FETCH SUB TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0) {
      setSubTopics([])
      return
    }

    const fetchSubTopics = async () => {
      try {
        setSubTopicsLoading(true)

        const responses = await Promise.all(
          selectedTopics.map(id => getSubTopicsByTopic(id))
        )

        const merged = responses.flatMap(r => r.data.data)
        setSubTopics(merged)
      } catch (err) {
        console.error('Sub-topics error', err)
      } finally {
        setSubTopicsLoading(false)
      }
    }

    fetchSubTopics()
  }, [selectedTopics])

  /* ======================
     MAP SUBTOPIC NAME → IDS
  ====================== */
  useEffect(() => {
    if (mode === 'edit' && subTopics.length && TestGetById?.sub_topics) {
      const matchedIds = subTopics
        .filter(st => TestGetById.sub_topics.includes(st.name))
        .map(st => st.id)

      setValue('subTopics', matchedIds)
    }
  }, [subTopics, mode, TestGetById, setValue])

  /* ======================
     SUBMIT
  ====================== */
  const onSubmit = async (data: Step1FormValues) => {
    try {
      setLoading(true)

      const total_marks = Number(data.totalQuestions) * Number(data.correct)

      const payload = {
        name: data.name,
        subject: data.subject,
        topics: data.topics,
        sub_topics: data.subTopics,
        difficulty: data.difficulty,
        correct_marks: Number(data.correct),
        wrong_marks: Number(data.wrong),
        unattempt_marks: Number(data.unattempt),
        total_questions: Number(data.totalQuestions),
        total_marks,
        total_time: Number(data.duration),
        status: 'draft' as const,
        type: 'chapterwise' as const
      }

      const res =
        mode === 'edit'
          ? await updateTest(TestGetById?.id as string, payload)
          : await createTest(payload)

      if (res?.data?.status === 'success') {
        toast.success(
          mode === 'edit'
            ? 'Test updated successfully 🎉'
            : 'Test created successfully 🎉'
        )

        dispatch(setTestId(res.data.data.id))
        dispatch(setNoOfQuestions(Number(res.data.data.total_questions)))
        dispatch(setBasicDetails(res.data))
        dispatch(setSubjectId(data.subject))
        dispatch(setStep(2))
      }
    } catch (err) {
      console.error('Test failed', err)
      toast.error('Failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white border rounded-xl p-6 max-w-6xl'
    >
      {/* -------- Tabs -------- */}
      <div className='flex gap-2 mb-6'>
        {[
          'Chapter Wise',
          'PYQ',
          'Mock Test',
          'Daily Challenge',
          'Uncategorized'
        ].map((tab, i) => (
          <button
            key={tab}
            type='button'
            className={`px-4 py-1.5 rounded-full text-sm border ${
              i === 0
                ? 'bg-blue-50 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-2 gap-x-6 gap-y-5'>
        {/* Subject */}
        <div>
          <label className='text-sm font-medium'>Subject</label>
          <select
            {...register('subject', { required: true })}
            disabled={subjectsLoading}
            className='mt-1 w-full h-[40px] border rounded-md px-3 text-sm'
          >
            <option value=''>
              {subjectsLoading
                ? 'Loading subjects...'
                : 'Choose from Drop-down'}
            </option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className='text-sm font-medium'>Name of Test</label>
          <input
            {...register('name', { required: true })}
            placeholder='Enter name of Test'
            className='mt-1 w-full h-[40px] border rounded-md px-3 text-sm'
          />
        </div>

        {/* Topics */}
        <div>
          <label className='text-sm font-medium'>Topics</label>
          <Controller
            control={control}
            name='topics'
            render={({ field }) => (
              <MultiSelectDropdown
                options={topics.map(t => ({
                  label: t.name,
                  value: t.id
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  topicsLoading ? 'Loading topics...' : 'Select Topics'
                }
                disabled={!topics.length || topicsLoading}
              />
            )}
          />
        </div>

        {/* Sub Topics */}
        <div>
          <label className='text-sm font-medium'>Sub Topics</label>
          <Controller
            control={control}
            name='subTopics'
            render={({ field }) => (
              <MultiSelectDropdown
                options={subTopics.map(st => ({
                  label: st.name,
                  value: st.id
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  subTopicsLoading
                    ? 'Loading Sub Topics...'
                    : 'Select Sub Topics'
                }
                disabled={!subTopics.length || subTopicsLoading}
              />
            )}
          />
        </div>

        <div>
          <label className='text-sm font-medium'>Duration (Minutes)</label>
          <input
            {...register('duration')}
            className='mt-1 w-full h-[40px] border rounded-md px-3 text-sm'
          />
        </div>

        <div>
          <label className='text-sm font-medium block mb-2'>
            Test Difficulty Level
          </label>
          <div className='flex gap-6 mt-1'>
            {['easy', 'medium', 'difficult'].map(level => (
              <label key={level} className='flex items-center gap-2 text-sm'>
                <input
                  type='radio'
                  value={level}
                  {...register('difficulty', { required: true })}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='text-sm font-medium mb-4'>Marking Scheme:</h3>

        <div className='grid grid-cols-5 gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Wrong Answer</label>
            <input
              type='number'
              {...register('wrong')}
              defaultValue='-1'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Unattempted</label>
            <input
              type='number'
              {...register('unattempt')}
              defaultValue='0'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Correct Answer</label>
            <input
              type='number'
              {...register('correct')}
              defaultValue='5'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>No of Questions</label>
            <input
              type='number'
              {...register('totalQuestions', { required: true })}
              placeholder='Ex: 50'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Total Marks</label>
            <input
              readOnly
              value={Number(totalQuestions || 0) * Number(correctMarks || 0)}
              className='h-[40px] border rounded-md px-3 text-sm bg-gray-50 text-gray-500'
            />
          </div>
        </div>
      </div>

      <div className='flex justify-end mt-8'>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60'
        >
          {loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : 'Next'}
        </button>
      </div>
    </form>
  )
}
