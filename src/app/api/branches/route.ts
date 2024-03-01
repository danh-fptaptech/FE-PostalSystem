import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  try {
    const response = await fetch('http://localhost:5255/api/Branch/all', {
      cache: 'no-store'
    })
    const data = await response.json()
    return NextResponse.json({ branchs: data })
  } catch (error) {
    return NextResponse.json({ error: 'api backend error' })
  }
}