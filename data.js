$(document).ready(function(){
var head = document.getElementsByTagName("head")[0];
fn = "function showFrame(src, title){$('#ws-frame').attr('src',src);$('.ws-frame-wrapper h5').html('<a href = '+src+'>'+ title+' </a>');$('.ws-sidebar').animate({'width':'50%'},200);$('.ws-data-wrapper').css('display','none'); $('.ws-frame-wrapper').css('display','block');} function hideFrame(){$('#ws-frame').attr('src','');$('.ws-sidebar').animate({'width':'202px'},300, function(){$('.ws-data-wrapper').css('display','block'); $('.ws-frame-wrapper').css('display','none');});}";
var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = fn;
head.appendChild(script);

var references = new Array();
var articleCount = 0;
//BUTTON initialization
var toggleButton = document.createElement('div');
toggleButton.className = 'ws-toggle-button';
$(toggleButton).click(toggleSidebar);
var buttonText = document.createElement('p');
buttonText.innerHTML = "Toggle Sidebar";
$(toggleButton).append(buttonText);
//SIDEBAR initialization
var sidebar = document.createElement('div');
var sidebarDataWrapper = document.createElement('div');
sidebarDataWrapper.className = 'ws-data-wrapper';
sidebar.className = 'ws-sidebar';
chrome.storage.local.get('visible', function(results){
	if(results.visible) {
		$(sidebar).css({'right':'25px','display':'block'});
		sideBarShown = true;
	} 
	else {
		$(sidebar).css('right','-425px');
		sideBarShown = false;
	}
});
var sidebarTitle = document.createElement('h4');
if($(".references").length == 0)
{
	sidebarTitle.innerHTML = "No articles found on this page";
}
else{
	sidebarTitle.innerHTML = "Articles for: <br><strong> " + $("#firstHeading > span").html() + " </strong> ";	
}

$(sidebarDataWrapper).append(sidebarTitle);


var frameWrapper = document.createElement('div');
frameWrapper.className = 'ws-frame-wrapper';

var arrow = document.createElement('div');
arrow.className = 'ws-return-button';
$(arrow).html('>');
$(arrow).attr('onclick', 'hideFrame()');
$(frameWrapper).append(arrow);
$(frameWrapper).append(document.createElement('h5'));

var docFrame = document.createElement('iframe');
$(docFrame).attr('id','ws-frame');
$(frameWrapper).append(docFrame);
//data collection
var referencesList = document.createElement('ul');
$("body").append(toggleButton);
$("body").append(sidebar);
$(sidebar).append(sidebarDataWrapper);
$(sidebar).append(frameWrapper);


$(sidebarDataWrapper).append(referencesList);
$(".references a").each(function(i, ea){
	if($(ea).attr('href').indexOf('//www.ncbi.nlm.nih.gov/pmc')!=-1)
	{
		articleCount++;
		var link = "http:"+$(ea).attr('href');
		console.log(link);
		var title = '--';

		$.get(link, {}, function(response){
			var htmlLink = '"'+link+'/pdf"';
			title = $(response).find('.t')[0].childNodes[0].data;
			if(title.substring(0,1)!='"')
			{
				title = '"' +title+'"';
			}
			if(references.indexOf(title)==-1)
				$(referencesList).append("<li><a onclick = 'showFrame(" + htmlLink + "," + title +")'>" +title+ "</a></li>")
			references.push(title);
		});
	}
	else if($(ea).attr('href').indexOf('.pdf')!=-1)
	{
		var link = $(ea).attr('href');
		var title = '--';
		articleCount++;
		var htmlLink = '"'+link+'"';
		title = $(ea).html();
		if(title.substring(0,1)!='"')
		{
			title = '"' +title+'"';
		}
		if(references.indexOf(title)==-1)
			$(referencesList).append("<li><a onclick = 'showFrame("+ htmlLink + "," + title +")'>" +title+ "</a></li>")
		references.push(title);
	}
	if(i==$('.references a').length-1 && articleCount == 0)
	{
		$('.ws-data-wrapper h4').html('No articles found on this page');
	}
	})
function toggleSidebar()
{
	if(sideBarShown)
	{
		sideBarShown = false;	
		hideFrame();
		$(sidebar).animate({'right':'-425px'},300);
		chrome.storage.local.set({'visible':false});
	}
	else
	{
		sideBarShown = true;
		$(sidebar).animate({'right':'25px'},300);
		if($(sidebar).css('display')==='none')
			$(sidebar).css('display','block');
		chrome.storage.local.set({'visible':true});
	}

}
});

																																																																																																																																																

function showFrame(src){$('#ws-frame').attr('src',src);$('.ws-sidebar').animate({'width':'50%'},200);$('.ws-data-wrapper').css('display','none'); $('.ws-frame-wrapper').css('display','block');} function hideFrame(){$('#ws-frame').attr('src','');$('.ws-sidebar').animate({'width':'202px'},300, function(){$('.ws-data-wrapper').css('display','block'); $('.ws-frame-wrapper').css('display','none');});}