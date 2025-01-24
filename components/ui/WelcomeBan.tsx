import Image from 'next/image'
import imgsrc from "../../public/NoteWise-logo.svg"
interface WelcomeBanProps{
  Welcome_to?: String
}
export default function WelcomeBan({Welcome_to}:WelcomeBanProps) {
  return (
    <div className='w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-8'>
      <Image 
        src={imgsrc} 
        alt="NoteWise Logo" 
        priority 
        className='w-12 sm:w-14 md:w-16 lg:w-[60px] h-auto'
        width={30} 
        height={30}
      /> 
      <h1 className='text-center text-3xl font-bold text-brand_secondary pt-3 sm:pt-4 md:pt-5'>
        {Welcome_to} to 
        <span className='bg-gradient-to-r from-transparent to-brand_secondary/10 rounded-xl bg-clip-content px-2'>
          NoteWise
        </span>
      </h1>
    </div>
  )
}
