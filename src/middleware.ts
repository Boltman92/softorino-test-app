import { NextRequest, NextResponse } from "next/server"

 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const token = request.cookies.get('token')?.value || '';

   
   if(path === '/projects'){
    if(token){
      return
    }
    return NextResponse.redirect(new URL('/login', request.nextUrl))
   } 

   if(path === '/') {
    if(token){
      return NextResponse.redirect(new URL('/projects', request.nextUrl))
    }
    return NextResponse.redirect(new URL('/login', request.nextUrl))
   }

   if(path === '/signup'){
    if(token){
      return NextResponse.redirect(new URL('/projects', request.nextUrl))
    }
   }

    
}

export const config = {
  matcher: ['/', '/login', '/projects', '/signup'],
}