int size = 4096;
int sub = 8;
int sizeLowRes = 512;
boolean bGenerateImages = false;
boolean bGenerateImagesLowRes = true;
boolean bUseClicClac = true;
String basename = "";


// ------------------------------------------------
void settings()
{
  size(800, 800, P2D);
  if (bUseClicClac)
    basename = "cliclac_";
}


// ------------------------------------------------
void setup()
{
  if (bGenerateImages)
    generateImages();

  if (bGenerateImagesLowRes)
    createImagesLowRes();
  else
    createSubImages();
}

// ------------------------------------------------
void generateImages()
{
  PGraphics g = createGraphics(size, size, P2D);

  String filename = "";
  for (int i=0; i<9*12; i++)
  {
    filename = getFilename(i);

    g.beginDraw();
    g.background(0);
    g.noFill();
    g.stroke(255);
    g.strokeWeight(20);
    g.rect(0, 0, size, size);
    g.fill(255);
    g.textSize(250);
    g.textAlign(CENTER, CENTER);
    g.text(filename, 0, 0, width, height);
    g.endDraw();

    g.save(getPathFile(i, size, 1));
  }
}


// ------------------------------------------------
void createImagesLowRes()
{
  PGraphics g = createGraphics(sizeLowRes, sizeLowRes, P2D);
  PImage img;
  String filename = "";
  for (int n=0; n<9*12; n++)
  {
    img = loadImage( getPathFileSource(n) );
    if (img != null)
    {
      g.beginDraw();
      g.image(img,0,0,sizeLowRes,sizeLowRes);    
      g.endDraw();

      filename = "exports/export-"+size+"-lowres-"+sizeLowRes+"/"+getFilename(n);
      g.save(filename);
      println(filename);
    }
  }
}

// ------------------------------------------------
void createSubImages()
{
  if (sub > 1)
  {
    PImage img;
    PGraphics offscreen = createGraphics(size/sub, size/sub);
    for (int n=0; n<9*12; n++)
    {
      if (bUseClicClac)
        img = loadImage( getPathFileSource(n) );
      else
        img = loadImage( getPathFile(n, size, 1) );

      if (img == null) {
        return;
      }


      for (int j=0; j<sub; j++)
      {
        for (int i=0; i<sub; i++)
        {
          offscreen.beginDraw();
          offscreen.image(img, -i*size/sub, -j*size/sub);
          offscreen.endDraw();

          offscreen.save( getPathFileIJ(n, size, sub, i, j) );

          println("    - saving "+getPathFileIJ(n, size, sub, i, j));
        }
      }
    }
  }
}


// ------------------------------------------------
String getFilename(int n) {
  return nf(n, 3)+".jpg";
}

// ------------------------------------------------
String getFilename(int n, int i, int j) {
  return nf(n, 3)+"_"+i+"_"+j+".jpg";
}


// ------------------------------------------------
String getPathFileSource(int n)
{
  return "exports/export-"+size+"/panel-"+n+".jpg";
}


// ------------------------------------------------
String getPathFile(int n, int size, int sub) {
  return "exports/"+size+"_"+basename+sub+"_"+sub+"/"+getFilename(n);
}

// ------------------------------------------------
String getPathFileIJ(int n, int size, int sub, int i, int j) {
  return "exports/"+size+"_"+basename+sub+"_"+sub+"/"+getFilename(n, i, j);
}

// ------------------------------------------------
void draw()
{
}