var ballx = new Array(9);
var bally = new Array(9);
var balla = new Array(9);
var ballv = new Array(9);
var ballh = new Array(9);

var barres = 0;
var barrey = 0;
var barreys = 0;

var game = 0;
var score = 0;
var multi = 1;
var loseball = 0;
var time_start = 0;

var effet;

var img;

var game_bonus_x4	= 0;// score x4 for 15sec
var game_bonus_hammer	= 0;// hammer time (prochain collision avec la barre surchage la balle)
var game_bonus_slow 	= 0;// slowtime 15sec
var game_bonus_fast 	= 0;// fasttime 15sec
var game_bonus_dark 	= 0;// dark zone 20sec
var game_bonus_junk 	= 0;// junk zone 20sec
var game_bonus_resize 	= 0;// redimentionne aleatoirement la barre [-2,-1,0,+1,+2]

function init()
{
	img = new Array();
	for(var t=0;t<10;t++)
		img[t]=new Image();
	img[1].src = 'img/boom.png';
	img[2].src = 'img/tnt.png';

	boutton_load();

	barreinit();
	ballinit(-1);
	for(var t=1;t<10;t++)
		delete_ball(t);
	effetinit()
	level_init();
}

function ballinit(n)
{
	if(n==-1)
	{
		for(var t=0;t<10;t++)
		{
			ballx[t] = 300;
			bally[t] = barrey - 25;
			balla[t] = randomize(135,225);
			ballv[t] = 480;
			ballh[t] = 0;
		}
	}
	else
	{
		ballx[n] = 300;
		bally[n] = barrey - 25;
		balla[n] = randomize(135,225);
		ballv[n] = 8.0;
		ballh[t] = 0;
	}
}

function ball(ctx,n)
{
	if(ballv[n]==0.0)
		return;

	var ballxold = ballx[n];
	var ballyold = bally[n];

	// calcul des positions
	ballx[n] = ballx[n] + Math.cos((Math.PI/180.0)*balla[n])*(ballv[n]/2); // (Math.PI/360)*
	bally[n] = bally[n] + Math.sin((Math.PI/180.0)*balla[n])*(ballv[n]/2);

	// bordure collision
	if(ballx[n]-10<0)
	{
		ballx[n] = ballxold;
		if(balla[n]>180.0)
			balla[n] = balla[n]+270.0;
		else		
			balla[n] = balla[n]-270.0;

		if(balla[n]>360.0)
			balla[n] - 360.0;

		if(balla[n]<0.0)
			balla[n] + 360.0;
			
		ballv[n] = ballv[n] + 0.1;
	}
	if(ballx[n]+5>600)
	{
		ballx[n] = ballxold;
		balla[n] = randomize(135,225);
		ballv[n] = ballv[n] + 0.1;
	}
	if((bally[n]-10<0))
	{
		bally[n] = ballyold;
		balla[n] = randomize(45,135);
		ballv[n] = ballv[n] + 0.1;
	}
	if(bally[n]+10>600)
	{
		if(n==0)
			game_lost();
		else
			delete_ball(n);
	}
	// barre collision
	if((ballx[n]+10>(mousex-barres/2)) && (ballx[n]-10<(mousex+barres/2)) && (bally[n]+10>barrey))
	{
		bally[n] = bally[n]-((bally[n]+10)-barrey);
		balla[n] = randomize(225,315);
		ballv[n] = ballv[n] + 0.1;
		if(game_bonus_hammer>0)
		{
			ballh[n] = 5;
			game_bonus_hammer--;
		}
		game_score(9);
	}

	// collision brique
	for(t=0;t<4;t++)
	{
		if(t==0)
		{
			posx = (Math.floor((ballx[n]-10)/40)*40);
			posy = (Math.floor((bally[n])/20)*20);
		}
		if(t==1)
		{
			posx = (Math.floor((ballx[n]+10)/40)*40);
			posy = (Math.floor((bally[n])/20)*20);
		}
		if(t==2)
		{
			posx = (Math.floor((ballx[n])/40)*40);
			posy = (Math.floor((bally[n]-10)/20)*20);
		}
		if(t==3)
		{
			posx = (Math.floor((ballx[n])/40)*40);
			posy = (Math.floor((bally[n]+10)/20)*20);
		}

		if(is_collision_cube(ballx[n], bally[n], ballx[n]+20, bally[n]+20,posx, posy, posx+40, posy+20) && brique_exist(posx/40,posy/20))
		{
			bally[n] = ballyold;
			ballx[n] = ballxold;
			ballv[n] = ballv[n] + 0.1;
			brique_delete(posx/40,posy/20);
			game_score(22);

			temp1 = ballx[n] - (posx+20);
			temp2 = bally[n] - (posy+10);
			temp3 = Math.atan(temp1 / temp2)/(Math.PI/180.0);

			if(temp1 < 0)
				temp3 = 180 + temp3;

			balla[n] = temp3;
		}
	}


	// vitesse maximum
	if(ballv[n]>13.0)
		ballv[n] = 13.0;

	if((game_bonus_slow+14*1000)>timestamp())
	{
		ballv[n] = 4.0;
	}
	else if((game_bonus_slow+15*1000)>timestamp())
	{
		ballv[n] = 13.0;
	}

	if((game_bonus_fast+15*1000)>timestamp())
	{
		ballv[n] = 26.0;
	}

}

