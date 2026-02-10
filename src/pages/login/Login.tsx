import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import loginBG from '../../assets/loginBG.png'
import logo from '../../assets/logo.png'

import { useNavigate } from 'react-router-dom'
import { loginApi } from '../../api/auth.api'
import { loginSuccess } from '../../store/slice/auth.slice'
import toast from 'react-hot-toast'

const schema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().required('Password is required')
})

interface LoginForm {
  userId: string
  password: string
}

export default function Login () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginApi(data)
      console.log('Login successful:', res.data)
      if (res?.data?.status === 'success') {
        dispatch(loginSuccess(res.data.data.token))
        navigate('/dashboard')
        toast.success('Login successful 🎉')
      }
      dispatch(loginSuccess(res.data.data.token))
      // navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please check your credentials and try again.')
    }
  }

  return (
    <div className='min-h-screen flex bg-blue-50'>
      <div className='hidden lg:flex w-1/2 items-center justify-center'>
        <img
          src={loginBG}
          alt='Login Illustration'
          className='w-[520px] select-none'
          draggable={false}
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center'>
        <div className='h-[94%] w-[92%] rounded-xl border border-[#CFE0FF] bg-white flex items-center justify-center'>
          <div className='w-full max-w-[420px] px-2'>
            <div className='mb-2'>
              <img
                src={logo}
                alt='Login Illustration'
                className='w-[100px] select-none'
                draggable={false}
              />
            </div>

            <h2 className='text-[18px] font-medium text-[#111827] mb-1'>
              Login
            </h2>
            <p className='text-[14px] text-[#6B7280] mb-8'>
              Use your company provided Login credentials
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div>
                <label className='block text-[14px] font-medium text-[#374151] mb-1'>
                  User ID
                </label>
                <input
                  {...register('userId')}
                  placeholder='Enter User ID'
                  className='w-full h-[44px] rounded-md border border-[#D1D5DB] px-3 text-[14px]
                         focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-transparent'
                />
                {errors.userId && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.userId.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-[14px] font-medium text-[#374151] mb-1'>
                  Password
                </label>
                <input
                  {...register('password')}
                  type='password'
                  placeholder='Enter Password'
                  className='w-full h-[44px] rounded-md border border-[#D1D5DB] px-3 text-[14px]
                         focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-transparent'
                />
                {errors.password && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type='button'
                  className='text-[14px] text-[#2563EB] hover:underline'
                >
                  Forgot password?
                </button>
              </div>

              <button
                disabled={isSubmitting}
                className='w-full h-[44px] rounded-md bg-[#5B8DEF] text-white text-[15px] font-medium
                       hover:bg-[#4A7FE5] transition disabled:opacity-60'
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
