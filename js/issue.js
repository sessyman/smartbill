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
		messages:{password:{required: "please 	enter your password"}, user_email: "please enter your email address",},
		submitHandler: submitForm	
	});  
	/* validation */

	/* issue submit */
	function submitForm()
	{		
		var data = $("#issue-form").serialize();
		
		$.ajax({
			type : 'POST',
			url  : 'issuecash.php',
			data : data,
			beforeSend: function()
			{	
				$("#result").fadeOut();
				$("#btn-issue").php('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Submitting request ...');
			},
			success : function(response)
			{						
				if(response=="ok"){
					$("#btn-issue").php('<img src="btn-ajax-loader.gif" /> &nbsp; Complete. Please wait.');					
					setTimeout(' window.location.href = "confirmissue.php"; ',4000);
				}
				else{
					$("#result").fadeIn(1000, function(){						
						$("#result").php(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+' </div>'
						);
					});
				}
			}
		});
		return false;
	}
	/* issue submit */
	
	/*keying in the secret code */
	$("#secretcode").keyup(function(){
		var vstr = $("#secretcode").val()
		var vlen = vstr.length;
		var vchar = vlen.charAt(vlen-1);
	});
	/*keying in the secret code */
});