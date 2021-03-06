import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from '../../models/article.model';
import { ArticlesService } from '../../services/articles.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/store';
import { tap, filter, first } from 'rxjs/operators';
import { ArticlesSelectors, ArticlesActions } from '@app/articles/store';

@Injectable()
export class ArticleDetailsResolver implements Resolve<Article> {
  constructor(
    private articlesService: ArticlesService,
    private store: Store<AppState.State>
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Article> {
    const id = route.params['id'];

    return this.store
      .pipe(select(ArticlesSelectors.selectArticleById(id)))
      .pipe(
        tap((article: Article) => {
          if (!article) {
            this.store.dispatch(
              ArticlesActions.loadArticleRequested({ articleId: id })
            );
          }
        })
      ) // If article doesn't exist in store, call service
      .pipe(filter(article => !!article)) // Only emit if article exists
      .pipe(first()); // Terminate observable on first value
  }
}
