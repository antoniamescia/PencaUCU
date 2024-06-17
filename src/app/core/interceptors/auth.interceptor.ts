import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("id_token");

    // Clone the request to add the new header.
    const authReq = token
      ? req.clone({
          headers: req.headers.set("Authorization", `Bearer ${token}`),
        })
      : req;

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
