import { Component } from '@angular/core';
import { ViewChild, AfterViewInit } from '@angular/core';
import { OnInit, Renderer2 } from '@angular/core';

import * as PIXI from 'pixi.js'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  //containers
  worldContainer = new PIXI.Container();
  screenContainer = new PIXI.Container();
  rectangle = new PIXI.Graphics();
  //is mouse dragging
  dragging = false;

  //world zoom offset 
  //worldZoomOffsX = 0;
  //worldZoomOffsY = 0;

  //mouse variables   
  mouseX:number = 0 
  mouseY:number = 0

  //panning variables
  startPanX: number = 0  
  startPanY: number = 0  

  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    document.body.appendChild(this.app.view);
    this.setup();
  }

  app: PIXI.Application<HTMLCanvasElement> = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0xFA23CD
  });

  setup() {
    //screen rectangle
    let windowRectangle = new PIXI.Graphics;
    windowRectangle.beginFill(0x00ff00);
    windowRectangle.drawRect(0, 0, 512, 512);
    windowRectangle.endFill();
    this.screenContainer.addChild(windowRectangle)

    //staging containers
    this.app.stage.addChild(this.screenContainer);
    this.screenContainer.addChild(this.worldContainer)

    //world config
    this.worldContainer.eventMode = 'static'
    let anchor = () => {
      this.worldContainer.pivot.x = this.worldContainer.x * 256;
      this.worldContainer.pivot.y = this.worldContainer.y * 256;
    }
    this.worldContainer.scale.set(0.5)
    anchor();
   
    //interaction config
    this.app.stage.interactive = true;
    this.screenContainer.interactive = true;
    this.worldContainer.interactive = true;
    this.app.stage.on("pointermove", (ev) =>{
      this.mouseX = ev.global.x;
      this.mouseY = ev.global.y;
      if(this.dragging == true){
        this.onDragMove(ev)
      }
    })
    this.app.stage.on("pointerdown", (ev) => { this.onDragStart(ev); console.log("pointerdown") });
    this.app.stage.on("pointerup", (ev) => { this.onDragEnd()}); 
    this.app.stage.on("pointerupoutside", (ev) => { this.onDragEnd()});
    this.renderer2.listen(this.app.view, "wheel", (ev) => {
      this.strech(ev)
    })

    //world rectangles 
    this.rectangle.beginFill(0xff0000);
    this.rectangle.drawRect(0, 0, 512, 512);
    this.rectangle.endFill();
    this.worldContainer.addChild(this.rectangle);
    this.rectangle.beginFill(0x0000ff);
    this.rectangle.drawRect(256, 256, 128, 128);
    this.rectangle.endFill();
    this.worldContainer.addChild(this.rectangle);
  }

  onDragStart(ev: PIXI.FederatedPointerEvent) {
    this.dragging = true

    this.startPanX = ev.global.x    
    this.startPanY = ev.global.y
  }

  onDragEnd(){
    this.dragging = false
  }
  onDragMove(ev: PIXI.FederatedPointerEvent){
    if (this.dragging) {

      this.worldContainer.x += ev.globalX - this.startPanX
      this.worldContainer.y += ev.globalY - this.startPanY
// 
      // this.worldZoomOffsX = this.worldContainer.position.x
      // this.worldZoomOffsY = this.worldContainer.position.y

      this.startPanX = ev.globalX
      this.startPanY = ev.globalY

    }
  }

  strech(ev: PIXI.FederatedWheelEvent) {

    //var worldPos = (ev.offsetX - this.worldContainer.x) / this.worldContainer.scale.x
    //var newScale = this.screenContainer.scale.x * (ev.deltaY)
    //var newScreenPos = (worldPos ) * newScale + this.screenContainer.x;
    
    let scaleBeforeZoomX = this.worldContainer.scale.x
    let scaleBeforeZoomY = this.worldContainer.scale.y

    let scaleAfterZoomX = 0
    let scaleAfterZoomY = 0

    if(ev.deltaY > 0) {
      scaleAfterZoomX = this.worldContainer.scale.y * 1.1;
      scaleAfterZoomY = this.worldContainer.scale.y * 1.1;
    }
    else {
      scaleAfterZoomX = this.worldContainer.scale.x * 0.9;
      scaleAfterZoomY = this.worldContainer.scale.y * 0.9;
    }

    this.worldContainer.scale.x = scaleAfterZoomX;
    this.worldContainer.scale.y = scaleAfterZoomY;

    //console.log(beforeZoom)
    //console.log(afterZoom)
  }


  renderLoop() {
  }

}

