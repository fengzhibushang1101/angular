import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES} from './mock-heros';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    private heroesUrl = 'api/heroes';  // URL to web api

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    getHeroes(): Observable<Hero[]> {
        this.log('fetched heroes');
        return this.http.get<Hero[]>(this.heroesUrl).pipe(
            tap(heroes => this.log('fetched heroes')),
            catchError(this.handleError('getHeroes', []))
        );
    }

    getHero(id: number): Observable<Hero> {
        // TODO: send the message _after_ fetching the hero
        // this.messageService.add(`HeroService: fetched hero id=${id}`);
        // this.log(`fetch hero id=${ id }`);
        // return of(HEROES.find(hero => hero.id === id));
        const url = `${ this.heroesUrl }/${ id }`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id = ${ id }`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    updateHero(hero: Hero): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }

    addHero(hero: Hero): Observable<Hero> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post(this.heroesUrl, hero, httpOptions).pipe(
            tap((newHero: Hero) => this.log(`added hero w/ id=${ newHero.id }`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }

    private log(message: string): void {
        this.messageService.add(`HeroService: ${ message }`);
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
