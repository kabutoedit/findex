import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
	const token = request.cookies.get('auth')?.value

	if (!token && request.nextUrl.pathname !== '/login') {
		return NextResponse.redirect(new URL('/login', request.url))
	}
}

export const config = {
	matcher: ['/((?!_next|favicon.ico).*)'],
}
