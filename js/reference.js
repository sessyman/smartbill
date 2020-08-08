$('document').ready(
function(){

	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackButton, false);
		function onBackButton(){
			window.location.href = "home.html";
		}
	}
	
	/* validation */
	$("#balance-form").validate({
		rules:{password:{required: true,},user_email: {required: true, email: true},}, 
		messages:{password:{required: "please enter your password"}, user_email: "please enter your email address",}
	});  
	/* validation */
	
	$("#logout").click(function(){window.location.href = "index.html";});
	var agentphone = localStorage.getItem('Phone');
	if(agentphone == " "){window.location.href = "index.html";}
	$('#agent').append(' '+agentphone);
	//setTimeout(' window.location.href = "home.html"; ',8000);
	
	//Hide some form elements
	$('#done').hide();
	
	var isTransAvail = false;
	
	//Check with the server to see if this agent has made any request to make payment.
	var init = $("#balance-form").serializeArray();
	init.push({name: 'phone', value: agentphone});
	init.push({name: 'check', value: 'payment'});
	
	$('#reference').click(function(e){
		e.preventDefault();
		var data = $("#balance-form").serializeArray();
		data.push({name: 'phone', value: agentphone});
		data.push({name: 'payment', value: 'reference'});
		$.ajax({
			type : 'POST',
			url  : 'http://169.239.180.140/smartbill/php/balance.php',
			data : data,
			beforeSend: function(){
				$("#result").fadeOut();
				$("#reference").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
			},
			success : function(response){
				var echo = JSON.parse(response);
				if(echo.Code == "ok"){
					
					$("#reference").html('<img src="btn-ajax-loader.gif"/> &nbsp; Wait for reference...');
					$("#result").fadeIn(1000, function(){
						$("#result").html(
							'<div class="alert alert-success"> <span class="glyphicon glyphicon-ok"></span> &nbsp;<br/>Use the following payment reference: <br/>'+echo.Result+'</div>'
						);
						data.length = 0;
						$('#reference').hide();
						$("#done").show();
					});
				}
				else{
					alert(echo.Result + ' Contact Venus Dawn immediately.');
					setTimeout(' window.location.href = "home.html"; ',500);
				}
			},
			error : function(error){
				$("#result").fadeIn(1000, function(){
					$("#result").html(
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#reference").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Try Again');
				});
			}
		});
	});
	
	$('#done').click(function(e){e.preventDefault(); setTimeout('window.location.href = "home.html";',500);});
});