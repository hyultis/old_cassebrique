var pseudo = '';
var mdp = '';
var div = null;
var connected = false;

function initscore()
{
	div = document.getElementById('tab_score');
	div.innerHTML='Pseudo : <input type="text" name="pseudo" id="pseudo" /><br />Mdp : <input type="password" name="mdp" id="mdp"/><br /><input type="button" onClick="connect_user()" value="connecter" />';
}

function connect_user()
{
	var xmlhttp = getHTTPObject_auth();
	pseudo = document.getElementById('pseudo').value;
	mdp = hex_sha1(document.getElementById('mdp').value);

	// epuration
	pseudo = pseudo.replace(" ", "");
	pseudo = pseudo.replace("&", "");
	pseudo = pseudo.replace("#", "");
	pseudo = pseudo.replace("!", "");
	pseudo = pseudo.replace("%", "");
	pseudo = pseudo.replace("/", "");
	pseudo = pseudo.replace("\\", "");
	pseudo = pseudo.replace("=", "");
	pseudo = pseudo.replace("?", "");
	pseudo = pseudo.replace("~", "");
	
	xmlhttp.open('GET', './user.php?pseudo='+pseudo+'&mdp='+mdp,true);
	xmlhttp.send(null);
}

function auth_load(text)
{
	if(text=='1')
	{
		connected = true;
		div.innerHTML = 'connection effectuer, chargement en cours ...'
		refresh_score()
	}
}

function score_load(text)
{
	textfinal = 'Connecter : '+pseudo+'<br><table style="float:right" border="1"><tr><th colspan="3">Highscore</th></tr><tr><th>Nom</th><th>Score</th><th>Niveau</th></tr>';
	
	tabscore = text.split(';');
	for(t=0;t<tabscore.length-1;t++)
	{
		temp = tabscore[t].split(' ');
		textfinal += '<tr><td'+((temp[0]==pseudo)?' style="color:red"':'')+'>'+temp[0]+'</td><td>'+temp[1]+'</td><td>'+temp[2]+'</td></tr>';
	}
	
	div.innerHTML = textfinal+'</table>';
}

function add_score(val)
{
	if(is_connected())
	{
		var xmlhttp = getHTTPObject_auth();
		xmlhttp.open('GET', './user.php?pseudo='+pseudo+'&mdp='+mdp+'&lvl='+niveau+'&score='+val,true);
		xmlhttp.send(null);
	}
}

function refresh_score()
{
	if(is_connected())
	{

	var xmlhttp = getHTTPObject_score();
	if(game==0)
	{
		xmlhttp.open('GET', 'getscore.php',true);
		xmlhttp.send(null);
	}
	else
	{
		xmlhttp.open('GET', 'getscore.php?lvl='+niveau,true);
		xmlhttp.send(null);
	}
	}
}

function is_connected()
{
	return connected;
}


function getHTTPObject_score()
{
	var xmlhttp = false;

	/* Compilation conditionnelle d'IE */
	/*@cc_on
	@if (@_jscript_version >= 5)
		try
		{
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (E)
			{
				xmlhttp = false;
			}
		}
	@else
		xmlhttp = false;
	@end @*/

	/* on essaie de créer l'objet si ce n'est pas déjà fait */
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined')
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		}
		catch (e)
		{
			xmlhttp = false;
		}
	}

	if (xmlhttp)
	{
		/* on définit ce qui doit se passer quand la page répondra */
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState == 4) /* 4 : état "complete" */
			{
				if (xmlhttp.status == 200) /* 200 : code HTTP pour OK */
				{
					score_load(xmlhttp.responseText);
				}
			}
		}
	}
	return xmlhttp;
}

function getHTTPObject_auth()
{
	var xmlhttp = false;

	/* Compilation conditionnelle d'IE */
	/*@cc_on
	@if (@_jscript_version >= 5)
		try
		{
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (E)
			{
				xmlhttp = false;
			}
		}
	@else
		xmlhttp = false;
	@end @*/

	/* on essaie de créer l'objet si ce n'est pas déjà fait */
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined')
	{
		try
		{
			xmlhttp = new XMLHttpRequest();
		}
		catch (e)
		{
			xmlhttp = false;
		}
	}

	if (xmlhttp)
	{
		/* on définit ce qui doit se passer quand la page répondra */
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState == 4) /* 4 : état "complete" */
			{
				if (xmlhttp.status == 200) /* 200 : code HTTP pour OK */
				{
					auth_load(xmlhttp.responseText);
				}
			}
		}
	}
	return xmlhttp;
}
