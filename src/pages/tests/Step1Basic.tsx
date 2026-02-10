import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import {
  setBasicDetails,
  setNoOfQuestions,
  setStep,
  setSubjectId,
  setTestId
} from '../../store/slice/createTest.slice'
import {
  createTest,
  getAllSubjects,
  getTopicsBySubject,
  getSubTopicsByTopic
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

export default function Step1Basic () {
  const dispatch = useDispatch()

  const { register, handleSubmit, watch, control } = useForm<Step1FormValues>({
    defaultValues: {
      topics: [],
      subTopics: []
    }
  })

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subTopics, setSubTopics] = useState<SubTopic[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const selectedSubject = watch('subject')
  const selectedTopics = watch('topics')
  const correctMarks = watch('correct')
  const totalQuestions = watch('totalQuestions')

  /* ======================
     FETCH SUBJECTS
  ====================== */
  useEffect(() => {
    getAllSubjects()
      .then(res => setSubjects(res.data.data))
      .catch(err => console.error('Subjects error', err))
  }, [])

  /* ======================
     FETCH TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedSubject) {
      setTopics([])
      return
    }

    getTopicsBySubject(selectedSubject)
      .then(res => setTopics(res.data.data))
      .catch(err => console.error('Topics error', err))
  }, [selectedSubject])

  /* ======================
     FETCH SUB TOPICS
  ====================== */
  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0) {
      setSubTopics([])
      return
    }

    Promise.all(selectedTopics.map(id => getSubTopicsByTopic(id)))
      .then(responses => {
        const merged = responses.flatMap(r => r.data.data)
        setSubTopics(merged)
      })
      .catch(err => console.error('Sub-topics error', err))
  }, [selectedTopics])

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

      const res = await createTest(payload)
      console.log('Test created:', res.data)

      if (res?.data?.status === 'success') {
        toast.success('Test created successfully 🎉')
        dispatch(setTestId(res.data.data.id))
        dispatch(setNoOfQuestions(Number(res.data.data.total_questions)))
        dispatch(setBasicDetails(res.data))
        dispatch(setSubjectId(data.subject))
        dispatch(setStep(2))
      }
    } catch (err) {
      console.error('Test creation failed', err)
      toast.error('Failed to create test. Please try again.')
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

      {/* -------- Form Grid -------- */}
      <div className='grid grid-cols-2 gap-x-6 gap-y-5'>
        {/* Subject */}
        <div>
          <label className='text-sm font-medium'>Subject</label>
          <select
            {...register('subject', { required: true })}
            className='mt-1 w-full h-[40px] border rounded-md px-3 text-sm'
          >
            <option value=''>Choose from Drop-down</option>
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

        {/* Topics (MULTI DROPDOWN) */}
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
                placeholder='Select Topics'
                disabled={!topics.length}
              />
            )}
          />
        </div>

        {/* Sub Topics (MULTI DROPDOWN) */}
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
                placeholder='Select Sub Topics'
                disabled={!subTopics.length}
              />
            )}
          />
        </div>

        {/* Duration */}
        <div>
          <label className='text-sm font-medium'>Duration (Minutes)</label>
          <input
            {...register('duration')}
            className='mt-1 w-full h-[40px] border rounded-md px-3 text-sm'
          />
        </div>

        {/* Difficulty */}
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

      {/* -------- Marking Scheme -------- */}
      <div className='mt-6'>
        <h3 className='text-sm font-medium mb-4'>Marking Scheme:</h3>

        <div className='grid grid-cols-5 gap-4'>
          {/* Wrong Answer */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Wrong Answer</label>
            <input
              type='number'
              {...register('wrong')}
              defaultValue='-1'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          {/* Unattempted */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Unattempted</label>
            <input
              type='number'
              {...register('unattempt')}
              defaultValue='0'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          {/* Correct Answer */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>Correct Answer</label>
            <input
              type='number'
              {...register('correct')}
              defaultValue='5'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          {/* No of Questions */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs text-gray-600'>No of Questions</label>
            <input
              type='number'
              {...register('totalQuestions', { required: true })}
              placeholder='Ex: 50'
              className='h-[40px] border rounded-md px-3 text-sm'
            />
          </div>

          {/* Total Marks (AUTO) */}
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

      {/* -------- Footer -------- */}
      <div className='flex justify-end mt-8'>
        <button
          type='submit'
          disabled={loading}
          className='px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60'
        >
          {loading ? 'Creating...' : 'Next'}
        </button>
      </div>
    </form>
  )
}
