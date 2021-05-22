var brique_stat;

function level_init()
{
	brique_stat = new Array(16);
	for(var t=0;t<16;t++)
		brique_stat[t] = new Array(26);

	start_level_load(0);
}

function start_level_load(lvl)
{
	ready = false;
	niveau = lvl;
	ballinit(-1);
	for(var t=1;t<10;t++)
		delete_ball(t);
	if(game!=0)
		game=1;
	var xmlhttp = getHTTPObject();
	xmlhttp.open('GET', 'getlvl.php?lvl='+lvl,true);
	xmlhttp.send(null);
}

function level_load(stringlvl)
{
	if(stringlvl!='END')
	{
		lvltemp = stringlvl.split(',');
		set_background(lvltemp[0]);
		t=0;
		for(x=0;x<15;x++)
		{
			for(y=0;y<25;y++)
			{
				t++;
				brique_stat[x][y]=lvltemp[t];
			}
		}
		game=1
		refresh_score();
	}
	ready=true;
}

function brique_exist(x,y)
{
	if(x>-1 && x<16 && y>-1 && y<26)
	{
		if(brique_stat[x][y]>0 && brique_stat[x][y] != 8)
			return true;
	}
	return false;
}

function zone_delete(x1,y1,x2,y2)
{
	if(x1<0)
		x1=0;
	if(y1<0)
		y1=0;
	if(x2>15)
		x2=15;
	if(y2>25)
		y2=25;

	for(var t=x1;t<=x2;t++)
	{
		for(var a=y1;a<=y2;a++)
		{
			brique_delete(t,a);
		}
	}
}

function brique_delete(x,y)
{
	if(x>-1 && x<16 && y>-1 && y<26)
	{
		if(brique_stat[x][y]==2 || brique_stat[x][y]==4 || brique_stat[x][y]==6)
			brique_stat[x][y]=brique_stat[x][y]-1;
		else if(brique_stat[x][y]==7)
			brique_stat[x][y]=brique_stat[x][y];
		else if(brique_stat[x][y]==9)
		{
			brique_stat[x][y]=0;
			add_effet(0,x*40-40,y*20-20,500);
			zone_delete(x-1,y-1,x+1,y+1);
		}
		else if(brique_stat[x][y]==10)
		{
			brique_stat[x][y]=0;
			random_bonus();
		}
		else if(brique_stat[x][y]==8)
		{
			// brique fantome
		}
		else
			brique_stat[x][y]=0;
	}

}

function block_remain()
{
	var remain_all = 0;

	for(var t=0;t<15;t++)
	{
		for(var a=0;a<25;a++)
		{
			if(brique_exist(t,a) && brique_stat[t][a] != 7 && brique_stat[t][a] != 8)
				remain_all++;
		}
	}

	return remain_all;
}

function getHTTPObject()
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
					level_load(xmlhttp.responseText);
				}
			}
		}
	}
	return xmlhttp;
}

