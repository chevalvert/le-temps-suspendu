function stats()
{
	this.actionOnCodeEntered 	= 1;
	this.actionOnClick 			= 2;
	
	this.save = function(data, action)
	{
		if (rqcv.configuration.stats.enable)
		{
			if (action === this.actionOnCodeEntered)
			{
				// data is result object given by successfull query search
				var query = "INSERT INTO "+ rqcv.configuration.stats.table +" (idPhoto,action,done) VALUES ("+data.id+","+action+",NOW())";
				rqcv.connection.query(query, function (error, results, fields){});
			}
			else if (action === this.actionOnClick)
			{
				// data is object with panel + position fields
				var query = "INSERT INTO "+ rqcv.configuration.stats.table +" (idPhoto,action,done) VALUES ((SELECT id FROM "+rqcv.configuration.db_rq.table+" WHERE panel="+data.panel+" AND position="+data.position+"),"+action+",NOW())";
				rqcv.connection.query(query, function (error, results, fields){});
			}
		}
	}
}


/*

CREATE TABLE `stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idPhoto` int(11) NOT NULL,
  `action` tinyint(4) NOT NULL,
  `done` datetime NOT NULL,
  PRIMARY KEY (`id`)
)

*/
