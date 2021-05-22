<?php
// mysql.inc.php v1.0.1
// use LGPL licence
// more info : http://hyultis.monespace.net on "hfw" project

class hfw_mysql
{
	private $executed_mysql_query;
	private $executed_mysql_query_time;
	private $co;
	private $prefix;
	private $cache = array();
	private $cacheactif;

	public function __construct($var = false)
	{
		$this->cacheactif = true;
		
		if($var)
			$this->connect($var);
	}

	// init database connection
	// $var => array(
	//	"server" => string,
	//	"login" => string,
	//	"mdp" => string,
	//	"database" => string,
	//	"prefix" => string (option)
	//	)
	public function connect($var)
	{
		$Bco = false;
		$error = '';

		// set prefix
		if(isset($var['prefix']))
			$this->prefix = $var['prefix'];

		$this->co = @mysql_connect($var['server'],$var['login'],$var['mdp']);
		$error .= mysql_error().'<hr/>';
		$Bco = @mysql_select_db($var['database'],$this->co);
		$error .= mysql_error().'<hr/>';

		if(!$this->co || !$Bco)
		{
			die('<p><b><u>Erreur Mysql :</u></b><br /> '.$error.'</p>');
		}

		$executed_mysql_query = 0;
	}

	// close database connection
	public function close(){
		mysql_close($this->co);
	}

	// request query
	// $query => string (mysql query)
	public function query($query,$cache = true)
	{
		$addtext = '';
		$result = null;

		//*
		if(isset($this->cache[sha1($query)]))
		{
			$result = $this->cache[sha1($query)];
			@mysql_data_seek($result,0);
		}
		else
		{//*/
			$this->executed_mysql_query++;
			$time = microtime();
			$result = mysql_query($query,$this->co) or die('<p><b>Error '.$addtext.':</b><i>'.mysql_error($this->co).'</i> <b>IN</b><br />'.$query.'<p>');
			$this->executed_mysql_query_time = $this->executed_mysql_query_time + (microtime() - $time);

			if($cache && $this->cacheactif)
				$this->cache[sha1($query)] = $result;
		}
		
		return $result;
	}

		// return true if a row exist
	// else return false
	public function get_row_exist($table,$row,$idrow)
	{
		$result = $this->query('SELECT * FROM '.$this->prefix().$table.' WHERE '.$this->protec($row).'="'.$this->protec($idrow).'"');
		if(mysql_num_rows($result)>0)
			return true;
		return false;
	}

	//Get number of query
	public function get_number_query()	{return $this->executed_mysql_query;}
	//GET time of query
	public function get_time_query()	{return $this->executed_mysql_query_time;}
	// get prefix
	public function prefix()	{return $this->prefix;}
	// get last id
	public function get_lastid() {return mysql_insert_id($this->co);}

	// query cache (active by default)
	public function active_cache() {$this->cacheactif = true;}
	public function unactive_cache() {$this->cacheactif = false;}

	// get mysql protected string
	// $varprotec => string
	public function protec($varprotec)
	{
		// anti magic quote
		if(get_magic_quotes_gpc())
            		$varprotec = stripslashes($varprotec);

		return mysql_real_escape_string($varprotec,$this->co);
	}
	
}
?>
