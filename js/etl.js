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
		$("#etl-form").validate({
			rules:{password:{required: true,},user_email: {required: true, email: true},}, 
			messages:{password:{required: "please enter your password"}, user_email: "please enter your email address",}
		});  
		/* validation */
		
		$("#logout").click(function(){window.location.href = "index.html";});
		var agentphone = localStorage.getItem('Phone');
		if(agentphone == ""){window.location.href = "index.html";}
		$('#agent').append(' '+agentphone);
		//setTimeout(' window.location.href = "home.html"; ',8000);
		var data = "";
		var result = "";
		/*get airtime*/
		$('#btn-etl').click(function(e){
			e.preventDefault();
			var data = $("#etl-form").serializeArray();
			var confirmation = confirm('You are about to send airtime to the following: \r\nEmail: '+data[0].value+'\r\nPhone Number: '+data[1].value+'\r\nAmount: '+data[2].value);
			if(confirmation == true){
				data.push({name: 'phone', value: agentphone});
				data.push({name: 'key', value: '480067'});
				data.push({name: 'vendor', value: 'econet'});
				data.push({name: 'mode', value: ''});
				$.ajax({
					type : 'POST',
					url  : 'http://169.239.180.140/smartbill/php/airtime.php',
					data : data,
					beforeSend: function(){
						$("#result").fadeOut();
						$("#btn-etl").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
					},
					success : function(response){
						var data = jQuery.parseJSON(response);
						if(data.Code == "Success"){
							$('#qetl-form').hide();
							$("#result").html('');
							$('#usernumber').hide();
							$('#email').hide();
							$('#usernumber').val('');
							$('#amount').hide();
							$('#amount').val('');
							$("#btn-etl").html('<img src="btn-ajax-loader.gif" /> &nbsp; Completing airtime purchase...');
							$("#result").fadeIn(1000, function(){
								$("#result").html(
									'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <strong>Airtime Details:</stong><br/><br/>PIN: '+data.PIN+'<br/>Serial No.: '+data.Serial+'<br/>Expiry Date: '+data.Expiry+'</div>'
								);
								data.length = 0;
								$('#btn-etl').hide();
								$("#done").css("visibility","visible");
								$("#print").css("visibility","visible");
							});
						}
						else if(data.Code === "Error"){
							$('#qetl-form').hide();
							$("#result").html('');
							$("#result").fadeIn(1000, function(){
								$("#usernumber").hide();
								$('#email').hide();
								$("#amount").hide();
								$("#btn-etl").hide();
								$("#result").html(
									'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp;<br/> '+data.Result+' Please try again or contact Venus Dawn</div>'
								);
								data.length = 0;
								setTimeout('window.location.href = "home.html";',7000);
							});
						}
						else{
							alert(response+' Contact Venus Dawn Technologies Imediately!!!');
							setTimeout('window.location.href = "home.html";',7000);
						}
					},
					error : function(error){
						$("#result").fadeIn(1000, function(){
							$("#result").html(
								'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
							);
							$("#btn-etl").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Confirm Airtime Purchase');
						});
					}
				});
			}
			else{
				//Do nothing.
			}
		});
		$('#done').click(function(e){e.preventDefault(); setTimeout('window.location.href = "home.html";',500);});
		
		//Quick airtime
		$('#qbtn-etl').click(function(e){
			e.preventDefault();
			var data = $("#qetl-form").serializeArray();
		
			data.push({name: 'phone', value: agentphone});
			data.push({name: 'key', value: '480067'});
			data.push({name: 'vendor', value: 'econet'});
			data.push({name: 'mode',value: 'quickmode'});
			data.push({name: 'usernumber', value: ''});
			data.push({name: 'email', value: ''});
			$.ajax({
				type : 'POST',
				url  : 'http://169.239.180.140/smartbill/php/airtime.php',
				data : data,
				beforeSend: function(){
					$("#result").fadeOut();
					$("#qbtn-etl").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
				},
				success : function(response){
					var data = jQuery.parseJSON(response);
					if(data.Code == "Success"){
						$('#etl-form').hide();
						$("#result").html('');
						$('#usernumber').hide();
						$('#email').hide();
						$('#usernumber').val('');
						$('#amount').hide();
						$('#amount').val('');
						$('#qamount').hide();
						$('#qamount').val('');
						$("#qbtn-etl").html('<img src="btn-ajax-loader.gif" /> &nbsp; Completing airtime purchase...');
						$("#qresult").fadeIn(1000, function(){
							$("#qresult").html(
								'<div id="quickairtime" class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <strong>Airtime Details:</stong><br/><br/>PIN: '+data.PIN+'<br/>Serial No.: '+data.Serial+'<br/>Expiry Date: '+data.Expiry+'</div>'
							);
							data.length = 0;
							$('#qbtn-etl').hide();
							$("#qdone").css("visibility","visible");
							$("#qprint").css("visibility","visible");
							
						});
					}
					else if(data.Code === "Error"){
						$('#etl-form').hide();
						$("#qresult").html('');
						$('#etl-form').hide();
						$("#result").html('');
						$('#usernumber').hide();
						$('#email').hide();
						$('#usernumber').val('');
						$('#amount').hide();
						$('#amount').val('');
						$('#qamount').hide();
						$('#qamount').val('');
						$("#qbtn-etl").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please wait...');
						
						$("#qresult").fadeIn(1000, function(){
							
							$("#qresult").html(
								'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+data.Result+' Please try again or contact Venus Dawn</div>'
							);
							data.length = 0;
							setTimeout('window.location.href = "home.html";',5000);
						});
					}
					else{
						alert(response+' Contact Venus Dawn Technologies Imediately!!!');
						setTimeout('window.location.href = "home.html";',5000);
					}
				},
				error : function(error){
					$("#qresult").fadeIn(1000, function(){
						$("#qresult").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
						);
						$("#qbtn-etl").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Confirm Airtime Purchase');
					});
				}
			});
		
		});
		$('#qdone').click(function(e){e.preventDefault(); setTimeout('window.location.href = "home.html";',500);});
		$('#qprint').click(function(e){e.preventDefault(); $('#quickairtime').printThis({debug: true,importCSS: false,printContainer: false,formValues:false});});
		
	}
);