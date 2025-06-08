import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ZSFMToHTMLService } from '../zsfmtohtml/zsfmto-html.service';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit {
  protected converter = inject(ZSFMToHTMLService);

  @Input() text? : string;
  @Input() textTitle? : string;
  unformattedText = "";
  switched = true;

  ngOnInit(): void {
    if (this.text) {
      this.unformattedText = this.text;
      this.text = this.converter.ZSFMToHTML(this.text);
      (document.getElementById("content") as HTMLDivElement).innerHTML = this.text;
    }
  }

  public switchText() : void {
    if (this.switched) {      
      if (this.text) {
        this.text = this.converter.ZSFMToHTML(this.unformattedText);
        (document.getElementById("content") as HTMLDivElement).innerText = this.unformattedText;
      }
    }
    else {
      if (this.text) {
        this.unformattedText = (document.getElementById("content") as HTMLDivElement).innerText;
        this.text = this.converter.ZSFMToHTML(this.unformattedText);
        (document.getElementById("content") as HTMLDivElement).innerHTML = this.text;
      }
    }
    this.switched = !this.switched;
  }

}
