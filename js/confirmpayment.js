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
	
	$('#done').hide()
	
	$('#balance').click(function(e){
		e.preventDefault();
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
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-ok"></span> &nbsp;  <br/>Thank you. Your balance will be ajusted as soon as possible.</div>'
						);
						data.length = 0;
						$('#balance').hide();
						$('#done').show();
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
	
	$('#done').click(function(e){e.preventDefault(); setTimeout('window.location.href = "home.html";',500);});
});