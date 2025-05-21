import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit {
  @Input() text? : String;
  @Input() textTitle? : String;
  unformattedText? : String;
  switched = true;

  ngOnInit(): void {
      this.formatText();
  }

  public switchText() : void {
    let temp = this.text;
    this.text = this.unformattedText;
    this.unformattedText = temp;
    this.switched = !this.switched;
  }

  public formatText() : void {}

}
