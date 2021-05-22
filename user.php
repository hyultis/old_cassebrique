<?php
include_once('config.inc.php');
include_once('mysql.class.php');

$mysql_var = new hfw_mysql($config);
$connected = false;

// gestion utilisateur
$_GET['mdp'] = sha1($_GET['mdp']);
$result = $mysql_var->query('SELECT COUNT(*) AS count_temp FROM '.$mysql_var->prefix().'user WHERE login = "'.$_GET['pseudo'].'"');
$temp = mysql_fetch_array($result);
if($temp['count_temp'] == 0)
{
	$mysql_var->query('INSERT INTO '.$mysql_var->prefix().'user VALUES("'.$_GET['pseudo'].'","'.$_GET['mdp'].'")');
}

// connecte l'utilisateur
$result = $mysql_var->query('SELECT mdp FROM '.$mysql_var->prefix().'user WHERE login = "'.$_GET['pseudo'].'"');
$temp = mysql_fetch_array($result);
if($temp['mdp'] == $_GET['mdp'])
{
	$connected = true;
}

if(isset($_GET['score']) && $connected)
{
	if(!isset($_GET['lvl'])) {$_GET['lvl']=0;}
	$result = $mysql_var->query('SELECT COUNT(*) AS count_temp FROM '.$mysql_var->prefix().'score WHERE user_login = "'.$_GET['pseudo'].'" AND id_level = '.$_GET['lvl']);
	$temp = mysql_fetch_array($result);
	if($temp['count_temp'] == 0)
		$result = $mysql_var->query('INSERT INTO '.$mysql_var->prefix().'score VALUES("'.$_GET['pseudo'].'",'.$_GET['lvl'].','.$_GET['score'].')');
	else
	$mysql_var->query('UPDATE '.$mysql_var->prefix().'score SET v_score = '.$_GET['score'].' WHERE user_login = "'.$_GET['pseudo'].'" AND id_level = '.$_GET['lvl'].' AND '.$_GET['score'].' > v_score;');
}

echo ($connected)?'1':'0';

?>
