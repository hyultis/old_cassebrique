function render(ctx,quality,img)
{
	render_background(ctx,quality);
	ball_render(ctx,quality);
	barre_render(ctx,quality);
	lvl_render(ctx,quality,img[2]);
	effet_render(ctx,quality,img[1]);

	if(block_remain()==0 && ready)
	{
		game=0;
		ready=false;
		ending_lvl_color(niveau);
	}
}

function lvl_render(ctx,quality,boom)
{
	for(var tx=0;tx<15;tx++)
	{
		for(var ty=0;ty<28;ty++)
		{
			if(brique_stat[tx][ty]>0)
			{
				vtx = tx*40;
				vty = ty*20;
				var alpha = 1.0;
				var border = 0;
				var radius = 0;
				if(quality==1)
				{
					border=1;
				}
				else if(quality==2)
				{
					border=1;
					radius=5;
					alpha=0.75;
				}
				if(brique_stat[tx][ty]==1) // brique bleu
					brique(ctx,vtx,vty,40,20,border,radius,"cyan",alpha);
				else if(brique_stat[tx][ty]==2) // brique bleu dure
					brique(ctx,vtx,vty,40,20,border,radius,"blue",alpha);
				else if(brique_stat[tx][ty]==3) // brique jaune
					brique(ctx,vtx,vty,40,20,border,radius,"yellow",alpha);
				else if(brique_stat[tx][ty]==4) // brique jaune dure
					brique(ctx,vtx,vty,40,20,border,radius,"orange",alpha);
				else if(brique_stat[tx][ty]==5) // brique vert
					brique(ctx,vtx,vty,40,20,border,radius,"green",alpha);
				else if(brique_stat[tx][ty]==6) // brique vert dure
					brique(ctx,vtx,vty,40,20,border,radius,"blackgreen",alpha);
				else if(brique_stat[tx][ty]==7) // brique indestructible
					brique(ctx,vtx,vty,40,20,border,radius,"grey",alpha);
				else if(brique_stat[tx][ty]==8) // brique phantome
					brique(ctx,vtx,vty,40,20,border,radius,"white",alpha/2);
				else if(brique_stat[tx][ty]==9) // brique explosive
				{
					brique(ctx,vtx,vty,40,20,border,radius,"red",alpha);
					if(quality>0)
						ctx.drawImage(boom,vtx,vty);
				}
				else if(brique_stat[tx][ty]==10) // brique bonus
					brique(ctx,vtx,vty,40,20,border,radius,"purple",alpha);
			}
		}
	}
}

