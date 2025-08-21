import { Component, input, output, signal, computed, forwardRef, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categories } from '../../config/interfaces/general.interface';


@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiselect.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements ControlValueAccessor {
  options = input<Categories[]>([]);
  placeholder = input<string>('Select options...');
  searchable = input<boolean>(true);
  disabled = input<boolean>(false);

  selectionChange = output<string[]>();

  selectedValues = signal<string[]>([]);
  isOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return this.options() || [];
    return (this.options() || []).filter(option =>
      (option.name?.toLowerCase()?.includes(search)  ||
      option.description?.toLowerCase()?.includes(search) || false)
    );
    // Simplified logic, ensured || false for safety
  });

  selectedText = computed(() => {
    const selected = this.selectedValues();
    if (selected.length === 0) return this.placeholder();
    if (selected.length === 1) {
      const option = this.options().find(o => o.categoryId === selected[0]);
      return option?.name || this.placeholder();
    }
    return `${selected.length} options selected`;
  });

  private onChange = (value: string[]) => {};
  private onTouched = () => {};

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  toggleDropdown(event: Event): void {
    if (this.disabled()) return;
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.onTouched();
    }
   event.stopPropagation(); 
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.searchTerm.set('');
  }

  toggleOption(option: Categories, event?: Event): void {
    if (this.disabled()) return;
    event?.stopPropagation();
    const currentValues = this.selectedValues();
    const index = currentValues.indexOf(option.categoryId);
    const newValues = index > -1
      ? currentValues.filter(id => id !== option.categoryId)
      : [...currentValues, option.categoryId];

    this.selectedValues.set(newValues);
    this.onChange(newValues);
    this.selectionChange.emit(newValues);
  }

  isSelected(optionId: string): boolean {
    return this.selectedValues().includes(optionId);
  }

  onSearchChange(): void {
    // Triggered by ngModelChange to ensure immediate updates
    this.filteredOptions(); // Force recomputation of filtered options
  }

  clearAll(): void {
    this.selectedValues.set([]);
    this.onChange([]);
    this.selectionChange.emit([]);
    this.closeDropdown();
  }

  writeValue(value: string[]): void {
    this.selectedValues.set(Array.isArray(value) ? value.filter(id => id) : []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // No-op; input() handles it
  }
}