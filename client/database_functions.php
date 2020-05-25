<?php

if ( !function_exists( 'database_connect' ) ) :
    function database_connect()
    {
        $connection = new mysqli("database", "james", "secret", "geo_search");
        if (!$connection)
        {
            die('Could not connect: ' . $connection->error);
        }
        $connection->query("SET CHARACTER SET \"utf8\"");
        $connection->query("SET NAMES \"utf8\"");

        return $connection;
    }
endif;

?>