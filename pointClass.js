class pointClass{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.index = 0;
  }
  
  show(col){
    strokeWeight(4);
    stroke(col);
    point(this.x,this.y);
  }
}