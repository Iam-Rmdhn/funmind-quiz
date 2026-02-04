import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Left Pane: Visual Hook */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative items-center justify-center overflow-hidden">
        {/* Background Decor */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#ffffff 20%, transparent 20%), radial-gradient(#ffffff 20%, transparent 20%)', 
            backgroundPosition: '0 0, 50px 50px', 
            backgroundSize: '100px 100px' 
          }}
        ></div>
        
        {/* Large White Cloud Shape Separator */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-24 bg-white" 
          style={{ 
            clipPath: 'ellipse(60% 100% at 70% 50%)', 
            transform: 'translateX(50%)', 
            zIndex: 10 
          }}
        ></div>
        
        <div className="relative z-10 p-10 flex flex-col items-center text-center max-w-lg">
          <h2 className="text-white text-4xl lg:text-5xl font-black tracking-tight mb-8 drop-shadow-md">
            Learning made <span className="text-accent">fun!</span>
          </h2>
          
          <div 
            className="w-full aspect-square max-w-[400px] bg-contain bg-center bg-no-repeat rounded-xl" 
            style={{ 
              backgroundImage: "url('/assets/element/login_illus.webp')",
              scale: "1.5" 
            }}
          ></div>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto relative min-h-screen justify-center items-center">
        <div className="w-full max-w-md px-6 py-8 md:px-8">
          <LoginForm />
          {/* Simple Footer Links */}
          <div className="py-4 text-center text-xs text-gray-400 mt-8">
            <a className="hover:text-gray-600 mx-2 transition-colors" href="#">Privacy Policy</a> • 
            <a className="hover:text-gray-600 mx-2 transition-colors" href="#">Terms of Use</a> • 
            <a className="hover:text-gray-600 mx-2 transition-colors" href="#">Help</a>
          </div>
        </div>
      </div>
    </div>
  )
}
