import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  @Input() textTitle? : String;
  editable = true;

  public toggleEditable() {
    this.editable = !this.editable;
  }

}
