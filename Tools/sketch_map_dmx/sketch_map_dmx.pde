int nbColumnsCeil = 18;
int nbRowsCeil = 12;
int nbCeil = nbColumnsCeil*nbRowsCeil;


int nbColumnsFloor = 7;
int nbRowsFloor = 12;
int nbFloor = nbColumnsFloor*nbRowsFloor;


int indexCeil = 0;
int indexFloor = 0;
int indexDMX = 0;

String stringMap = "\tthis.map = new Array("+(nbCeil+nbFloor)+");\n";

for (int j=0; j<nbRowsCeil; j++)
{
  for (int i=0; i<nbColumnsCeil; i++)
  {
    indexCeil = i+nbColumnsCeil*j;
    indexDMX = j+nbRowsCeil*i + 1;

    stringMap += "\tthis.map["+indexCeil+"]="+indexDMX+"\n";
    
    // println("("+i+","+j+") = "+index+" -> "+indexDMX);
  }
}


stringMap += "\n";

int offset = nbCeil;

for (int j=0; j<nbRowsFloor; j++)
{
  for (int i=0; i<nbColumnsFloor; i++)
  {
    indexFloor = i+nbColumnsFloor*j;
    indexDMX = offset + j+nbRowsCeil*i + 1;

    stringMap += "\tthis.map["+(offset+indexFloor)+"]="+indexDMX+"\n";
  }

}


println(stringMap);