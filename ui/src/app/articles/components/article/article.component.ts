import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Article } from '../../models/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Output() edit = new EventEmitter<Article>();
  @Output() delete = new EventEmitter<Article>();

  constructor() { }

  ngOnInit() {
  }

  editArticle() {
    this.edit.emit(this.article);
  }

  deleteArticle() {
    this.delete.emit(this.article);
  }
}
