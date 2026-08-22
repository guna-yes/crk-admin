import { Component, input } from '@angular/core';

export type IconName =
  | 'search'
  | 'close'
  | 'plus'
  | 'box'
  | 'stack'
  | 'users'
  | 'truck'
  | 'phone'
  | 'check-circle'
  | 'sliders'
  | 'edit'
  | 'trash'
  | 'image';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon"
    >
      @switch (name()) {
        @case ('search') {
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="20" y1="20" x2="15.5" y2="15.5"></line>
        }
        @case ('close') {
          <line x1="6" y1="6" x2="18" y2="18"></line>
          <line x1="18" y1="6" x2="6" y2="18"></line>
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        }
        @case ('box') {
          <path d="M3 8 L12 4 L21 8 L21 17 L12 21 L3 17 Z"></path>
          <path d="M3 8 L12 12 L21 8"></path>
          <line x1="12" y1="12" x2="12" y2="21"></line>
        }
        @case ('stack') {
          <path d="M12 3 L21 7.5 L12 12 L3 7.5 Z"></path>
          <path d="M3 12 L12 16.5 L21 12"></path>
          <path d="M3 16.5 L12 21 L21 16.5"></path>
        }
        @case ('users') {
          <circle cx="9" cy="8" r="3.2"></circle>
          <path d="M3.5 20 C3.5 15.8 6 13.5 9 13.5 C12 13.5 14.5 15.8 14.5 20"></path>
          <circle cx="17" cy="9" r="2.6"></circle>
          <path d="M15.5 13.7 C18.2 13.9 20.5 15.9 20.5 20"></path>
        }
        @case ('truck') {
          <rect x="2" y="7" width="12" height="9" rx="1"></rect>
          <path d="M14 10 H18 L21 13.2 V16 H14 Z"></path>
          <circle cx="6.5" cy="18" r="1.8"></circle>
          <circle cx="17.5" cy="18" r="1.8"></circle>
        }
        @case ('phone') {
          <path
            d="M6.5 3 H9.5 L11 7 L8.7 8.7 C9.6 10.8 11.2 12.4 13.3 13.3 L15 11 L19 12.5 V15.5 C19 17.4 17.4 19 15.5 19 C9.7 19 5 14.3 5 8.5 C5 6.6 5.6 4.9 6.5 3 Z"
          ></path>
        }
        @case ('check-circle') {
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M8 12.2 L10.7 15 L16 9"></path>
        }
        @case ('sliders') {
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
          <circle cx="9" cy="6" r="1.8"></circle>
          <circle cx="16" cy="12" r="1.8"></circle>
          <circle cx="11" cy="18" r="1.8"></circle>
        }
        @case ('edit') {
          <path
            d="M4 20 L4.6 16.6 L15.2 6 C15.8 5.4 16.8 5.4 17.4 6 L18 6.6 C18.6 7.2 18.6 8.2 18 8.8 L7.4 19.4 Z"
          ></path>
          <line x1="14" y1="7" x2="17" y2="10"></line>
        }
        @case ('trash') {
          <path d="M5 7 H19"></path>
          <path d="M9 7 V4.6 C9 4.3 9.3 4 9.6 4 H14.4 C14.7 4 15 4.3 15 4.6 V7"></path>
          <path d="M6.5 7 L7.3 19 C7.35 19.6 7.85 20 8.4 20 H15.6 C16.15 20 16.65 19.6 16.7 19 L17.5 7"></path>
          <line x1="10.5" y1="10.5" x2="10.5" y2="16.5"></line>
          <line x1="13.5" y1="10.5" x2="13.5" y2="16.5"></line>
        }
        @case ('image') {
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <circle cx="8.5" cy="9.5" r="1.7"></circle>
          <path d="M3 16.5 L8.5 11.5 L12.5 15 L15.5 12.5 L21 17.5"></path>
        }
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }
      .icon {
        display: block;
      }
    `,
  ],
})
export class Icon {
  name = input.required<IconName>();
  size = input<number>(20);
}