function is_collision_cube(x1, y1, w1, h1, x2, y2, w2, h2)
{
    if(x1+w1<x2) return false;
    if(x2+w2<x1) return false;
    if(y1+h1<y2) return false;
    if(y2+h2<y1) return false;

    return true;
}

function barreinit()
{
	barres = 200;
	barrey = 550;
	barreys = 15;
}

function game_pause()
{
	game=1;
}

function game_lost()
{
	game_bonus_x4		= 0;// score x4 for 15sec
	game_bonus_hammer	= 0;// hammer time (prochain collision avec la barre surchage la balle)
	game_bonus_slow 	= 0;// slowtime 15sec
	game_bonus_fast 	= 0;// fasttime 15sec
	game_bonus_dark 	= 0;// dark zone 20sec
	game_bonus_junk 	= 0;// junk zone 20sec
	game_bonus_resize 	= 0;// reini taille barre

	score = Math.round(score / 1.5);
	ballinit(0);
	game_pause();
}

function game_score(add)
{
	add = add * multi;

	// dans le cas du bonus x4
	if((game_bonus_x4+15*1000)>timestamp())
		score = score + add*4;
	else
		score = score + add;
}



////////////////////////////////////////////////////////////////////////////////
//                                  BONUS
////////////////////////////////////////////////////////////////////////////////

function random_bonus()
{
	var randomn = randomize(0,6);
	get_bonus(randomn);
}

function get_bonus(n)
{
	if(n==0)
		game_bonus_x4 = timestamp();// score x4 for 15sec
	else if(n==1)
		game_bonus_hammer++;// hammer time (prochain collision avec la barre surchage la balle)
	else if(n==2)
		{game_bonus_slow = timestamp();game_bonus_fast = 0}// slowtime 15sec
	else if(n==3)
		{game_bonus_fast = timestamp();game_bonus_slow = 0}// fasttime 15sec
	else if(n==4)
		{add_ball();add_ball();}
	else if(n==5)
		game_bonus_dark = timestamp();// dark zone 15sec
	else if(n==6)
		game_bonus_junk = timestamp();// junk zone 15sec
}

function add_ball(n)
{
	var temp = find_ball();
	if(temp>0)
		ballinit(temp);
}

function delete_ball(n)
{
	ballv[n]=0.0;
}

function find_ball()
{
	for(var t=0;t<10;t++)
	{
		if(ballv[t]==0.0)
			return t;
	}
	return -1;
}

////////////////////////////////////////////////////////////////////////////////
//                                  EFFET
////////////////////////////////////////////////////////////////////////////////

function effetinit()
{
	effet = new Array(50);
	effettime = timestamp();
	for(var t=0;t<50;t++)
	{
		effet[t]="n";
	}
}

function find_free_effet()
{
	for(var t=0;t<50;t++)
	{
		if(effet[t]=="n")
			return t;
	}
	return -1;
}

function add_effet(type,x,y,time)
{
	effet[find_free_effet()]=type+"|"+x+"|"+y+"|"+(timestamp()+time);
}

function delete_effet(id)
{
	if(id<0)
	{
		for(t=0;t<50;t++)
			effet[t]="n";
	}
	else
		effet[id]="n";
}

function effet_gestion()
{
	for(var t=0;t<50;t++)
	{
		if(effet[t]!="n")
		{
			var donneeffet=effet[t].split('|');
			if(donneeffet[3]<timestamp())
				delete_effet(t);
		}
	}
}


