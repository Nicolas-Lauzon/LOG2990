export declare interface DrawStrategyService {
  onMouseMovement(event: MouseEvent): [string, string];
  onMouseDown(event: MouseEvent, eventButton: number): [string, string];
  onMouseUp(event: MouseEvent): [string, string];
  onMouseOut(event: MouseEvent): [string, string];
  onSelected(): void;
  onBackspace(event: MouseEvent): [string, string];
  onEscape(event: MouseEvent): [string, string];

  onCtrlKey(event: KeyboardEvent): [string, string];
  onShiftDown(event: MouseEvent): [string, string];
  onShiftUp(event: MouseEvent): [string, string];
  getCurrentId(): number;
  setCurrentId(receivedId: number): void;
}
