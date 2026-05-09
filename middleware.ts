import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require an authenticated user.
const PROTECTED = [
  "/dashboard",
  "/profile",
  "/flashcards",
  "/lessons",
  "/vocabulary",
  "/quizzes",
  "/exam-prep",
];

// Routes that should be inaccessible while signed in (auth pages).
const AUTH_ONLY_GUEST = ["/login", "/register"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminProtected = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isProtected = startsWithAny(pathname, PROTECTED);
  const isAuthGuest = startsWithAny(pathname, AUTH_ONLY_GUEST);

  if (!isAdminProtected && !isProtected && !isAuthGuest) {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Without Supabase configured, only block /admin (where we can't verify role).
    if (isAdminProtected) return NextResponse.redirect(new URL("/admin/login?reason=unconfigured", req.url));
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in → bounce off /login and /register.
  if (isAuthGuest && user) {
    const next = req.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/dashboard", req.url));
  }

  // Protected app pages → require auth.
  if (isProtected && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin/* → require auth + admin role.
  if (isAdminProtected) {
    if (!user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL("/admin/login?reason=forbidden", req.url));
    }

    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Referrer-Policy", "no-referrer");
  }

  return res;
}

export const config = {
  // Match only the routes we care about. Everything else short-circuits without
  // running middleware, keeping public pages fast.
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/flashcards/:path*",
    "/lessons/:path*",
    "/vocabulary/:path*",
    "/quizzes/:path*",
    "/exam-prep/:path*",
    "/login",
    "/register",
  ],
};
