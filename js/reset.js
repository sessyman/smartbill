$('document').ready(function(){
	$('#cp-formspace').hide();
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackButton, false);

		function onBackButton(){
			window.location.href = "home.html";
		}
		alert("Device ready");
		
		$('#btn-vc').click(function(e){
			e.preventDefault();
			$('#vc-formspace').hide();
			$('#cp-formspace').show();
		});
	}
});