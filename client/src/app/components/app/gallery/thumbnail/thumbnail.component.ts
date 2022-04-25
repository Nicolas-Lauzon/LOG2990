import { Component, ElementRef, Input, OnInit } from '@angular/core';

const HEIGHT = 200;
const WIDTH = 300;

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input() drawing: string;
  thumbnail: SVGAElement|null;
  elementRef: ElementRef;

  constructor(elref: ElementRef) {
    this.elementRef = elref;
   }

  ngOnInit(): void {
    if (this.drawing !== '') {
      this.thumbnail = this.elementRef.nativeElement.querySelector('#drawing') as SVGAElement;

      this.drawing = this.drawing.split('filter').join('');

      this.thumbnail.innerHTML = this.drawing ;
      const width: number = parseInt(((this.thumbnail.firstElementChild as SVGAElement).getAttribute('width') as string ), 10);
      const height: number = parseInt(((this.thumbnail.firstElementChild as SVGAElement).getAttribute('height') as string ), 10);
      const facteurX = WIDTH / width;
      const facteury = HEIGHT / height;
      this.thumbnail.setAttribute('transform', 'scale(' + facteurX + ' ' + facteury + ')');
    }
  }

}
