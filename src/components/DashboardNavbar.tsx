import userAvatar from '../assets/user.png'

export default function DashboardNavbar () {
  return (
    <div className='h-[64px] bg-white border-b flex items-center justify-between px-6'>
      <div className='text-sm text-gray-600'>
        <span className='text-gray-400'>Test Creation</span>
        <span className='mx-2'>/</span>
        <span className='font-medium text-gray-900'>Dashboard</span>
      </div>

      <div className='flex items-center gap-3'>
        <img src={userAvatar} alt='user' className='w-8 h-8 rounded-full' />
        <span className='text-sm font-medium'>Alex Wando</span>
      </div>
    </div>
  )
}
