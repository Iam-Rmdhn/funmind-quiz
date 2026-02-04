import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
      {/* Left Pane: Visual Hook */}
      <div className="bg-secondary relative hidden items-center justify-center overflow-hidden lg:flex lg:w-1/2">
        {/* Background Decor */}
        <div
          className="absolute top-0 left-0 h-full w-full opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(#ffffff 20%, transparent 20%), radial-gradient(#ffffff 20%, transparent 20%)',
            backgroundPosition: '0 0, 50px 50px',
            backgroundSize: '100px 100px',
          }}
        ></div>

        {/* Large White Cloud Shape Separator */}
        <div
          className="absolute top-0 right-0 bottom-0 w-24 bg-white"
          style={{
            clipPath: 'ellipse(60% 100% at 70% 50%)',
            transform: 'translateX(50%)',
            zIndex: 10,
          }}
        ></div>

        <div className="relative z-10 flex max-w-lg flex-col items-center p-10 text-center">
          <h2 className="mb-8 text-4xl font-black tracking-tight text-white drop-shadow-md lg:text-5xl">
            Learning made <span className="text-accent">fun!</span>
          </h2>

          <div
            className="aspect-square w-full max-w-[400px] rounded-xl bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/element/login_illus.webp')",
              scale: '1.5',
            }}
          ></div>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto bg-white lg:w-1/2">
        <div className="w-full max-w-md px-6 py-8 md:px-8">
          <LoginForm />
          {/* Simple Footer Links */}
          <div className="mt-8 py-4 text-center text-xs text-gray-400">
            <a className="mx-2 transition-colors hover:text-gray-600" href="#">
              Privacy Policy
            </a>{' '}
            •
            <a className="mx-2 transition-colors hover:text-gray-600" href="#">
              Terms of Use
            </a>{' '}
            •
            <a className="mx-2 transition-colors hover:text-gray-600" href="#">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
