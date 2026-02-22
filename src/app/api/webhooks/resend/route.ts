import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Resend webhook
    console.log("Resend webhook received:", body)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend webhook error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