function ball_render(ctx,quality)
{
	for(var t=0;t<10;t++)
	{
		if(ballv[t]!=0.0)
		{
			ctx.beginPath();
			if(t==0)
				ctx.fillStyle = "rgba("+color_conv("mball")+",1.0)";
			else
				ctx.fillStyle = "rgba("+color_conv("ball")+",1.0)";
			ctx.arc(ballx[t],bally[t],10,0,Math.PI*2,true);
			ctx.fill();
			if(quality>0)
			{
				ctx.strokeStyle = "rgba(0,0,0,1.0)";
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		}
	}
}

function barre_render(ctx,quality)
{
	if(quality==0)
		brique(ctx,mousex-(barres/2),barrey,barres,barreys,0,0,"barre",1.0);
	if(quality==1)
		brique(ctx,mousex-(barres/2),barrey,barres,barreys,1,0,"barre",1.0);
	if(quality==2)
		brique(ctx,mousex-(barres/2),barrey,barres,barreys,1,5,"barre",1.0);
}

function brique(ctx,x,y,width,height,border,radius,color,alpha)
{
	// limitation transparence
	if (alpha<0.0)
		alpha=0.0;
	if (alpha>1.0)
		alpha=1.0;

	// limitation arrondi
		var minimum = 0;
	if(width<height)
		minimum = width;
	else
		minimum = height;
	if(radius>minimum/2)
		radius = minimum/2;

	// tracer
	if(radius>0)
	{
		ctx.beginPath();
		ctx.moveTo(x,y+radius);
		ctx.lineTo(x,y+height-radius);
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
		ctx.lineTo(x+width-radius,y+height);
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
		ctx.lineTo(x+width,y+radius);
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
		ctx.lineTo(x+radius,y);
		ctx.quadraticCurveTo(x,y,x,y+radius);
		ctx.lineWidth = 1;

			// reflection
			var grad = ctx.createLinearGradient(x+width/2,y+height,x+width/2,y);
			grad.addColorStop(0, "rgba("+color_conv(color)+","+alpha+")");
			grad.addColorStop(1, "rgba("+color_conv_light(color)+","+alpha+")");
			ctx.fillStyle = grad;

		ctx.fill();
		if(border>0)
		{
			ctx.strokeStyle = "rgba(0,0,0,"+alpha+")";
			ctx.lineWidth = border;
			ctx.stroke();
		}



	}
	else
	{
		ctx.fillStyle = "rgba("+color_conv(color)+","+alpha+")";
		ctx.fillRect (x, y, width, height);
		if(border>0)
		{

			ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
			ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.lineTo(x,y+height);
			ctx.lineTo(x+width,y+height);
			ctx.lineTo(x+width,y);
			ctx.lineTo(x,y);
			ctx.lineWidth = border;
			ctx.strokeStyle = "rgba(0,0,0,"+alpha+")";
			ctx.stroke();
		}
	}
}

function effet_render(ctx,quality,boom)
{
	effet_gestion();
	for(var t=0;t<50;t++)
	{
		if(effet[t]!="n")
		{
			var reg=new RegExp("[|]+", "g");
			var donneeffet=effet[t].split(reg);
			if(quality>0)
			{
				ctx.drawImage(boom, donneeffet[1], donneeffet[2]);
			}
			else
			{
				ctx.fillStyle = "rgba("+color_conv("red")+",1.0)";
				ctx.fillRect (donneeffet[1], donneeffet[2], 120, 60);
			}
		}
	}
}

function color_conv(namecolor)
{
	if(namecolor=="barre")
		return "255,255,0";
	else if(namecolor=="mball")
		return "255,0,255";
	else if(namecolor=="ball")
		return "180,0,255";

	if((game_bonus_junk+15*1000)>timestamp())
	{
		var temp = (game_bonus_junk-timestamp())/15000.0;
		temp = Math.floor(temp*100)-50;
		temp = temp+(randomize(0,2000)-1000)/1000;
		return "255,"+Math.floor((Math.cos(temp)*125)+125)+",0";
	}

	if((game_bonus_dark+15*1000)>timestamp())
	{
		return "0,0,0";
	}

	if(namecolor=="sand")
		return "224,205,169";
	else if(namecolor=="yellow")
		return "255,255,0";
	else if(namecolor=="orange")
		return "255,165,0";
	else if(namecolor=="red")
		return "255,0,0";
	else if(namecolor=="fire")
		return "255,73,1";
	else if(namecolor=="pink")
		return "255,0,255";
	else if(namecolor=="purple")
		return "180,0,255";
	else if(namecolor=="blackblue")
		return "0,0,165";
	else if(namecolor=="blue")
		return "0,0,255";
	else if(namecolor=="cyan")
		return "0,255,255";
	else if(namecolor=="green")
		return "0,255,0";
	else if(namecolor=="blackgreen")
		return "0,165,0";
	else if(namecolor=="black")
		return "0,0,0";
	else if(namecolor=="grey")
		return "165,165,165";
	else
		return "255,255,255";
}

function color_conv_light(namecolor)
{
	var allvalue = color_conv(namecolor).split(",");
	var red = parseInt(allvalue[0])+100;
	if(red>255) red=255;
	var green = parseInt(allvalue[1])+100;
	if(green>255) green=255;
	var blue = parseInt(allvalue[2])+100;
	if(blue>255) blue=255;

	return red+","+green+","+blue;
}
