<?php
include_once('config.inc.php');
include_once('mysql.class.php');

$mysql_var = new hfw_mysql($config);
$result = $mysql_var->query('SELECT * FROM '.$mysql_var->prefix().'niveau WHERE id='.intval($_GET['lvl']));
if(mysql_num_rows($result)>0)
{
	$lvl = mysql_fetch_array($result);
	echo $lvl['background'].','.$lvl['lvldata'];
}
else
{
	echo 'END';
}
?>
