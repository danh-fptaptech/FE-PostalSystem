import { BlogItem } from '@/components/interfaces'
import { NextResponse } from 'next/server'
export async function GET(req: Request) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/Blog/all`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data:BlogItem[] = await res.json()
    if (res.ok) {
      return NextResponse.json({
        url: url,
        data: data
      })
    } else {
      return NextResponse.json({
        url: url,
        error: 'api backend error',
        status: 400
      })
    }
  } catch {
    return NextResponse.json({
      url: url,
      error: 'api backend error',
      status: 400
    })
  }
  // return NextResponse.json({ url: url });
}