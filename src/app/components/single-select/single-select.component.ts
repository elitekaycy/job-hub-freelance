import { Component, input, output, signal } from '@angular/core';
import { JobCategory } from '../../config/interfaces/general.interface';

@Component({
  selector: 'app-single-select',
  standalone: true,
  imports: [],
  templateUrl: './single-select.component.html',
})
export class SingleSelectComponent {
  options = input<JobCategory[]>([]);
  disabled= input<boolean>(false);
  selected = output<string>();

  isOpen = signal(false);
  selectedOption = signal<JobCategory | null>(null);

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen.set(!this.isOpen());
  }

  selectOption(option: JobCategory) {
    this.selectedOption.set(option);
    this.selected.emit(option.id);
    this.isOpen.set(false);
  }
}
