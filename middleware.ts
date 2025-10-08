import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/tenders")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/opportunities")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/documents")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/reports")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/contracts")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/projects")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if already logged in
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
