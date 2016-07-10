import React from 'react';

import Slider from './slider.jsx'


class MemoryLayout extends React.Component {

  constructor(){
    super()
    // priv method (pseudo)
    this._setHeight = this._setHeight.bind(this)
    this._drawMemory = this._drawMemory.bind(this)
    this._drawDump = this._drawDump.bind(this)
    this._drawArrow = this._drawArrow.bind(this)
    this._drawFirstArrow = this._drawFirstArrow.bind(this)
    this._drawDumps = this._drawDumps.bind(this)
    this._drawFirstDump = this._drawFirstDump.bind(this)
    this._drawAddressesLabel = this._drawAddressesLabel.bind(this)
    this._drawTitleLabel = this._drawTitleLabel.bind(this)
    //  public method (pseudo)
    this.updateMemory = this.updateMemory.bind(this)

  }

  //set the proper dimensions for the canvas object based on the viewport dimension
  _setHeight(){
    var navbarHeight = document.getElementById('navbar').offsetHeight;
    var informationHeight = document.getElementById('information').offsetHeight;
    var sliderHeight = document.getElementById('slider').offsetHeight;

    this.canvas.width = window.innerWidth - 30;
    this.canvas.height = window.innerHeight - (navbarHeight + informationHeight + sliderHeight + 50);
  }

  _drawMemory(){
    // style variables
    var strokeColor = "rgba(243,57,1,1)"
    var textColor = "rgb(255, 113, 70)"
    var mainMemoryBackgroundColor = "rgba(45,45,45,1)"
    var memorySectionBackroundColor = "rgba(51,51,51,1)"

    // draw the rectangle representing the memory of the process
    var memorySpace = new createjs.Shape();
    memorySpace.width = this.canvas.width / 3
    memorySpace.height = this.canvas.height - 80 
    memorySpace.x = memorySpace.width
    memorySpace.y = 50
    memorySpace.graphics.setStrokeStyle(2).beginStroke(strokeColor).beginFill(mainMemoryBackgroundColor).drawRect(0, 0, memorySpace.width, memorySpace.height);

    // draw the main module
    var mainModule = new createjs.Shape();
    mainModule.width = memorySpace.width
    mainModule.height = memorySpace.height / 3
    mainModule.x = memorySpace.x
    mainModule.y = memorySpace.y + mainModule.height
    mainModule.graphics.setStrokeStyle(2).beginStroke(strokeColor).beginFill(memorySectionBackroundColor).drawRect(0, 0, mainModule.width, mainModule.height);

    // draw the heap above the main module
    var aboveHeap = new createjs.Shape();
    aboveHeap.width = memorySpace.width
    aboveHeap.height = memorySpace.height / 6
    aboveHeap.x = memorySpace.x
    aboveHeap.y = mainModule.y - aboveHeap.height - 50
    aboveHeap.graphics.setStrokeStyle(2).beginStroke(strokeColor).beginFill(memorySectionBackroundColor).drawRect(0, 0, aboveHeap.width, aboveHeap.height);

    // draw the heap under the main module
    var underHeap = new createjs.Shape();
    underHeap.width = memorySpace.width
    underHeap.height = memorySpace.height / 6
    underHeap.x = memorySpace.x
    underHeap.y = mainModule.y + mainModule.height + 50
    underHeap.graphics.setStrokeStyle(2).beginStroke(strokeColor).beginFill(memorySectionBackroundColor).drawRect(0, 0, underHeap.width, underHeap.height);
    
    // draw the label above the rectangle representing the process
    var labelMemorySpace = new createjs.Text("Memory Layout", "30px Arial", textColor);
    // center the label on the rectangle
    var labelMemorySpaceBounds = labelMemorySpace.getBounds()
    labelMemorySpace.x = memorySpace.width + ( (memorySpace.width - labelMemorySpaceBounds.width) / 2)

    this.stage.addChild(memorySpace, labelMemorySpace, mainModule, aboveHeap, underHeap);

    // draw the label for the main module
    this._drawTitleLabel("Main module", textColor, mainModule.x, mainModule.y, mainModule.width, mainModule.height)

    // draw the label for the heap 1
    this._drawTitleLabel("Heap 1", textColor, aboveHeap.x, aboveHeap.y, aboveHeap.width, aboveHeap.height)

    // draw the label for the heap 2
    this._drawTitleLabel("Heap 2", textColor, underHeap.x, underHeap.y, underHeap.width, underHeap.height)

     // draw the address labels for the hep 2
    this._drawAddressesLabel(this.props.information.main_module.start_address.toString(16), this.props.information.main_module.end_address.toString(16), textColor, underHeap.x, underHeap.y, underHeap.width, underHeap.height)

    // draw the address labels for the heap 1
    this._drawAddressesLabel(this.props.information.main_module.start_address.toString(16), this.props.information.main_module.end_address.toString(16), textColor, aboveHeap.x, aboveHeap.y, aboveHeap.width, aboveHeap.height)

    // draw the address labels for the main module
    this._drawAddressesLabel(this.props.information.main_module.start_address.toString(16), this.props.information.main_module.end_address.toString(16), textColor, mainModule.x, mainModule.y, mainModule.width, mainModule.height)

    // draw tha bound of the memory
    this._drawAddressesLabel("00", "ff", "red", memorySpace.x, memorySpace.y, memorySpace.width, memorySpace.height)
    
    // update the canvas
    this.stage.update();
  }

