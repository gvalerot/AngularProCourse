import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Store } from '../../../store';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null | undefined>= new BehaviorSubject<User | null | undefined>(undefined);

  constructor(private auth: Auth, private store: Store) {
    // this.auth.authStateReady().then(() => {
    //   const user = this.auth.currentUser;
    //   this.store.set('user', user ? user : undefined);
    // });

    onAuthStateChanged(this.auth, (user) => {
      this.store.set('user', user);
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<any> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = userCredential.user;
    this.store.set('user', user);
    this.userSubject.next(user);
  }

  async logout(): Promise<any> {
    await signOut(this.auth);
    this.store.set('user', null);
    this.userSubject.next(null);
  }

  get user$() {
    return this.userSubject.asObservable();
  }

  async createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async waitForAuthState() {
    return this.auth.authStateReady;
  }

  get user(){
    return this.auth.currentUser;
  }
}
