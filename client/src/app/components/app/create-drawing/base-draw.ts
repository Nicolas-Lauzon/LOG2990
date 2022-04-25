export const DRAW_BASE = '<svg id="svg" version="1.1" baseProfile="full"' +
'[attr.width]="dimensionsX" [attr.height]="dimensionsY"' +
'xmlns="http://www.w3.org/2000/svg" (mousedown)="onMouseDown($event)"' +
'(mousemove)="onMouseMovement($event)" (mouseup)="onMouseUp($event)"' +
'(mouseleave)="onMouseOut($event)">' +

'<defs>' +
'  <filter id="filter0" filterUnits="userSpaceOnUse">' +
'    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blurry" />' +
'  </filter>' +

'  <filter id="filter1" filterUnits="userSpaceOnUse">' +
'    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blurry" />' +
'  </filter>' +

'  <filter id="filter2" filterUnits="userSpaceOnUse">' +
'    <feGaussianBlur in="sourceGraphic" stdDeviation="5" result="blurry" />' +
'    <feMorphology in="burry" operator="erode" radius="1" result="eroded" />' +
'    <feMerge>' +
'      <feMergeNode in="eroded" />' +
'      <feMergeNode in="sourceGraphic" />' +
'    </feMerge>' +
'  </filter>' +

'  <filter id="filter3" filterUnits="userSpaceOnUse">' +
'    <feTurbulence type="turbulence" baseFrequency="0.6" numOctaves="2"' +
'      result="turbulence" />' +
'    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5"' +
'      xChannelSelector="R" yChannelSelector="G" result="turbulence2" />' +
'    <feGaussianBlur in="sourceGraphic" stdDeviation="5" result="blurry" />' +
'    <feMerge>' +
'      <feMergeNode in="blurry" />' +
'      <feMergeNode in="turbulence2" />' +
'    </feMerge>' +
'  </filter>' +

'  <filter id="filter4" filterUnits="userSpaceOnUse">' +
'    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2"' +
'      result="turbulence" />' +
'    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5"' +
'      xChannelSelector="R" yChannelSelector="G" result="turbulence2" />' +
'    <feGaussianBlur in="turbulence2" stdDeviation="2" result="blurry" />' +
'  </filter>' +

'  <filter id="filter5" filterUnits="userSpaceOnUse">' +
'    <feTurbulence type="turbulence" baseFrequency="0.70" numOctaves="2"' +
'      result="turbulence" />' +
'    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="10"' +
'      xChannelSelector="R" yChannelSelector="G" result="turbulence2" />' +
'    <feGaussianBlur in="turbulence2" stdDeviation="1" result="blurry" />' +

'    <feMerge>' +
'      <feMergeNode in="blurry" />' +
'      <feMergeNode in="sourceGraphic" />' +
'    </feMerge>' +
'  </filter>' +

'  <filter id="spray" filterUnits="userSpaceOnUse">' +
'    <feTurbulence type="turbulence" baseFrequency="1"' +
'      numOctaves="2" result="turbulence"/>' +
'    <feDisplacementMap in2="turbulence" in="SourceGraphic"' +
'      scale="50" xChannelSelector="R" yChannelSelector="G"/>' +
'  </filter>' +

'</defs>' +
'<g id="drawboard">' +
'  <rect id="background" />' +
'  <g id="drawZone" ></g>' +
'</g>' +
'<g id="selectedZone"></g>' +
'<g id="grid" [attr.width]="dimensionsX" [attr.height]="dimensionsY" fill="none" *ngIf="this.grid.isActive">' +
'</g>' +
'</svg>"';
