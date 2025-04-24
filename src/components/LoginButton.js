'use client'

import { signIn } from 'next-auth/react'

export default function LoginButton() {
  return (
    <button 
      onClick={() => signIn('google', { callbackUrl: '/dashboards' })}
      className="flex items-center justify-center gap-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 px-6 py-3 rounded-lg text-lg font-medium min-w-[280px] relative overflow-hidden group"
      style={{
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Blue accent on hover */}
      <div className="absolute inset-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 left-0 transition-opacity" />
      
      {/* Google Logo */}
      <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-full p-1 shadow-sm">
        <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.8771 8.03507H9.62148V11.8525H14.3835C14.0871 14.0025 12.1926 15.1373 9.6835 15.1373C6.5865 15.1373 4.228 12.8014 4.228 9.68239C4.228 6.60764 6.5285 4.22746 9.6835 4.22746C11.3218 4.22746 12.4556 4.86957 13.1538 5.5117L16.0935 2.60732C14.4553 1.06674 12.3444 0.133362 9.62148 0.133362C4.28587 0.133362 0 4.36514 0 9.68239C0 15.0541 4.28587 19.2315 9.62148 19.2315C14.4552 19.2315 18.5173 16.1293 18.5173 9.68239C18.5173 9.17088 18.4593 8.60282 18.3771 8.03507H17.8771Z" fill="#4285F4"/>
          <path d="M1.37146 5.20197L4.72303 7.59374C5.65497 5.61926 7.52242 4.22747 9.68348 4.22747C11.3217 4.22747 12.4556 4.86958 13.1537 5.51171L16.0935 2.60733C14.4553 1.06676 12.3444 0.133377 9.62146 0.133377C6.06195 0.133377 2.99301 2.17617 1.37146 5.20197Z" fill="#EA4335"/>
          <path d="M9.7415 19.2315C12.3224 19.2315 14.6914 18.5353 16.0934 17.6619L12.8079 14.9456C11.8179 15.614 10.8859 16.1373 9.7415 16.1373C7.23242 16.1373 5.0654 14.3767 4.3092 12.1686L0.895996 14.7786C2.49942 17.4368 5.91836 19.2315 9.7415 19.2315Z" fill="#34A853"/>
          <path d="M18.5173 9.68239C18.5173 9.17088 18.4593 8.60282 18.3771 8.03507H9.62148V11.8525H14.3835C14.2433 12.8871 13.7271 13.7025 12.8659 14.9456L16.0934 17.6619C17.8336 15.9595 18.5173 13.1353 18.5173 9.68239Z" fill="#4285F4"/>
          <path d="M4.3092 12.1685C4.1109 11.5264 4.00269 10.84 4.00269 10.1316C4.00269 9.42318 4.1109 8.73678 4.29102 8.09467L0.877823 5.48467C0.32051 6.93384 0 8.4966 0 10.1316C0 11.7666 0.32051 13.3293 0.895996 14.7785L4.3092 12.1685Z" fill="#FBBC05"/>
        </svg>
      </div>
      
      {/* Text */}
      <span className="text-gray-700 dark:text-white font-semibold tracking-wide">
        Login with Google
      </span>
      
      {/* Arrow indicator on hover */}
      <div className="absolute right-4 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.4697 8.53033C13.1768 8.23744 13.1768 7.76256 13.4697 7.46967C13.7626 7.17678 14.2374 7.17678 14.5303 7.46967L18.5303 11.4697C18.8232 11.7626 18.8232 12.2374 18.5303 12.5303L14.5303 16.5303C14.2374 16.8232 13.7626 16.8232 13.4697 16.5303C13.1768 16.2374 13.1768 15.7626 13.4697 15.4697L16.1893 12.75H6.75C6.33579 12.75 6 12.4142 6 12C6 11.5858 6.33579 11.25 6.75 11.25H16.1893L13.4697 8.53033Z" fill="#4285F4"/>
        </svg>
      </div>
    </button>
  )
} 