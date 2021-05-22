<?php
include_once('config.inc.php');
include_once('mysql.class.php');

$mysql_var = new hfw_mysql($config);
if(isset($_GET['lvl']))
	$result = $mysql_var->query('SELECT * FROM '.$mysql_var->prefix().'score WHERE id_level = '.$_GET['lvl'].' ORDER BY v_score DESC LIMIT 0,50');
else
	$result = $mysql_var->query('SELECT * FROM '.$mysql_var->prefix().'score ORDER BY v_score DESC LIMIT 0,50');

while($row = mysql_fetch_array($result))
{
	echo $row['user_login'].' '.$row['v_score'].' '.$row['id_level'].';';
}

?>
