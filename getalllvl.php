<?php
include_once('config.inc.php');
include_once('mysql.class.php');

$mysql_var = new hfw_mysql($config);
$result = $mysql_var->query('SELECT * FROM '.$mysql_var->prefix().'niveau ORDER BY id ASC');
$first=true;
while($row = mysql_fetch_array($result))
{
	if(!$first)
		echo ',';
	else
		$first=false;
	echo $row['id'];
}

?>
