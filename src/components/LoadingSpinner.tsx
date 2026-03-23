'use client'

export default function LoadingSpinner({ message = "Loading experience..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
        
        {/* Inner ring - faster spin */}
        <div 
          className="absolute w-14 h-14 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" 
          style={{ animationDuration: '0.9s' }}
        ></div>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-xl font-semibold text-gray-900 tracking-tight">
          {message}
        </p>
        <p className="mt-3 text-gray-500 text-sm max-w-[240px]">
          Please wait while we fetch the latest data from our database
        </p>
      </div>
    </div>
  )
}
