// BASIC CONFIGURATION
// General
ChannelName	= '';
Favicon = 1;
styleSwitch = 1;
Favicon_URL = 'https://cdn.jsdelivr.net/gh/JoelVCJ128/channels@a978707/logo.png';
DarkFavicon_URL = 'https://cdn.jsdelivr.net/gh/JoelVCJ128/channels@a978707/logo2.png';
// NavBar
MiniLogo = 1;
MiniLogo_URL	= 'https://cdn.jsdelivr.net/gh/JoelVCJ128/channels@a978707/logo.svg';
DarkMiniLogo_URL	= 'https://cdn.jsdelivr.net/gh/JoelVCJ128/channels@a978707/logo2.svg';
RemoveHomeLink = 1;
HeaderOptionMenu = 1;
AvatarDropMenu  = 1;
DefaultAvatar_URL	= 'https://cdn.jsdelivr.net/gh/JoelVCJ128/channels/avatar.jpg';

// If already loaded then reload
var LOADED = (typeof LOADED==="undefined") ? false : true;
LOADED ? document.location.reload() : '';

// GLOBAL VARIABLES IN LOCALSTORAGE
// General
DARKSTYLE = getOrDefault(CHANNEL.name+"_darkstyle", false);
TABMODE	= getOrDefault('SP_tabmode', 0);
// Layout
// NavBar

// Session global variables
SCROLLNAVBAR = false;

// Constants
DROPBOX		= 'https://dl.dropboxusercontent.com/s/';
VERSION		= '2.12.2';

// Buffer frequently used DOM elements

$body			= $("body");
$nav			= $("nav");
$chatwrap		= $("#chatwrap");
$chatheader		= $("#chatheader");
$userlisttoggle		= $("#userlisttoggle");
$userlist		= $("#userlist");
$messagebuffer		= $("#messagebuffer");
$chatline		= $("#chatline");
$videowrap		= $("#videowrap");
$videowrapHeader	= $("#videowrap-header");
$currenttitle		= $("#currenttitle");
$ytapiplayer		= $("#ytapiplayer");
$leftcontrols		= $("#leftcontrols");
$rightcontrols		= $("#rightcontrols");
$leftpane		= $("#leftpane");
$rightpane		= $("#rightpane");
$queue			= $("#queue");
$plmeta			= $("#plmeta");

/* ----- Global functions ----- */

// Page title
function pageTitle() {
	var title;
	if (TABMODE == 0) title = CHANNEL.opts.pagetitle
	else if (TABMODE == 1) {
		if (hasPermission("seeplaylist")) {
			if ($queue.find(".queue_entry").length > 0) title = $(".queue_active").data("media").title
			else title = '(nothing playing)';
		} else {
			if (CustomTitleCaption != "") title = $("#currenttitle").html().replace(CustomTitleCaption, "")
			else title = $("#currenttitle").html().replace("Currently Playing: ", "");
			if (!PLAYER) title = '(nothing playing)';
		}
	} else if (TABMODE == 2) title = '/' + CHANNELPATH + '/' + window.location.href.split("/").pop()
	else if (TABMODE == 3) {
		if (FOCUSED) title = '[' + CHATMSGNUM + '] chat message' + ((CHATMSGNUM != 1) ? 's' : '')
		else {
			title = '[' + CHATUNRNUM + ' | ' + CHATMSGNUM + '] unread message'
			      + ((CHATUNRNUM != 1) ? 's' : '');
		}
	}
	document.title = title;
	PAGETITLE = title;
}

// Fix "#mainpage" padding-top if navigation bar has non-standard height
function fixMainPadding() {$("#mainpage").css('padding-top', ($nav.outerHeight() + 8) + 'px');}

