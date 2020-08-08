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
	$("#issue-form").validate({
		rules:{password:{required: true,},user_email: {required: true, email: true},}, 
		messages:{password:{required: "please enter your password"}, user_email: "please enter your email address",}
	});  
	/* validation */
	
	$("#logout").click(function(){window.location.href = "index.html";});
	var agentphone = localStorage.getItem('Phone');
	if(agentphone == " "){window.location.href = "index.html";}
	$('#agent').append(' '+agentphone);
	//setTimeout(' window.location.href = "home.html"; ',8000);
	
	/* get airtime*/
	$('#issuebtn').click(function(e){
		e.preventDefault();
		var data = $("#issue-form").serializeArray();
		data.push({name: 'phone', value: agentphone});
		data.push({name: 'purpose', value: 'client'});
		$.ajax({
			type : 'POST',
			url  : 'http://169.239.180.140/smartbill/php/issues.php',
			data : data,
			beforeSend: function(){
				$('#result').fadeOut();
				$('#issuebtn').html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
			},
			success : function(response){
				if(response == "ok"){
					$("#issuebtn").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please wait...');
					$('#issue').hide();
					$("#result").fadeIn(100, function(){
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-ok"></span> &nbsp;  Thank you. The issue has been submitted. It will be attended as soon as possible.</div>'
						);
						data.length = 0;
						$("#issuebtn").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Wait...');
						setTimeout(' window.location.href = "home.html"; ',4000);
					});
				}
				else{
					console.log(response);
				}
			},
			error : function(error){
				$("#result").fadeIn(100, function(){
					$("#result").html(
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#issuebtn").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
				});
			}
		});
	});
});