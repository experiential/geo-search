<?php 

  echo "<div>connecting...</div>";

  $connection = new mysqli("database", "james", "secret", "geo_search");
  if (!$connection)
  {
    die('Could not connect: ' . $connection->error);
  }

  //mysqli_select_db("geo_search", $connection);

  $query = "select * from polygon where Species_ID = 1358";
  $result = $connection->query($query);
  if($result && $result->num_rows > 0)
  {
  	while($row = $result->fetch_array())
  	{
  	  echo "<div>Polygon: ".$row["Polygon_ID"]."</div>";
  	}
  }
  else
  {
  	echo "<div>Failed :-( </div>";
  }
  $result->free();
  $connection->close();

  //phpinfo();

?>