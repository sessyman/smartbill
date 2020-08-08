var url = "http://102.130.122.187/smartbill/php";

$('document').ready(
function(){

	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackButton, false);
		function onBackButton(){
			var confirmation = confirm('You are about to exit Smartbill app.');
			if(confirmation == true){
				navigator.app.exitApp();
			}
			else{
			
			}
		}
	}
	
	$("#logout").click(function(){
		window.location.href = "index.html";
	});
	var agentphone = localStorage.getItem('Phone');
	if(agentphone == " "){window.location.href = "index.html";}
	$('#agent').append(' '+agentphone);
	var cash = numeral(1000).format('M0,0.00');
	
	
	
	//Send heartbeat
	$.post(
		url+"/heartbeat.php",
		{phone:agentphone}, 
		function(response, status){
			if(response == "ok"){
				$('#status').attr('class','glyphicon glyphicon-ok');
			}
			else{
				$('#status').attr('class','glyphicon glyphicon-remove');
			}
		}
	);
	
	$.post(
		url+"/homedata.php",
		{phone:agentphone}, 
		function(response, status){
			var data = jQuery.parseJSON(response);
			$.each(data,function(i,v)
			{
				if(i == "Phone"){
					$("#agentnumber").append(" "+v);
				}
				if(i == "Businessname"){
					$("#business").append(" "+v);
				}
				if(i == "Balance"){
					v = numeral(v).format('M0,0.00');
					$("#balance").append(" M "+v);
				}
			});
		}
	);
	
	//Pull remaining econet airtime data
	$.post(
		url+"/available.php",
		{phone:agentphone, purpose:'airtime', vendor:'econet'}, 
		function(response){
			//alert(response);
			var data = jQuery.parseJSON(response);
			$.each(data,function(i,v)
			{
				if(i == "A5"){
					if(v > 0){
						$("#efive").append(' Available');
					}
					else{
						$("#efive").append(' Not Available');
					}
				}
				else if(i == "A10"){
					if(v > 0){
						$("#eten").append(' Available');
					}
					else{
						$("#eten").append(' Not Available');
					}
				}
				else if(i == "A20"){
					if(v > 0){
						$("#etwenty").append(' Available');
					}
					else{
						$("#etwenty").append(' Not Available');
					}
				}
				else if(i == "A50"){
					if(v > 0){
						$("#efifty").append(' Available');
					}
					else{
						$("#efifty").append(' Not Available');
					}
				}
				else if(i == "A100"){
					if(v > 0){
						$("#ehundred").append(' Available');
					}
					else{
						$("#ehundred").append(' Not Available');
					}
				}
				else if(i == "A200"){
					if(v > 0){
						$("#etwohundred").append(' Available');
					}
					else{
						$("#etwohundred").append(' Not Available');
					}
				}
			});
		}
	);
	
	//Pull remaining Vodacom airtime data
	$.post(
		url+"/available.php",
		{phone:agentphone, purpose:'airtime', vendor:'vodacom'}, 
		function(response){
			//alert(response);
			var data = jQuery.parseJSON(response);
			$.each(data,function(i,v){
				if(i == "A5"){
					if(v > 0){
						$("#vfive").append(' Available');
					}
					else{
						$("#vfive").append(' Not Available');
					}
				}
				else if(i == "A10"){
					if(v > 0){
						$("#vten").append(' Available');
					}
					else{
						$("#vten").append(' Not Available');
					}
				}
				else if(i == "A20"){
					if(v > 0){
						$("#vtwenty").append(' Available');
					}
					else{
						$("#vtwenty").append(' Not Available');
					}
				}
				else if(i == "A50"){
					if(v > 0){
						$("#vfifty").append(' Available');
					}
					else{
						$("#vfifty").append(' Not Available');
					}
				}
				else if(i == "A100"){
					if(v > 0){
						$("#vhundred").append(' Available');
					}
					else{
						$("#vhundred").append(' Not Available');
					}
				}
				else if(i == "A200"){
					if(v > 0){
						$("#vtwohundred").append(' Available');
					}
					else{
						$("#vtwohundred").append(' Not Available');
					}
				}
			});
		}
	);
});