  // draw the addresses label on the right of the relative shape
  _drawAddressesLabel(startAddress, endAddress, color, relX, relY, relWidth, relheight){
    var labelStartAddress = new createjs.Text("0x" + startAddress, "20px Arial", color);
    var labelEndAddress = new createjs.Text("0x" + endAddress, "20px Arial", color);
    var labelAddressX = relX + relWidth + 10
    labelStartAddress.x = labelAddressX
    labelStartAddress.y =  relY - (labelEndAddress.getBounds().height / 2 )
    labelEndAddress.x = labelAddressX
    labelEndAddress.y = labelStartAddress.y + relheight

    this.stage.addChild(labelStartAddress, labelEndAddress)
  }

  // draw the the title label in the center of the relative shape
  _drawTitleLabel(title, color, relX, relY, relWidth, relHeight){
    var labelTitle = new createjs.Text(title, "25px Arial", color);
    var labelTitleBounds = labelTitle.getBounds()
    labelTitle.x = relX + ( (relWidth - labelTitleBounds.width) / 2)
    labelTitle.y = relY + (relHeight / 2) - (labelTitleBounds.height / 2)

    this.stage.addChild(labelTitle)
  }

  // draw the initial dump 
  _drawFirstDump(){

    var dump = this.props.dumps[0]

    this._drawDump(400, dump, "DUMP_1")

    this._drawFirstArrow(dump.eip)
  }

  _drawDumps(startDumpIndex, endDumpIndex){

    var startDump = this.props.dumps[startDumpIndex]
    var endDump = this.props.dumps[endDumpIndex]

    if(startDump.start_address < endDump.start_address){
        this._drawDump(100, startDump, "DUMP_1")
        this._drawDump(400, endDump, "DUMP_2")
    }
    else{
        this._drawDump(400, startDump, "DUMP_1")
        this._drawDump(100, endDump, "DUMP_2")
    }

     this._drawArrow(endDump.eip)
  }


  _drawDump(y, dump, name){

     // style variables
    var strokeColor = "rgb(126, 255, 126)"
    var textColor = "rgb(126, 255, 126)"
    var dumpBackroundColor = "rgba(51,51,51,1)"

    // draw the rectangle representing the memory of the process
    var dumpShape = new createjs.Shape()
    dumpShape.name = name
    dumpShape.width = this.canvas.width / 2.5
    dumpShape.height = 100
    dumpShape.x = (this.canvas.width - dumpShape.width)/2
    dumpShape.y = y
    dumpShape.graphics.setStrokeStyle(4).beginStroke(strokeColor).beginFill(dumpBackroundColor).drawRect(0, 0, dumpShape.width, dumpShape.height);
    
    // draw the label above the rectangle representing the process
    var labelDumpShape = new createjs.Text(name, "30px Arial", textColor);
    // center the label on the rectangle
    var labelDumpShapeBounds = labelDumpShape.getBounds()
    labelDumpShape.x = dumpShape.x + ( (dumpShape.width - labelDumpShapeBounds.width) / 2)
    labelDumpShape.y = dumpShape.y + ( ( dumpShape.height - labelDumpShapeBounds.height) / 2)
    
    // draw the addresses label on the right of the memory layout
    var labelDumpShapeFirstAddress = new createjs.Text("0x" + dump.start_address.toString(16), "20px Arial", textColor);
    var labelDumpShapeLastAddress = new createjs.Text("0x" + dump.end_address.toString(16), "20px Arial", textColor);
    labelDumpShapeFirstAddress.x = dumpShape.width + dumpShape.x + 10
    labelDumpShapeFirstAddress.y = dumpShape.y
    labelDumpShapeLastAddress.x = dumpShape.width + dumpShape.x + 10
    labelDumpShapeLastAddress.y = dumpShape.y +   dumpShape.height - (labelDumpShapeLastAddress.getBounds().height)

    this.dumpsContainer.addChild(dumpShape, labelDumpShape, labelDumpShapeFirstAddress, labelDumpShapeLastAddress);
    // update the canvas
    this.stage.update();
  }

