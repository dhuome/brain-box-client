import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeAgoPipe } from 'src/app/pipes/time-ago/time-ago.pipe';
import { ArticleResponse } from 'src/app/types/article';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [TimeAgoPipe],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  @Input({ required: true }) articleDetails!: ArticleResponse;

  @Output() clickedArticle = new EventEmitter();
}
