var background_active = 0;
var background_time = 60; // nombre de seconde par cycle
var last_cycle = 0;
var element = Array(50);

function set_background(bg)
{
	if(bg<0)
		bg=0;
	if(bg>1)
		bg=1;

	background_active = bg;
}

function render_background(ctx,quality)
{
	// calcul des cycles
	if(last_cycle+(60*1000) < timestamp())
		last_cycle = timestamp();

	// rendu
	if(background_active==0)
		background_space(quality);
	else if(background_active==1)
		background_ocean(quality);
}

function background_space(quality)
{
	// background_activ
	brique(ctx,0,0,600,600,0,0,"black",1.0);

	if(quality>0)
	{
		// valeur d'avancement du cycle
		avancement = timestamp() - last_cycle;

		// 1ere phase
		for(x=0;x<12;x++)
		{
			for(y=0;y<15;y++)
			{
				var posx = x*60+(Math.cos(x*543+y*467)*40)+(avancement/60);
				while(posx>600)
					posx=posx-600;
				var posy = y*40+(Math.cos(x*343+y*731)*20);
				ctx.beginPath();
				ctx.fillStyle = "rgba("+color_conv("white")+",1.0)";
				ctx.arc(posx,posy,0.5,0,Math.PI*2,true);
				ctx.fill();
			}
		}

		// 2ere phase
		for(x=0;x<8;x++)
		{
			for(y=0;y<10;y++)
			{
				var posx = x*80+(Math.cos(x*543+y*467)*80)+(avancement/60)*3;
				while(posx>600)
					posx=posx-600;
				var posy = y*60+(Math.cos(x*343+y*731)*60);
				ctx.beginPath();
				ctx.fillStyle = "rgba("+color_conv("white")+",1.0)";
				ctx.arc(posx,posy,1,0,Math.PI*2,true);
				ctx.fill();
			}
		}

		// 3ere phase
		for(x=0;x<2;x++)
		{
			for(y=0;y<3;y++)
			{
				var posx = x*300+(Math.cos(x*543+y*467)*300)+(avancement/60)*6;
				while(posx>600)
					posx=posx-600;
				var posy = y*200+(Math.cos(x*343+y*731)*200);
				ctx.beginPath();
				ctx.fillStyle = "rgba("+color_conv("white")+",1.0)";
				ctx.arc(posx,posy,2,0,Math.PI*2,true);
				ctx.fill();
			}
		}
	}
}

function background_ocean(quality)
{
	// background_activ
	brique(ctx,0,0,600,30,0,0,"cyan",1.0);
	//brique(ctx,0,25,600,25,0,0,"blue",1.0);
	brique(ctx,0,30,600,520,0,0,"blackblue",1.0);
	brique(ctx,0,550,600,50,0,0,"sand",1.0);

	if(quality>0)
	{
		// valeur d'avancement du cycle
		avancement = timestamp() - last_cycle;

		// vague
		ctx.beginPath();
		ctx.moveTo(0,30-Math.cos(avancement/600)*5-5);
		ctx.quadraticCurveTo(100+Math.cos(avancement/600)*50, 15-Math.cos(avancement/600)*5, 200, 30-Math.cos(avancement/600)*5-5);
		ctx.quadraticCurveTo(300+Math.cos(avancement/300)*50, 15-Math.cos(avancement/600)*5, 400, 30-Math.cos(avancement/600)*5-5);
		ctx.quadraticCurveTo(500+Math.cos(avancement/300)*50, 15-Math.cos(avancement/600)*5, 600, 30-Math.cos(avancement/600)*5-5);
		ctx.lineTo(600,30);
		ctx.lineTo(0,30);
		ctx.fillStyle = "rgba("+color_conv("blackblue")+",1.0)";
		ctx.fill();

		// les plante
		for(x=0;x<17;x++)
		{
			for(y=0;y<3;y++)
			{
				var posx = x*40+(Math.cos(x*543)*40);
				var posy = 560+(Math.cos(x*343)*10);
				ctx.beginPath();
				var base_taille = 75;
				if(y==1)
				{
					base_taille = 150;
					ctx.strokeStyle = "rgba("+color_conv("blackgreen")+",1.0)";
				}
				else
					ctx.strokeStyle = "rgba("+color_conv("green")+",1.0)";
				ctx.lineWidth = 4;
				ctx.moveTo(posx,posy);
				ctx.lineTo(posx+(y*15.0)-15.0+(Math.cos(avancement/1000+x*17+y*6)*5),posy-base_taille);
				ctx.stroke();
			}
		}
	}
}