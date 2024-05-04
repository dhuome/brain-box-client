/* eslint-disable no-magic-numbers */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from 'src/app/components/input/input.component';
import { lastValueFrom } from 'rxjs';
import { Regex, Validation } from 'src/app/app.constants';
import { InputError } from 'src/app/types/utils';
import { FormMessageComponent } from 'src/app/components/form-message/form-message.component';
import { FormMessage } from '../form-message/FormMessage';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FileInputComponent } from '../file-input/file-input.component';
import { ArticleService } from 'src/app/services/article/article.service';
import { HttpErrorResponse } from '@angular/common/http';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';

interface ArticleForm {
  title: FormControl<string>;
  body: FormControl<string>;
  image: FormControl<File | null>;
}

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, FormMessageComponent, FileInputComponent],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css'
})
export class ArticleCardComponent {
  regex = Regex;

  isLoading = false;
  formMessage = new FormMessage;

  @Output() closeModal = new EventEmitter();

  articleForm = new FormGroup<ArticleForm>({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1)], nonNullable: true
    }),
    body: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1)], nonNullable: true
    }),
    image: new FormControl(null, { validators: [Validators.required] })
  });

  titleErrors: InputError[] = [
    { message: 'Please Enter Your Article Title', type: Validation.REQUIRED },
    { message: 'Min Article Title Length is 1 Characters', type: Validation.MIN_LENGTH },
  ];

  queryClient = injectQueryClient();
  createArticleMutation = injectMutation(() => ({
    mutationFn: (createArticleRequest: FormData) => lastValueFrom(
      this.articleService.createArticle(createArticleRequest)
    )
  }));

  constructor(private articleService: ArticleService, private toastService: ToastService) { }

  onPostArticle() {
    const formData = new FormData();
    const { title, body, image } = this.articleForm.getRawValue();

    if (!title?.length || !body?.length || !image) {
      this.formMessage.setFailureMessage('Please fill out all required fields');
      return;
    }

    if (!this.articleForm.valid) {
      this.formMessage.setFailureMessage(
        'Apologies, there is an error in one of the inputs. Please correct it to complete the process.'
      );
      return;
    }

    this.isLoading = true;
    this.formMessage.clear();
    formData.append('data', JSON.stringify({ title, body }));
    formData.append('image', image);

    this.createArticleMutation.mutate(formData, {
      onSuccess: () => {
        this.closeModal.emit();
        this.queryClient.invalidateQueries({ queryKey: ['articles'] });
        this.toastService.addSuccessToast('📝 Article created successfully! Share your knowledge!');
      },
      onError: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.formMessage.setHttpFailureMessage(error.error);
        }
      }
    });
  }
}
