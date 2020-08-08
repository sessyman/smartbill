$('document').ready(
function(){

	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady(){
		document.addEventListener("backbutton", onBackButton, false);
		function onBackButton(){
			window.location.href = "home.html";
		}
	}
	
	
	$("#logout").click(function(){window.location.href = "index.html";});
	var agentphone = localStorage.getItem('Phone');
	if(agentphone == " "){window.location.href = "index.html";}
	$('#agent').append(' '+agentphone);
	var cash = numeral(1000).format('M0,0.00');
	
	//setTimeout(' window.location.href = "index.html"; ',60000);
	
	$('#update').click(
		function(e){
			e.preventDefault();
			var data = $("#interval").serializeArray();
			fromdate = $('#from').val()+' 00:00:00';
			todate = $('#to').val()+' 23:59:59';
			data.push({name: 'start', value: fromdate});
			data.push({name: 'end', value: todate});
			data.push({name: 'purpose', value: 'range'});
			data.push({name: 'phone', value: agentphone});
			
			$.ajax({
				type : 'POST',
				url  : 'http://169.239.180.140/smartbill/php/reports.php',
				data : data,
				beforeSend: function(){
					$("#update").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Proccessing, wait...');
				},
				success : function(response){
					var data = jQuery.parseJSON(response);
					if(data.Code === "Success"){
						$('#salesheading').html('Sales & Income for certain period:');
						$('#failed').html('');
						$('#airtimeheading').hide();
						$('#profitsheading').hide();
						$('#vclsales').html("<strong>VCL Sales:</strong> "+data.SalesVCL);
						$('#etlsales').html("<strong>ETL Sales:</strong> "+data.SalesETL);
						$('#totalsales').html("<strong>Total Sales:</strong> "+data.TotalSales);
						$('#agentincomevcl').html("<strong>Agent Income(VCL):</strong> "+data.AgentIncomeVCL);
						$('#agentincomeetl').html("<strong>Agent Income(ETL)</strong> "+data.AgentIncomeETL);
						$('#totalagentincome').html("<strong>Total Agent Income:</strong> "+data.TotalAgentIncome);
						$("#update").html('<span>Update Statistics</span>');
						/*$('#vdincomevcl').html("<strong>Venus Dawn Income(VCL)</strong> "+data.VDIncomeVCL);
						$('#vdincomeetl').html("<strong>Venus Dawn Income(ETL)</strong> "+data.VDIncomeETL);
						$('#totalvdincome').html("<strong>Total Venus Dawn Income</strong> "+data.VDTotalIncome);*/
					}
					else if(data.Code === "Fail"){
						$('#salesheading').html('Extended Sales & Income:');
						$('#failed').html(data.Result);
						$('#airtimeheading').hide();
						$('#profitsheading').hide();
						$('#vclsales').html('');
						$('#etlsales').html('');
						$('#totalsales').html('');
						$('#agentincomevcl').html('');
						$('#agentincomeetl').html('');
						$('#totalagentincome').html('');
						$('#vdincomevcl').html('');
						$('#vdincomeetl').html('');
						$('#totalvdincome').html('');
						$("#update").html('<span>Update Statistics</span>');
					}
					else{
						alert(response+' Contact Venus Dawn Technologies Imediately!!!');
						$("#update").html('Update Statistics');
						//setTimeout('window.location.href = "home.html";',3000);
					}
				},
				error : function(error){
					$("#result").fadeIn(1000, function(){
						$("#failed").html(
							'<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
						);
						$("#btn-etl").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Confirm Airtime Purchase');
					});
				}
			});
		}
	);
	
	
	$.post(
		"http://169.239.180.140/smartbill/php/reports.php",
		{phone:agentphone,purpose:'info'}, 
		function(response, status){
			var data = jQuery.parseJSON(response);
		
			if(data.Code == "Failed"){
				$('#salesheading').html('Daily Sales & Income:');
				$('#failed').html(data.Result);
				$('#airtimeheading').hide();
				$('#profitsheading').hide();
				$('#vclsales').hide();
				$('#etlsales').hide();
				$('#totalsales').hide();
				$('#agentincomevcl').hide();
				$('#agentincomeetl').hide();
				$('#totalagentincome').hide();
				$('#vdincomevcl').hide();
				$('#vdincomeetl').hide();
				$('#totalvdincome').hide();
			}
			else if(data.Code == "Success"){
				$('#salesheading').html('Daily Sales & Income:');
				$('#airtimeheading').html('Airtime Sales');
				$('#profitsheading').html('Profits');
				$('#vclsales').html("<strong>VCL Sales:</strong> "+data.SalesVCL);
				$('#etlsales').html("<strong>ETL Sales:</strong> "+data.SalesETL);
				$('#totalsales').html("<strong>Total Sales:</strong> "+data.TotalSales);
				$('#agentincomevcl').html("<strong>VCL Profit:</strong> "+data.AgentIncomeVCL);
				$('#agentincomeetl').html("<strong>ETL Profit:</strong> "+data.AgentIncomeETL);
				$('#totalagentincome').html("<strong>Total Profit:</strong> "+data.TotalAgentIncome);
			}
			else{
				console.log(data);
			}
			
		}
	);
});
