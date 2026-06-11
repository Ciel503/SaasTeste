import { auth } from "./auth";

export default auth((req) => {
  // Se o usuário tentar acessar /adm e não houver req.auth (sessão), redireciona
  if (!req.auth && req.nextUrl.pathname.startsWith("/adm")) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/adm/:path*"],
};