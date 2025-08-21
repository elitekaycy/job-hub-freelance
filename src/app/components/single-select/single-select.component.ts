import { Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { Categories } from '../../config/interfaces/general.interface';

@Component({
  selector: 'app-single-select',
  standalone: true,
  imports: [],
  templateUrl: './single-select.component.html',
})
export class SingleSelectComponent {
  options = input<Categories[]>([]);
  disabled = input<boolean>(false);
  selected = output<string>();

  isOpen = signal(false);
  selectedOption = signal<Categories | null>(null);

  constructor(private readonly elementRef: ElementRef) {}

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (!this.disabled()) this.isOpen.set(!this.isOpen());
  }

  selectOption(option: Categories) {
    this.selectedOption.set(option);
    this.selected.emit(option.categoryId);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}