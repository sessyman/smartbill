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
	
	//Hide all form elements
	$('#amount').hide();
	$('#balance').hide();
	
	var isTransAvail = false;
	
	//Check with the server to see if this agent has made any request to make payment.
	var init = $("#balance-form").serializeArray();
	init.push({name: 'phone', value: agentphone});
	init.push({name: 'check', value: 'payment'});
	
	$.ajax({
		type : 'POST',
		url  : 'http://169.239.180.140/smartbill/php/balance.php',
		data : init,
		beforeSend: function(){
			$("#result").fadeOut();
			$("#reference").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
		},
		success: function(response){
			if(response == "yes"){
				window.location.href = "confirmpayment.html";
			}
			else if(response == "no"){
				isTransAvail = false;
				window.location.href = "getreference.html";
			}
			else{
				alert(response+' Contact Venus Dawn immediately.');
			}
		},
		error : function(error){
			$("#result").fadeIn(1000, function(){
				$("#result").html(
					'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
				);
				$("#balance").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Try Again');
			});
		}
	});
	
	$('#balance').click(function(){
		var data = $("#balance-form").serializeArray();
		data.push({name: 'phone', value: agentphone});
		data.push({name: 'payment', value: 'confirmation'});
		$.ajax({
			type : 'POST',
			url  : 'http://169.239.180.140/smartbill/php/balance.php',
			data : data,
			beforeSend: function(){
				$("#result").fadeOut();
				$("#balance").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
			},
			success : function(response){
				if(response == "ok"){
					$("#balance").html('<img src="btn-ajax-loader.gif"/> &nbsp; Please wait...');
					$('#amount').hide();
					$("#result").fadeIn(1000, function(){
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-ok"></span> &nbsp;  Thank you. Your balance will be ajusted as soon as possible.</div>'
						);
						data.length = 0;
						$("#balance").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Wait...');
					});
				}
				else{
					alert(response + ' Contact Venus Dawn immediately.');
					$("#balance").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Confirm Payment');
				}
			},
			error : function(error){
				$("#result").fadeIn(1000, function(){
					$("#result").html(
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#balance").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Try Again');
				});
			}
		});
	});
});