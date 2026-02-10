import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addQuestion, setStep } from '../../store/slice/createTest.slice'
import { createQuestionsBulk } from '../../api/test.api'

export default function Step2Questions () {
  const dispatch = useDispatch()
  const testId = useSelector((s: any) => s.createTest.testId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm()

  /* ======================
     SUBMIT QUESTION
  ====================== */
  const onSubmit = async (data: any) => {
    if (!testId) {
      alert('Test ID missing. Please go back to Step 1.')
      return
    }

    const questionPayload = {
      type: 'mcq',
      question: data.question,
      option1: data.option1,
      option2: data.option2,
      option3: data.option3,
      option4: data.option4,
      correct_option: data.correct_option,
      explanation: data.solution,
      difficulty: data.difficulty,
      topic: data.topic,
      sub_topic: data.sub_topic,
      test_id: testId
    }

    try {
      // 🔹 API CALL (MANDATORY)
      await createQuestionsBulk({
        questions: [questionPayload],
      });

      // 🔹 Save locally for preview
      dispatch(addQuestion(questionPayload));

      // 🔹 Reset form for next question
      reset();

      // 🔹 Move to confirmation screen
      dispatch(setStep(3))
    } catch (err) {
      console.error('Question creation failed', err)
      alert('Failed to add question')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white border rounded-xl p-6 max-w-7xl'
    >
      {/* -------- TOP HEADER -------- */}
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-lg font-semibold'>Test Creation</h2>
          <p className='text-xs text-gray-500'>
            Chapter Wise / Question Creation
          </p>
        </div>

        <button
          type='button'
          className='px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md'
        >
          Publish
        </button>
      </div>

      <div className='flex gap-6'>
        {/* -------- LEFT QUESTION LIST -------- */}
        <aside className='w-[220px] border rounded-lg p-3 space-y-2'>
          {['Question 1', 'Question 2', 'Question 3', 'Question 4'].map(
            (q, i) => (
              <div
                key={q}
                className={`px-3 py-2 rounded-md text-sm cursor-pointer ${
                  i === 0
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-500 border'
                }`}
              >
                {q}
              </div>
            )
          )}
        </aside>

        {/* -------- MAIN QUESTION AREA -------- */}
        <div className='flex-1'>
          {/* Meta Info */}
          <div className='flex justify-between items-center mb-4'>
            <div className='flex gap-3 text-xs'>
              <span className='px-2 py-1 rounded bg-blue-50 text-blue-600'>
                Chapter 1
              </span>
              <span className='px-2 py-1 rounded bg-green-50 text-green-600'>
                Easy
              </span>
            </div>

            <div className='flex gap-4 text-xs text-gray-500'>
              <span>20 Min</span>
              <span>50 Qs</span>
              <span>250 Marks</span>
            </div>
          </div>

          {/* Question */}
          <div className='border rounded-lg p-4 mb-4'>
            <label className='text-sm font-medium mb-1 block'>
              Question <span className='text-red-500'>*</span>
            </label>
            <textarea
              {...register('question', { required: true })}
              placeholder='Type your question here...'
              className='w-full h-[120px] border rounded-md px-3 py-2 text-sm'
            />
          </div>

          {/* Options */}
          <div className='mb-4'>
            <p className='text-sm font-medium mb-2'>Type the options below</p>

            <div className='space-y-3'>
              {['option1', 'option2', 'option3', 'option4'].map((opt, i) => (
                <label
                  key={opt}
                  className='flex items-center gap-3 border rounded-md px-3 py-2'
                >
                  <input
                    type='radio'
                    value={opt}
                    {...register('correct_option', { required: true })}
                  />
                  <input
                    {...register(opt, { required: true })}
                    placeholder={`Type Option ${i + 1} here`}
                    className='flex-1 text-sm outline-none'
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className='mb-4'>
            <label className='text-sm font-medium block mb-1'>
              Add Solution
            </label>
            <textarea
              {...register('solution')}
              placeholder='Type solution here...'
              className='w-full h-[80px] border rounded-md px-3 py-2 text-sm'
            />
          </div>

          {/* Question Settings */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div>
              <label className='text-xs text-gray-500'>
                Level of Difficulty
              </label>
              <select
                {...register('difficulty')}
                className='w-full h-[36px] border rounded-md px-2 text-sm'
              >
                <option value=''>Select</option>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
            </div>

            <div>
              <label className='text-xs text-gray-500'>Topic</label>
              <input
                {...register('topic')}
                className='w-full h-[36px] border rounded-md px-2 text-sm'
              />
            </div>

            <div>
              <label className='text-xs text-gray-500'>Sub-topic</label>
              <input
                {...register('sub_topic')}
                className='w-full h-[36px] border rounded-md px-2 text-sm'
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className='flex justify-between items-center'>
            <button
              type='button'
              className='px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md'
            >
              Exit Test Creation
            </button>

            <div className='flex gap-3'>
              <button
                type='button'
                className='px-4 py-2 text-sm border rounded-md'
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className='px-6 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-60'
              >
                {isSubmitting ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
