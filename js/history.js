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
	$("#history-form").validate({
		rules:{password:{required: true,},user_email: {required: true, email: true},}, 
		messages:{password:{required: "please enter your password"}, user_email: "please enter your email address",}		
	});  
	/* validation */
	
	$("#logout").click(function(){window.location.href = "index.html";});
	var agentphone = localStorage.getItem('Phone');
	if(agentphone == " "){window.location.href = "index.html";}
	$('#agent').append(' '+agentphone);
	//setTimeout(' window.location.href = "home.html"; ',8000);
	var data = "";
	var result = "";
	
	/*General history submit */
	$('#btn-history').click(function(e){
		e.preventDefault();
		var data = $("#history-form").serializeArray();
		data.push({name: 'phone', value: agentphone});
		data.push({name: 'purpose', value: 'generalhistory'});
		//setTimeout('',10);
		
		$.ajax({
			type : 'POST',
			url  : 'http://169.239.180.140/smartbill/php/recent.php',
			data : data,
			beforeSend: function(){	
				$("#result").fadeOut();
				$("#btn-history").html('<span class="glyphicon glyphicon-list"></span> &nbsp; Retrieving histrory, wait...');
			},
			success : function(response){				
				data.length = 0;
				$("#btn-history").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
				$("#result").fadeIn(1000, function(){					
					$("#result").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span><br/>'+response+'</div>');
					$("#btn-history").html('<span class="glyphicon glyphicon-list"></span> &nbsp; Get Account History');
				});
				
				$('#btn-cancel').click(function(e){e.preventDefault(); setTimeout(' window.location.href = "history.html"; ',10);});		
			},
			error : function(error){				
				$("#result").fadeIn(100, function(){						
					$("#result").html(
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
				});
			}		
		});
	});
	/*General history submit */
	 
	/*Phone search submit */
	$('#phonesearch').keyup(function(e){
		e.preventDefault();
		if($('#phonesearch').val().length === 8){
			var data = $("#history-form").serializeArray();
			data.push({name: 'phone', value: agentphone});
			data.push({name: 'purpose', value: 'phonesearch'});
			console.log(data);
			//setTimeout('',10);
			
			$.ajax({
				type : 'POST',
				url  : 'http://169.239.180.140/smartbill/php/recent.php',
				data : data,
				beforeSend: function(){	
					$("#result").fadeOut();
					$("#btn-history").html('<span class="glyphicon glyphicon-history"></span> &nbsp; Retrieving histrory, wait...');
				},
				success : function(response){				
					data.length = 0;
					$("#btn-history").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
					$("#result").fadeIn(1000, function(){
						$("#btn-history").hide();
						$("#result").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign">'+response+'</span></div>');					
					});
					
					$('#btn-cancel').click(function(e){e.preventDefault(); setTimeout(' window.location.href = "history.html"; ',10);});		
				},
				error : function(error){				
					$("#result").fadeIn(100, function(){						
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
						);
						$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
					});
				}		
			});
		}
		
	});
	/*Phone search submit */
});