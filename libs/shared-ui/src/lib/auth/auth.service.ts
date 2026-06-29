import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

export interface CurrentUser {
  isAuthenticated: boolean;
  id: string;
  userName: string;
  name?: string;
  surName?: string;
  email?: string;
}

export interface AbpApplicationConfiguration {
  currentUser: CurrentUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public loadCurrentUser() {
    return this.http.get<AbpApplicationConfiguration>('https://localhost:44317/api/abp/application-configuration', { withCredentials: true })
      .pipe(
        tap(config => {
          if (config.currentUser && config.currentUser.isAuthenticated) {
            this.currentUserSubject.next(config.currentUser);
            localStorage.setItem('isAuthenticated', 'true');
          } else {
            this.currentUserSubject.next(null);
            localStorage.removeItem('isAuthenticated');
          }
        })
      );
  }

  public getCurrentUserValue(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: CurrentUser | null) {
    this.currentUserSubject.next(user);
    if (user && user.isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    }
  }
}
