import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Auth Error</h1>
        <p className="text-xl text-gray-700 mb-8">Something went wrong with authentication</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
