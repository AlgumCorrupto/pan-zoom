import { Component } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { OnInit, Renderer2 } from '@angular/core';

import * as PIXI from 'pixi.js'
import { Viewport, IWheelOptions, IMouseEdgesOptions, IDragOptions } from 'pixi-viewport'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  //containers
  screenContainer = new PIXI.Container();
  rectangle = new PIXI.Graphics();


  notes: PIXI.Sprite[] =  [];
  currentNote?: PIXI.Sprite = undefined;

  app: PIXI.Application<HTMLCanvasElement> = new PIXI.Application({
    width: window.screen.width,
    height: 512,
    backgroundColor: 0xFA23CD
  });

  viewport = new Viewport({
    screenHeight: this.app.view.height,
    screenWidth: this.app.view.width,
    worldWidth: 1000,
    worldHeight: 1000,

    events: this.app.renderer.events
  })


  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    document.body.appendChild(this.app.view);
    this.setup();
  }

  setup() {
    //screen rectangle
    let windowRectangle = new PIXI.Graphics;
    windowRectangle.beginFill(0x00ff00);
    windowRectangle.drawRect(0, 0, this.app.view.width, 512);
    windowRectangle.endFill();
    this.screenContainer.addChild(windowRectangle)

    //staging containers
    this.app.stage.addChild(this.screenContainer);
    this.screenContainer.addChild(this.viewport)

    let dragOptions: IDragOptions = {
      direction: 'x',
      mouseButtons: 'middle'
    }
    let edgesOptions: IMouseEdgesOptions = {
      top: 80,
      bottom: 80
    };
    let wheelOptions: IWheelOptions = {
      axis: 'x'
    }

    this.viewport
      .drag(dragOptions)
      .pinch()
      .mouseEdges(edgesOptions)
      .wheel(wheelOptions)
      .decelerate()


    //world rectangles
    this.rectangle.beginFill(0xff0000);
    this.rectangle.drawRect(0, 0, 512, 512);
    this.rectangle.endFill();
    this.viewport.addChild(this.rectangle);
    this.rectangle.beginFill(0x0000ff);
    this.rectangle.drawRect(256, 256, 128, 128);
    this.rectangle.endFill();
    this.viewport.addChild(this.rectangle);

    //this.nRect.height = 16;

    //grid
    this.makeGrid()

    //viewport event
    this.viewport.on('pointerdown', (ev) => this.spawnInteractiveRect(ev, this.viewport))

    //this.nRect.position.x = 256
    //this.nRect.position.y = 256
    //this.viewport.addChild(this.nRect)
  }

  makeGrid() {
    let grid = new PIXI.Container()
    grid.width = 40;
    grid.height = 20;
    grid.interactive = true
    this.viewport.addChild(grid) 

    let gridRect = new PIXI.Graphics();
    gridRect.beginFill(0xFF3355);
    gridRect.drawRect(0, 0, 40, 20);
    gridRect.endFill();
    gridRect.interactive = true
    grid.addChild(gridRect)
    grid.x = 0
    grid.y = 0

    grid.on("pointerup", (ev)=> {
      gridRect.clear()
      gridRect.beginFill(0xEE9952);
      gridRect.drawRect(0, 0, 40, 20);
      gridRect.endFill();
    })

  }

  spawnInteractiveRect(ev: PIXI.FederatedMouseEvent, viewport: Viewport) {
    if(this.currentNote !== undefined)
      return;

      let noteBuffer = PIXI.Sprite.from('../../assets/orangerect.bmp')
      noteBuffer.height = 16

      noteBuffer.interactive = true;

      noteBuffer.position = ev.getLocalPosition(viewport)

      //noteBuffer.on('pointerdown', (ev) => {this.selectRect(ev, noteBuffer)} )
      //noteBuffer.on('pointerup', this.unfocusRect)
      viewport.addChild(noteBuffer)
      this.notes.push(noteBuffer)
  }

  //moveInteractiveRect(ev: PIXI.FederatedMouseEvent) {
  //  if(this.currentNote === undefined)
  //    return;
//
  //  this.currentNote.parent.toLocal(ev.global, undefined, this.currentNote.position)
//
  //} 
//
  //unfocusRect(ev: PIXI.FederatedMouseEvent) {
  //  if(this.currentNote === undefined)
  //    return;
//
  //    this.currentNote = undefined;
  //}
//
  //selectRect(ev: PIXI.FederatedMouseEvent, nRect: PIXI.Sprite) {
  //  if(this.currentNote !== undefined)
  //    return
  //  this.currentNote = nRect;
  //  this.viewport.on('pointermove', this.moveInteractiveRect)
  //}

}

