import logo from '../assets/logo.png'


const DashboardSideBar = () => {
  return (
    <div className='w-[240px] bg-white border-r px-4 py-6'>
      <img
        src={logo}
        alt='PrepRoute'
        className='w-[110px] mb-8 select-none'
        draggable={false}
      />

      <ul className='space-y-4 text-sm'>
        <li className='font-medium text-blue-600'>Test Creation</li>
        <li className='text-gray-500 hover:text-gray-700 cursor-pointer'>
          Dashboard
        </li>
        <li className='text-gray-500 hover:text-gray-700 cursor-pointer'>
          Users
        </li>
        <li className='text-gray-500 hover:text-gray-700 cursor-pointer'>
          Settings
        </li>
      </ul>
    </div>
  )
}

export default DashboardSideBar
