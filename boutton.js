var boutton_list = Array(50);
var boutton_list_survol = Array(50);
var boutton_list_end = Array(50);
var boutton_loaded = false;

function boutton_load()
{
	var xmlhttp = getHTTPObject_boutton();
	xmlhttp.open('GET', 'getalllvl.php',true);
	xmlhttp.send(null);
}

function boutton_load_end(string)
{
	temp = string.split(',');
	for(t=0;t<temp.length;t++)
	{
		boutton_list[t]=temp[t];
		boutton_list_end[t]=false;
	}
	boutton_loaded = true;
}

function boutton_render(ctx)
{
	var boutton_startx = 75;
	var boutton_starty = 265;

	if(!boutton_loaded)
	{
		ctx.fillStyle = "rgba("+color_conv("red")+",1.0)";
		ctx.fillText('Chargement des niveaux ...', boutton_x, boutton_y);
	}

	for(x=0;x<10;x++)
	{
		for(y=0;y<5;y++)
		{
			t=x+(y*10);
			if(boutton_list[t]>0)
			{
				var boutton_x = boutton_startx + 25*x;
				var boutton_y = boutton_starty + 25*y;

				if(boutton_list_survol[t])
				{
					brique(ctx,boutton_x,boutton_y,25,25,2,0,'white',0.85);
					if(boutton_list_end[t])
						ctx.fillStyle = "rgba("+color_conv("green")+",1.0)";
					else
						ctx.fillStyle = "rgba("+color_conv("red")+",1.0)";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(boutton_list[t], boutton_x+12.5, boutton_y+12.5);
				}
				else
				{
					if(boutton_list_end[t])
						brique(ctx,boutton_x,boutton_y,25,25,2,0,'green',0.85);
					else
						brique(ctx,boutton_x,boutton_y,25,25,2,0,'red',0.85);
					ctx.fillStyle = "rgba("+color_conv("white")+",1.0)";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(boutton_list[t], boutton_x+12.5, boutton_y+12.5);
				}
			}
		}
	}
	//brique(ctx,50,50,500,500,5,25,'white',0.85);
}

function boutton_click(event)
{
	var boutton_startx = 75;
	var boutton_starty = 265;

	for(t=0;t<temp.length;t++)
	{
		boutton_list_survol[t]=false;
	}

	for(x=0;x<10;x++)
	{
		for(y=0;y<5;y++)
		{
			t=x+(y*10);
			var boutton_x = boutton_startx + 25*x;
			var boutton_y = boutton_starty + 25*y;

			if(boutton_list[t]>0)
			{
				if(event.pageX > boutton_x+9 && event.pageX < boutton_x+34 && event.pageY > boutton_y+9 && event.pageY < boutton_y + 34 )
				{
					start_level_load(boutton_list[t]);
				}
			}
		}
	}
}

function boutton_survol(event)
{
	var boutton_startx = 75;
	var boutton_starty = 265;

	for(t=0;t<50;t++)
	{
		boutton_list_survol[t]=false;
	}

	for(x=0;x<10;x++)
	{
		for(y=0;y<5;y++)
		{
			t=x+(y*10);
			var boutton_x = boutton_startx + 25*x;
			var boutton_y = boutton_starty + 25*y;

			if(boutton_list[t]>0)
			{
				if(event.pageX > boutton_x+9 && event.pageX < boutton_x+34 && event.pageY > boutton_y+9 && event.pageY < boutton_y + 34 )
				{
					boutton_list_survol[t] = true;
				}
			}
		}
	}
}

function ending_lvl_color(lvl)
{
	temp =  find_boutton_by_lvl(lvl);
	if(temp>-1)
		boutton_list_end[temp] = true;
}

function find_boutton_by_lvl(lvl)
{
	for(t=0;t<50;t++)
	{
		if(boutton_list[t]==lvl)
			return t;
	}
	return -1;
}

function getHTTPObject_boutton()
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
					boutton_load_end(xmlhttp.responseText);
				}
			}
		}
	}
	return xmlhttp;
}