  _drawFirstArrow(oep){

     // style variables
    var strokeColor = "rgb(126, 255, 126)"
    var textColor = "rgb(126, 255, 126)"

    var dump_1 = this.dumpsContainer.getChildByName("DUMP_1")

    var leftOffsetArrow = 60
    var endArrowX = dump_1.x - 2
    var beginArrowX = endArrowX - leftOffsetArrow
    var beginArrowY = dump_1.y + (dump_1.height / 2)

    var arrow = new createjs.Shape();
    arrow.name = "arrow"
    arrow.graphics.setStrokeStyle(4)
                  .beginStroke(strokeColor)

                  .moveTo(beginArrowX, beginArrowY)                             // move the corsor on the left border of the start dump
                                                                                // and in the middle of its height
                  
                  .lineTo(endArrowX, beginArrowY)                               // draw a straight horizontal segment 60px on the left

                  .moveTo(endArrowX - 25,  beginArrowY - 13)            // draw the arrowhead

                  .lineTo(endArrowX, beginArrowY)                       // draw the arrowhead

                  .lineTo(endArrowX - 25,  beginArrowY + 13)            // draw the arrowhead
    

    
    // place the label that display the OEP on the left of the label
    var labelOEP = new createjs.Text("OEP : 0x" + oep.toString(16), "20px Arial", textColor);
    labelOEP.x = beginArrowX - labelOEP.getBounds().width - 10
    labelOEP.y = beginArrowY - (labelOEP.getBounds().height / 2)
    this.dumpsContainer.addChild(arrow, labelOEP);

    this.stage.update();

  }

  _drawArrow(oep){

    // style variables
    var strokeColor = "rgb(126, 255, 126)"
    var textColor = "rgb(126, 255, 126)"

    var dump_1 = this.dumpsContainer.getChildByName("DUMP_1")
    var dump_2 = this.dumpsContainer.getChildByName("DUMP_2")

    var beginArrowX = dump_1.x - 2
    var beginArrowY = dump_1.y + (dump_1.height / 2)
    var leftOffsetArrow = 60
    var middleArriveDumpY = dump_2.y + (dump_2.height / 2)
    var arrow = new createjs.Shape();
    arrow.name = "arrow"
    arrow.graphics.setStrokeStyle(4)
                  .beginStroke(strokeColor)

                  .moveTo(beginArrowX, beginArrowY)                             // move the corsor on the left border of the start dump
                                                                                // and in the middle of its height
                  
                  .lineTo(beginArrowX - leftOffsetArrow, beginArrowY)           // draw a straight horizontal segment 60px on the left

                  .lineTo(beginArrowX - leftOffsetArrow, middleArriveDumpY)     // draw a straight vertical line until the middle of the arrive dump

                  .lineTo(beginArrowX, middleArriveDumpY)                       // draw a straight horizontal line until the left border of the final dump

                  .moveTo(beginArrowX - 25,  middleArriveDumpY - 13)            // draw the arrowhead

                  .lineTo(beginArrowX, middleArriveDumpY)                       // draw the arrowhead

                  .lineTo(beginArrowX - 25,  middleArriveDumpY + 13)            // draw the arrowhead
    

    // place the label that display the OEP on the left of the label
    var labelOEP = new createjs.Text("OEP : 0x" + oep.toString(16), "20px Arial", textColor);
    labelOEP.x = beginArrowX - leftOffsetArrow - labelOEP.getBounds().width - 10
    labelOEP.y = middleArriveDumpY - (labelOEP.getBounds().height / 2)

    this.dumpsContainer.addChild(arrow, labelOEP);
    this.stage.update();

  }

  //callback of reactjs called when th component mounting is finished
  componentDidMount() {
    // set the canvas dimension on the view port
    this.canvas = document.getElementById('memoryLayoutCanvas'); 
    this._setHeight() 
    this.stage = new createjs.Stage("memoryLayoutCanvas");
    //draw the memory layout
    this._drawMemory()
    // create another "layer" for the dumps
    this.dumpsContainer = new createjs.Container()
    this.stage.addChild(this.dumpsContainer)
    //this._drawFirstDump()
    // draw the initial situation (INDEX (-1,-1) IS THE INITIAL SITUATION!!!)
    //this._drawDumps(-1,-1)
  }

  // update the canvas in order to visualize the new dumps situation
  updateMemory(startDump, endDump){
    //clear the old canvas
    this.dumpsContainer.removeAllChildren()
    this.stage.update()
    // draw the first dump
    if(startDump == -1 && endDump == 0){
      this._drawFirstDump()
    }
    // idf both the index are -1 we want to see the initial situation
    else if(startDump !== -1 && endDump !== -1){
      //draw the new one
      this._drawDumps(startDump, endDump)
    }
     
  }

  render () {

    var highlightBorder = {
      marginTop: '15px',
      borderTop : '#f33901 1px solid',
      background: "rgba(51,51,51,1)"
    }
    // if the report contains no dump then don't show the slider 
    var slider = this.props.dumps.length === 0 ? <h3>Sorry there are no dump in this report...</h3> : <Slider dumps={this.props.dumps} onUpdate={this.updateMemory}/>

    return (
      <div>
        <canvas id="memoryLayoutCanvas"></canvas>

        <div className="row" id="slider" style={highlightBorder}>
            <div className="col-sm-12" style={{textAlign : 'center'}}>
                {slider}
            </div>
        </div>
      </div>
    );

  }

}

export default MemoryLayout;






