var url = "http://102.130.122.187/smartbill/php";
$('document').ready(
function(){
	localStorage.removeItem('Phone');
	
	/* login submit */
	$('#btn-login').click(function(e){
		e.preventDefault();
		
		if($('#terms').is(':checked')){
			
		}
		else{
			alert('You must accept our terms and conditions first.');
			return false;
		}
		
		if($('#terms').is(':checked')){
			
		}
		else{
			alert('You must accept our terms and conditions first.');
			return false;
		}
		var data = $("#login-form").serialize();
		var agentphone = jQuery('input[name="phonenumber"]').val();
		localStorage.setItem('Phone', agentphone);
		$.ajax({
			type : 'POST',
			url  : url+'/login_process.php',
			data : data,
			beforeSend: function(){
				$("#error").fadeOut();
				$("#btn-login").html('<img src="btn-ajax-loader.gif" /> &nbsp; Signing In ...');
			},
			success : function(response){
				console.log(response);
				data = jQuery.parseJSON(response);
				console.log(data);
				if(data.Code=="ok" || data.Code=="OK"){
					$("#btn-login").html('<img src="btn-ajax-loader.gif" /> &nbsp; Signing In ...');
					setTimeout(' window.location.href = "home.html"; ',50);
				}
				else if(data.Code == "Failed"){
					$("#error").fadeIn(100, function(){
						$("#error").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <br/>'+data.Message+' !</div>'
						);
						$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
					});
				}
				else{
					$("#error").fadeIn(100, function(){
						$("#error").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+data.Message+' !</div>'
						);
						$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
					});
				}
			},
			error : function(error){
				$("#error").fadeIn(100, function(){
					$("#error").html(
					
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
				});
			}
		});
		return false;
	});
	/* login submit */
	
	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackButton, false);
		function onBackButton(){
			navigator.app.exitApp();
		}
	}
	
});
