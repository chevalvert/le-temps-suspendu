size(1120,120);
PGraphics g = createGraphics(width,12);
g.beginDraw();
g.background(0);
g.translate(0,5);
g.stroke(255);
float l = 112-2*5-1;
for (int i=0; i<10; i++)
{
  g.line(5+112*i,0,5+112*i+l,0);
}
g.endDraw();
g.save("keyBoardLineSep.png");

background(0);
for (int i=0; i<10; i++)
  image(g,0,i*12);