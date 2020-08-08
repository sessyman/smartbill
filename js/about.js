$('document').ready(
	function(){
		version = $('#version').val();
		$.post(
			"http://169.239.180.140/smartbill/php/update.php",
			{update:'update', version: version}, 
			function(response, status){
				data = jQuery.parseJSON(response);
				if(data.Code == "ok"){
					$('#updatenote').html('<strong>Update available. To download it, click </strong>');
					$("#update").attr("href", "http://169.239.180.140/smartbilldemo/updates/Smartbill_v00"+data.Version+".apk");
					$("#update").html('here');
				}
				else{
					$('#update').hide();
					$('#updatenote').html('<strong>No update available</strong>');
				}
			}
		);
	}
);