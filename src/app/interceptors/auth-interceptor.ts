import { HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";


const endpoints = [
  "",
  ""
 
];



export const AuthInyterceptor: HttpInterceptorFn = (req, next) => {

    if (endpoints.some(endpoint => req.url.includes(endpoint))) {

        const usuario = sessionStorage.getItem('usuario');
        if (usuario) {
     
            const usuarioData = JSON.parse(usuario);
            const token = usuarioData.token;

            const request = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });

            return next(request);
        }
    }


    return next(req);
}