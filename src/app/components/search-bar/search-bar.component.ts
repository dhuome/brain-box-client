import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, tap } from 'rxjs';

interface SearchForm {
  searchedValue: FormControl<string>;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private searchTerms = new Subject<string>();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ alias: 'searchedValue' }) value = '';
  @Input({ required: true }) placeholder!: string;
  @Output() triggerClear = new EventEmitter();
  @Output() searchValue = new EventEmitter<string>();

  searchForm = new FormGroup<SearchForm>({
    searchedValue: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
  });

  searchTermSub?: Subscription;

  ngOnInit(): void {
    this.searchForm.controls.searchedValue.setValue(this.value);
    this.searchTermSub = this.searchTerms
      .pipe(
        // eslint-disable-next-line no-magic-numbers
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => this.searchValue.emit(value))
      )
      .subscribe();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  resetFunc() {
    this.searchForm.reset();
    this.triggerClear.emit();
    this.search('');
  }

  ngOnDestroy(): void {
    this.searchTermSub?.unsubscribe();
  }
}
