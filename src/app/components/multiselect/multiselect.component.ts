import { Component, input, output, signal, computed, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../config/interfaces/general.interface';

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
  options = input<SelectOption[]>([]);
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
      (option.name?.toLowerCase()?.includes(search) ||
       option.category?.toLowerCase()?.includes(search)) ?? false
    );
  });

  selectedText = computed(() => {
    const selected = this.selectedValues();
    if (!selected?.length) return this.placeholder();
    if (selected.length === 1) {
      const option = this.options().find(o => o.id === selected[0]);
      return option?.name || this.placeholder();
    }
    return `${selected.length} options selected`;
  });

  private onChange = (value: string[]) => {};
  private onTouched = () => {};

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
    this.searchTerm.set(''); // Reset search term
  }

  toggleOption(option: SelectOption, event?: Event): void {
    if (this.disabled()) return;
    event?.stopPropagation();
    const currentValues = this.selectedValues();
    const index = currentValues.indexOf(option.id);
    const newValues = index > -1
      ? currentValues.filter(id => id !== option.id)
      : [...currentValues, option.id];

    this.selectedValues.set(newValues);
    this.onChange(newValues);
    this.selectionChange.emit(newValues);
  }

  isSelected(optionId: string): boolean {
    return this.selectedValues().includes(optionId);
  }

  updateSearchTerm(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target?.value?.trim() || '');
  }

  clearAll(): void {
    this.selectedValues.set([]);
    this.onChange([]);
    this.selectionChange.emit([]);
  }

  writeValue(value: string[]): void {
    this.selectedValues.set(value?.filter(id => id) || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state
  }
}
