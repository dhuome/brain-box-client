import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { ArticleService } from 'src/app/services/article/article.service';
import { ToastService } from 'src/app/services/toast/toast.service';

interface CommentForm {
  comment: FormControl<string>;
}

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})
export class CommentFormComponent {
  @Input({ required: true }) articleId!: number;

  commentForm = new FormGroup<CommentForm>({
    comment: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  queryClient = injectQueryClient();
  postCommentMutation = injectMutation(() => ({
    mutationFn: (comment: string) => lastValueFrom(this.articleService.postComment(this.articleId, { comment }))
  }));

  constructor(private articleService: ArticleService, private toastService: ToastService) { }

  onComment() {
    const { comment } = this.commentForm.getRawValue();

    if (!comment || !comment.trim().length) {
      return;
    }

    this.postCommentMutation.mutate(comment, {
      onSuccess: () => {
        this.commentForm.reset();
        this.queryClient.invalidateQueries({ queryKey: ['comments'] });
        this.toastService.addInfoToast('💬 Comment posted successfully!');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.toastService.addHttpErrorToast(error.error);
        }
      }
    });
  }
}