function navbarMode(mode) {
	if (mode == "static") {
		var html = '<a href="javascript:void(0)" title="Make navigation bar scrollable"><span class="glyphicon glyphicon-open"></span>Scrollable header</a>';
        $(".navbar-fixed-top").css({"position":"fixed", "margin-bottom":"20px"});
        $("#mainpage").css("padding-top", "60px");		
        $(window).bind("resize.mptop", function() {fixMainPadding();});
		fixMainPadding();
	} else if (mode == "scrollable") {
        var html ='<a href="javascript:void(0)" title="Make navigation bar static"><span class="glyphicon glyphicon-pushpin"></span>Fixed header</a>';
        $(".navbar-fixed-top").css({"position":"inherit", "margin-bottom":"8px"});
        $("#mainpage").css("padding-top", "0px");
		$(window).unbind("resize.mptop");
	}
	document.getElementById("navbar-unpin").innerHTML = html;
}
function addStyle(css, id) {
	var head = document.head;
	if (head) {
		var style = document.createElement("style");
		style.type = "text/css";
        style.id = id;
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	}
}
function change_favicon(img) {
    var favicon = document.querySelector('link[rel="shortcut icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'shortcut icon');
        var head = document.querySelector('head');
        head.appendChild(favicon);
    }
    favicon.setAttribute('type', 'image/png');
    favicon.setAttribute('href', img);
}
function setDarkStyle() {
var css = ':root {'
	+ '	 --bg1: #424242;' 
	+ '	 --bg2: #303030;' 
	+ '	 --bg3: #212121;'
	+ '	 --bt1: #616161;' 
	+ '	 --bt2: #fff;'
	+ '	 --bd1: rgba(255, 255, 255, 0.1);' 
	+ '	 --tx1: #fff;'
	+ '	 --tx2: #aaa;'
	+ '	 --ac1: #3ea6ff;' 
	+ '	 --ac3: #1c7c47;--dac3: #1de9b6;}'
	+ '.navbar-brand {background-image:url(' + DarkMiniLogo_URL + ') !important;';
    addStyle(css, 'darkStyle');
	change_favicon(DarkFavicon_URL);
}

/* ---------- [SECTION 3] USER INTERFACE ---------- */

if (DARKSTYLE && styleSwitch == 1) setDarkStyle();

