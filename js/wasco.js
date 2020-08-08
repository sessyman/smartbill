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
	$("#wasco-form").validate({
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
	/* wasco submit */
	$('#btn-wasco').click(function(e){
		e.preventDefault();
		var data = $("#wasco-form").serializeArray();
		data.push({name: 'phone', value: agentphone});
		data.push({name: 'vendor', value: 'wasco'});
		data.push({name: 'confirmed', value: 'false'});
		
		$.ajax({
			type : 'POST',
			url  : 'http://169.239.180.140/smartbill/php/wasco.php',
			data : data,
			beforeSend: function(){
				$("#result").fadeOut();
				$("#btn-wasco").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
			},
			success : function(response){
				var result = JSON.parse(response);
				if(result.Confirmation == "ConfirmationRequired"){
					data.length = 0;
					$("#btn-wasco").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
					$("#result").fadeIn(100, function(){
							$("#btn-wasco").hide();
							$("#account").hide();
							$("#usernumber").hide();
							$("#amount").hide();
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Confirm Account details.<br/> <strong>Account #:</strong> '+result.Account+'<br/><strong>Owner:</strong> '+result.Owner+'<br/><strong>Location:</strong> '+result.Location+'<br/><strong>User Phonenumber:</strong> '+result.Userphone+'<br/><strong>Amount Paid:</strong> '+result.Amount+'<br/>'
						);
						$("#btn-confirm").css("visibility","visible");
						$("#btn-cancel").css("visibility","visible");
					});
					
					$('#btn-cancel').click(function(e){e.preventDefault(); setTimeout(' window.location.href = "wasco.html"; ',10);});
					
					$('#btn-confirm').click(function(e){
						e.preventDefault();
						data.push({name: 'confirmed', value: 'true'});
						data.push({name: 'phone', value: result.Agentphone});
						data.push({name: 'vendor', value: result.Vendor});
						data.push({name: 'account', value: result.Account});
						data.push({name: 'usernumber', value: result.Userphone});
						data.push({name: 'amount', value: result.Amount});
						data.push({name: 'owner', value: result.Owner});
						$.ajax({
							type : 'POST',
							url  : 'http://169.239.180.140/smartbill/php/wasco.php',
							data : data,
							beforeSend: function(){
								$("#result").fadeOut();
								$("#result").html('');
								$('#btn-cancel').hide();
								$("#btn-confirm").html('<span class="glyphicon glyphicon-wasco"></span> &nbsp; Processing, wait...');
							},
							success : function(response){
								var result = JSON.parse(response);
								if(result.Code == "OK"){
									$("#btn-confirm").html('<img src="btn-ajax-loader.gif" /> &nbsp; Processing, wait...');
									$("#result").fadeIn(1000, function(){
										$("#btn-wasco").hide();
										$("#btn-confirm").hide();
										$("#btn-cancel").hide();
										$("#account").hide();
										$("#usernumber").hide();
										$("#amount").hide();
										$("#result").html(
											'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <strong>Bill Payment Complete:</strong><br/> '+result.Response+' </div>'
										);
									});
									setTimeout(' window.location.href = "wasco.html"; ',5000);
								}
								else if(result.Code == "Done"){
									$("#result").html('');
									data.length = 0;
									$("#result").fadeIn(100, function(){
										$("#btn-wasco").hide();
										$("#btn-confirm").hide();
										$("#btn-cancel").hide();
										$("#account").hide();
										$("#usernumber").hide();
										$("#amount").hide();
										$("#result").html(
											'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+result.Response+' </div>'
										);
										setTimeout(' window.location.href = "wasco.html"; ',500);
									});
								}
								else if(result.Code == "Failed"){
									data.length = 0;
									$("#result").fadeIn(100, function(){
										$("#btn-wasco").hide();
										$("#btn-confirm").hide();
										$("#btn-cancel").hide();
										$("#account").hide();
										$("#usernumber").hide();
										$("#amount").hide();
										$("#result").html(
											'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+result.Response+': Please try again or Contact Venus Dawn</div>'
										);
										setTimeout(' window.location.href = "wasco.html"; ',3000);
									});
								}
							},
							error : function(error){
								$("#result").fadeIn(1000, function(){
									$("#btn-wasco").hide();
									$("#btn-confirm").hide();
									$("#btn-cancel").hide();
									$("#account").hide();
									$("#usernumber").hide();
									$("#amount").hide();
									$("#result").html(
										'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
									);
								});
							}
						});
					});	
				}
				if(result.Code == "OK"){
					$("#btn-confirm").html('<img src="btn-ajax-loader.gif" /> &nbsp; Completing bill payment, wait...');
					$("#result").fadeIn(1000, function(){
						$("#btn-wasco").hide();
						$("#btn-confirm").hide();
						$("#btn-cancel").hide();
						$("#account").hide();
						$("#usernumber").hide();
						$("#amount").hide();
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+result.Response+' </div>'
						);
						setTimeout(' window.location.href = "wasco.html"; ',5000);
					});
				}
				else if(result.Code == "Done"){
					$("#result").html('');
					data.length = 0;
					$("#result").fadeIn(1000, function(){
						$("#btn-wasco").hide();
						$("#btn-confirm").hide();
						$("#btn-cancel").hide();
						$("#account").hide();
						$("#usernumber").hide();
						$("#amount").hide();
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+result.Response+' </div>'
						);
						setTimeout(' window.location.href = "wasco.html"; ',5000);
					});
				}
				else if(result.Code == "Failed"){
					data.length = 0;
					$("#result").fadeIn(1000, function(){
						$("#btn-wasco").hide();
						$("#btn-confirm").hide();
						$("#btn-cancel").hide();
						$("#account").hide();
						$("#usernumber").hide();
						$("#amount").hide();
						$("#result").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+result.Response+': Please try again or Contact Venus Dawn</div>'
						);
						setTimeout(' window.location.href = "wasco.html"; ',5000);
					});
				}
			},
			error : function(error){
				$("#result").fadeIn(1000, function(){
					$("#btn-wasco").hide();
					$("#btn-confirm").hide();
					$("#btn-cancel").hide();
					$("#account").hide();
					$("#usernumber").hide();
					$("#amount").hide();
					$("#result").html(
						'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
					);
					$("#btn-wasco").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
				});
			}
		});
	});
	/* wasco submit */
});