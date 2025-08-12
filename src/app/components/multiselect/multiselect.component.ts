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
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
   // Input signals
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Select options...');
  searchable = input<boolean>(true);
  disabled = input<boolean>(false);

  // Output signals
  selectionChange = output<string[]>();

  // Internal signals
  selectedValues = signal<string[]>([]);
  isOpen = signal<boolean>(false);
  searchTerm = signal<string>('');

  // Computed signals
  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return this.options();
    
    return this.options().filter(option => 
      option.name.toLowerCase().includes(search) ||
      option.category?.toLowerCase().includes(search)
    );
  });

  selectedText = computed(() => {
    const selected = this.selectedValues();
    if (selected.length === 0) return this.placeholder();
    if (selected.length === 1) {
      const option = this.options().find(o => o.id === selected[0]);
      return option?.name || '';
    }
    return `${selected.length} options selected`;
  });

  // ControlValueAccessor implementation
  private onChange = (value: string[]) => {};
  private onTouched = () => {};

  toggleDropdown(): void {
    if (this.disabled()) return;
    
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.onTouched();
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  toggleOption(option: SelectOption): void {
    const currentValues = this.selectedValues();
    const index = currentValues.indexOf(option.id);
    
    let newValues: string[];
    if (index > -1) {
      newValues = currentValues.filter(id => id !== option.id);
    } else {
      newValues = [...currentValues, option.id];
    }
    
    this.selectedValues.set(newValues);
    this.onChange(newValues);
    this.selectionChange.emit(newValues);
  }

  isSelected(optionId: string): boolean {
    return this.selectedValues().includes(optionId);
  }

  updateSearchTerm(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  clearAll(): void {
    this.selectedValues.set([]);
    this.onChange([]);
    this.selectionChange.emit([]);
  }

  // ControlValueAccessor methods
  writeValue(value: string[]): void {
    this.selectedValues.set(value || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }


}