// Alter brand link to channel URL
$("nav .navbar-brand").attr('href', document.URL);
// Adding channel logo on brand link
if (MiniLogo=="1" && MiniLogo_URL!="") { 
    var logo = 'url("' + MiniLogo_URL + '")';
	var _img = document.createElement('img');
	_img.src = logo.slice(4, -1).replace(/"/g, "").replace(/'/g, "");
	_img.addEventListener('load', function() {
		var _pl = Math.round(this.naturalWidth / this.naturalHeight * 36 + 20);
        $("a.navbar-brand").css({'background-image' : logo, 'background-repeat' : 'no-repeat', 'background-position' : '15px center', 'background-size' : 'auto 36px', 'padding-left' : '' + _pl + 'px'});
    });
}
// Changing channel name
if (ChannelName != "") {
    $(".navbar-brand").html(ChannelName);
    $(".navbar-brand").css({'content' : '' + ChannelName + '', 'font-size' : '14px', 'content-visibility' : 'visible'});
}
// Removing logoutform and home link
AvatarDropMenu == 1 ? $('#logoutform').remove() : '';
RemoveHomeLink == 1 ? $('#nav-collapsible .navbar-nav a:contains("Home")').remove() : '';

// Adding right nav bar header
$rightNavbar = $('<ul id="rightNavbar" class="nav navbar-nav pull-right"/>').appendTo("#nav-collapsible");
// Profile image and additional options in "Account" menu
var li = $('#nav-collapsible a:contains("Account")').parent('li.dropdown');
var menu = $('#nav-collapsible a:contains("Account")').parent().find("ul");
if (CLIENT.rank > 0) {
	AvatarDropMenu == 1 ? li.prependTo($rightNavbar) : '';
	var _li = $('<li class="centered">' + CLIENT.name + '</li>').prependTo(menu);
	var img = findUserlistItem(CLIENT.name).data().profile.image;
	if (img == "") img = DefaultAvatar_URL;
	AvatarDropMenu == 1 ? li.addClass('pull-right').find('a.dropdown-toggle').css({'padding':'6px','margin':'0px','margin-right':'10px'}).html('<img id="useravatar" src="' + img + '" title="' + CLIENT.name + '" style="max-width:35px; max-height:35px; padding:0; margin:4px" /><b class="caret"/>') : '';
	$('<a href="/account/profile" />').html('<img id="useravatar" src="' + img + '" title="' + CLIENT.name + '" style="min-width:60px; min-height:60px;max-width:90px; max-height:90px; margin-bottom:8px" />').appendTo(_li);
}
$('<li class="divider" />').appendTo(menu);
$('<li id="my-chat"></li>').appendTo(menu).html('<a href="javascript:void(0)"><span class="glyphicon glyphicon-calendar nav-cog"></span>Chat History</a>');
$('<li id="my-messages"></li>').appendTo(menu).html('<a href="javascript:void(0)"><span class="glyphicon glyphicon-file nav-cog"></span>Messages</a>');
$('<li id="my-mentions"></li>').appendTo(menu).html('<a href="javascript:void(0)"><span class="glyphicon glyphicon-envelope nav-cog"></span>Mentions</a>');

// Adding style switch button
if(styleSwitch) $styleSwitch = $('<div id="style-switch" class="pointer navbar-text"  />').appendTo($rightNavbar).html('<span class="glyphicon glyphicon-contrast" title="Switch style"></span>');

// Adding Header option menu
if (HeaderOptionMenu == 1) {
	$headerOptiondrop = $('<li id="headerOptionDrop" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="glyphicon glyphicon-cog" title="Header options"></span><b class="caret"/></a></li>').hover(
		function() {$(this).addClass("open");}, function() {$(this).removeClass("open");}
	).appendTo($rightNavbar);
	$headerOptionMenu = $('<ul id="headermenu" class="dropdown-menu pull-right" />').appendTo($headerOptiondrop);
	$navbarUp = $('<li id="navbar-up" />').appendTo($headerOptionMenu).html('<a href="javascript:void(0)" title="Collapse navigation bar"><span class="glyphicon glyphicon-chevron-up"></span>Collapse header</a>');
	$navbarUnpin = $('<li id="navbar-unpin" />').appendTo($headerOptionMenu).html('<a href="javascript:void(0)" title="Make navigation bar scrollable"><span class="glyphicon glyphicon-open"></span>Scrollable header</a>');
}

/* ---------- [SECTION 4] USER INTERFACE EVENTS ---------- */

// Not closing selected dropdown menus ('noclose' class) after clicking an option
$(document).on('click' + '.bs.dropdown.data-api', '.dropdown-menu.noclose > li', function (e) {
	e.stopPropagation();
})

// Reload channel after global "Options" save
$("#useroptions .modal-footer button:nth-child(1)").on("click", function() {
	document.location.reload();
});

$styleSwitch.on("click", function() {
    if(DARKSTYLE){
        var styles = document.getElementById('darkStyle');
		styles.parentNode.removeChild(styles);
		change_favicon(Favicon_URL);
    } else{
		setDarkStyle();
	}
	setOpt(CHANNEL.name+"_darkstyle", DARKSTYLE =! DARKSTYLE);
});


// Navigation bar mode icons events
$navbarUp.on("click", function() {
	$nav.hide();
	$navbarcollapsed = $('<div id="navbar-collapsed" class="centered maxwidth" />').css({'position':'fixed', 'top':'0px', 'left':'0px', 'padding-top':'0px', 'z-index':'504'}).appendTo("body");
	$('<div class="pointer" title="Expand navigation bar" />').appendTo($("#navbar-collapsed")).html('<span class="glyphicon glyphicon-chevron-down"></span>').css({'width':'40px', 'margin':'0 auto', 'padding':'2px'})
	.on("click", function() {
		$navbarcollapsed.remove();
		$nav.show();
	});
});

$navbarUnpin.on("click", function() {
    SCROLLNAVBAR ? navbarMode("static") : navbarMode("scrollable");
    SCROLLNAVBAR =! SCROLLNAVBAR;
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ---------- [SECTION 5] ORIGINAL SYNCHTUBE API EXTENSION ---------- */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Improved window focus
// source: "/www/js/ui.js" file

$(window).unbind("focus")
  .on("focus", function() {
	FOCUSED = true;
	clearInterval(TITLE_BLINK);
	TITLE_BLINK = false;
	CHATUNRNUM = 0;
	pageTitle();
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ---------- [SECTION 8] CSS AND FINAL LAYOUT ---------- */

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// Add UI CSS for events, it cannot be overrided by channel CSS
var css = '.centered {text-align:center !important}\n'
    + '.maxwidth {width:100% !important}\n';
$("link[href='/css/video-js.css']").after('<style id="premiumcss" type="text/css">' + css + '</style>');

// Notification if API has been succesfully loaded
LOADED = true;
var time = Math.round(new Date().getTime() - START) / 1000;
var cust = (CHANNEL.opts.externaljs.indexOf(DROPBOX + "1dyazoq6t7wh808/Premium.js") < 0) ? ' [customized]' : '';
addChatNotification('Script v. ' + VERSION + '' + cust + ' activated (in ' + time + ' s.)');