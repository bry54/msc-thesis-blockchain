import Image from 'next/image';

export default function AuthLayout(
  { children } : { children: React.ReactNode}
) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      { children }
    </div>
  )
}