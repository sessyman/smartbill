
var url = "http://102.130.122.187/smartbill/php";
$('document').ready(
        function () {
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                document.addEventListener("backbutton", onBackButton, false);
                function onBackButton() {
                    window.location.href = "home.html";
                }
                $(document).on("click", "#print-token", function (e) {
                    e.preventDefault();
                    //call print here

                    console.log("Print button defined in lec.js; line 111 [R 120], listener from line 11 to line 16");
                });
            }

            /*** WARNING!!!! Remove this block in production ******************/
            $(document).on("click", "#print-token", function (e) {
                e.preventDefault();
                //call print here
                
                console.log("Print button defined in lec.js; line 111, listener from line 11 to line 16");
            });
            /******************** ONLY FOR TESTING ****************************/

            /* validation */
            $("#lec-form").validate({
                rules: {password: {required: true, }, user_email: {required: true, email: true}, },
                messages: {password: {required: "please enter your password"}, user_email: "please enter your email address", }
            });
            /* validation */

            $("#logout").click(function () {
                window.location.href = "index.html";
            });
            var agentphone = localStorage.getItem('Phone');
            if (agentphone == " ") {
                window.location.href = "index.html";
            }
            $('#agent').append(' ' + agentphone);
            //setTimeout(' window.location.href = "home.html"; ',8000);
            var data = "";
            var result = "";

            /* lec submit */
            $('#btn-lec').click(function (e) {
                e.preventDefault();
                var data = $("#lec-form").serializeArray();
                data.push({name: 'phone', value: agentphone});
                data.push({name: 'vendor', value: 'lec'});
                data.push({name: 'purpose', value: 'vend'});
                data.push({name: 'confirmed', value: 'false'});

                $.ajax({
                    type: 'POST',
                    url: url + '/gettoken.php',
                    data: data,
                    beforeSend: function () {
                        $("#result").fadeOut();
                        $("#btn-lec").html('<span class="glyphicon glyphicon-lec"></span> &nbsp; Processing, wait...');
                    },
                    timeout: 0,
                    success: function (response) {
                        var result = JSON.parse(response);
                        console.log(result);
                        if (result.Code == "ok" || result.Code == "OK") {
                            if (result.Confirmation == "ConfirmationRequired") {
                                data.length = 0;
                                $("#btn-lec").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
                                $("#result").fadeIn(100, function () {
                                    $("#meternumber").hide();
                                    $("#usernumber").hide();
                                    $("#amount").hide();
                                    $("#btn-lec").hide();
                                    $("#result").html(
                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <strong>Confirm meter details.</strong><br/> <strong>Meter#:</strong> ' + result.Meternumber + '<br/><strong>Owner:</strong> ' + result.Owner + '<br/><strong>Location:</strong> ' + result.Location + '<br/><strong>User Phone:</strong> ' + result.Userphone + '<br/><strong>Min Vend Amount:</strong> M' + numeral(result.MinVend).format('0,0.00') + '<br/><strong>Max Vend Amount:</strong> M' + numeral(result.MaxVend).format('0,0.00') + ''
                                            );
                                    $("#btn-confirm").css("visibility", "visible");
                                    $("#btn-cancel").css("visibility", "visible");
                                    $("#tlec-form").hide();
                                    $("#rlec-form").hide();
                                    $("#buttons").html('<button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-confirm" id="btn-confirm"><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Confirm Details</strong></button><hr><button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-cancel" id="btn-cancel" ><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Cancel</strong></button>');
                                });

                                /*$('#btn-cancel').click(function(e){e.preventDefault(); setTimeout(' window.location.href = "lec.html"; ',10);});*/

                                $('#btn-confirm').click(function (e) {
                                    e.preventDefault();
                                    console.log("Meter number confirmed");
                                    data.push({name: 'confirmed', value: 'true'});
                                    data.push({name: 'phone', value: result.Agentphone});
                                    data.push({name: 'vendor', value: result.Vendor});
                                    data.push({name: 'meternumber', value: result.Meternumber});
                                    data.push({name: 'usernumber', value: result.Userphone});
                                    data.push({name: 'amount', value: result.Amount});
                                    data.push({name: 'referenceid', value: result.ReferenceId});
                                    data.push({name: 'owner', value: result.Owner});
                                    data.push({name: 'datetime', value: result.Datetime});

                                    $.ajax({
                                        type: 'POST',
                                        url: url + '/gettoken.php',
                                        data: data,
                                        beforeSend: function () {
                                            $("#result").fadeOut();
                                            $("#result").html('');
                                            $('#btn-cancel').hide();
                                            $("#btn-confirm").html('<span class="glyphicon glyphicon-lec"></span> &nbsp; Processing, wait...');
                                        },
                                        success: function (response) {
                                            var result = JSON.parse(response);
                                            if (result.Code == "OK") {
                                                $("#btn-confirm").html('<img src="btn-ajax-loader.gif" /> &nbsp; Purchasing electricity, wait...');
                                                $("#result").fadeIn(100, function () {
                                                    $("#result").html(
                                                            '<div class="alert alert-danger"><center><h5>*** TAX INVOICE ***</h5></center><pre>' + result.Token + '</pre></div>'
                                                            );
                                                    $("#btn-confirm").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Done').after("<button style=\"visibility: visible;\" type=\"button\" class=\"btn btn-default\" name=\"btn-confirm\" id=\"print-token\"><span class=\"glyphicon glyphicon-print\"></span> &nbsp; Print</button>");
                                                });
                                                $('#btn-confirm').click(function (e) {
                                                    e.preventDefault();
                                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                                });
                                            } else if (result.Code == "Done") {
                                                $("#result").html('');
                                                data.length = 0;
                                                $("#result").fadeIn(100, function () {
                                                    $("#result").html(
                                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; ' + result.Response + ' </div>'
                                                            );
                                                    setTimeout(' window.location.href = "lec.html"; ', 500);
                                                });
                                            } else if (result.Code == "Failed") {
                                                data.length = 0;
                                                $("#result").fadeIn(100, function () {
                                                    $("#meternumber").hide();
                                                    $("#usernumber").hide();
                                                    $("#amount").hide();
                                                    $("#btn-lec").hide();
                                                    $("#result").html(
                                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <br/>' + result.Response + '<strong><br/><br/>LEC Helpline: +2665210 0000.</strong></div>'
                                                            );
                                                    $("#btn-confirm").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Cancel');
                                                    $('#btn-confirm').click(function (e) {
                                                        e.preventDefault();
                                                        setTimeout(' window.location.href = "lec.html"; ', 10);
                                                    });
                                                });
                                            }
                                        },
                                        timeout: 0,
                                        error: function (error) {

                                            $("#result").fadeIn(100, function () {
                                                $("#result").html(
                                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! ' + error + '.</div>'
                                                        );
                                                $("#btn-lec").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Try Again');
                                            });
                                        }
                                    });

                                });
                            }
                        } else if (result.Code == "Failed") {
                            data.length = 0;
                            $("#result").fadeIn(100, function () {
                                $("#btn-cancel").css("visibility", "visible");
                                $("#meternumber").hide();
                                $("#usernumber").hide();
                                $("#amount").hide();
                                $("#btn-lec").hide();
                                $("#tlec-form").hide();
                                $("#rlec-form").hide();
                                $("#result").html(
                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span>&nbsp;<strong>ERROR OCCURRED</strong><br/> ' + result.Response + '.<br/><strong>LEC Helpline: +2665210 0000.</strong></div>'
                                        );
                                $('#btn-cancel').click(function (e) {
                                    e.preventDefault();
                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                });
                            });
                        }

                    },
                    error: function (error) {
                        console.log(error);
                        $("#result").fadeIn(100, function () {
                            $("#result").html(
                                    '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! ' + error + '.</div>'
                                    );
                            $("#btn-lec").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Try Again');
                        });
                    }
                });

            });

            /*Lec vend request submit */
            $('#tbtn-lec').click(function (e) {
                e.preventDefault();
                var data = $("#tlec-form").serializeArray();
                data.push({name: 'phone', value: agentphone});
                data.push({name: 'vendor', value: 'lec'});
                data.push({name: 'purpose', value: 'tokenlist'});
                data.push({name: 'confirmed', value: 'false'});
                data.push({name: 'amount', value: '0'});
                data.push({name: 'usernumber', value: '0'});
                $.ajax({
                    type: 'POST',
                    url: url + '/gettoken.php',
                    data: data,
                    beforeSend: function () {
                        $("#tresult").fadeOut();
                        $("#tbtn-lec").html('<span class="glyphicon glyphicon-lec"></span> &nbsp; Processing, wait...');
                    },
                    success: function (response) {
                        var result = JSON.parse(response);
                        if (result.Code == "ok" || result.Code == "OK") {
                            if (result.Confirmation == "ConfirmationRequired") {
                                data.length = 0;
                                $("#tbtn-lec").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
                                $("#tresult").fadeIn(100, function () {
                                    $("#tmeternumber").hide();
                                    $("#tbtn-lec").hide();
                                    $("#tresult").html(
                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Confirm meter details.<br/> <strong>Meter#:</strong> ' + result.Meternumber + '<br/><strong>Owner:</strong> ' + result.Owner + '<br/><strong>Location:</strong> ' + result.Location + '<br/><strong>User Phone:</strong> ' + result.Userphone + '<br/><strong>Min Vend Amount:</strong> ' + numeral(result.MinVend).format('0,0.00') + ''
                                            );
                                    $("#tbtn-confirm").css("visibility", "visible");
                                    $("#tbtn-cancel").css("visibility", "visible");
                                    $("#lec-form").hide();
                                    $("#rlec-form").hide();
                                    $("#buttons").html('<button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-confirm" id="btn-confirm"><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Confirm Details</strong></button><hr><button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-cancel" id="btn-cancel" ><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Cancel</strong></button>');
                                });

                                $('#tbtn-cancel').click(function (e) {
                                    e.preventDefault();
                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                });

                                $('#tbtn-confirm').click(function (e) {
                                    e.preventDefault();
                                    data.push({name: 'confirmed', value: 'true'});
                                    data.push({name: 'phone', value: result.Agentphone});
                                    data.push({name: 'purpose', value: 'tokenlist'});
                                    data.push({name: 'vendor', value: result.Vendor});
                                    data.push({name: 'tmeternumber', value: result.Meternumber});
                                    data.push({name: 'usernumber', value: result.Userphone});
                                    data.push({name: 'amount', value: result.Amount});
                                    data.push({name: 'referenceid', value: result.ReferenceId});
                                    data.push({name: 'owner', value: result.Owner});

                                    $.ajax({
                                        type: 'POST',
                                        url: url + '/gettoken.php',
                                        data: data,
                                        beforeSend: function () {
                                            $("#tresult").fadeOut();
                                            $("#tresult").html('');
                                            $('#tbtn-cancel').hide();
                                            $("#tbtn-confirm").html('<span class="glyphicon glyphicon-lec"></span> &nbsp; Processing, wait...');
                                        },
                                        success: function (response) {
                                            var result = JSON.parse(response);
                                            if (result.Code == "OK") {
                                                $("#tbtn-confirm").html('<img src="btn-ajax-loader.gif" /> &nbsp; Purchasing electricity, wait...');
                                                $("#tresult").fadeIn(100, function () {
                                                    $("#tresult").html(
                                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <strong>Token list:</strong> <br/>' + result.Receipt1 + '&nbsp; M' + result.Tender1 + '<br/>' + result.Receipt2 + '&nbsp; M ' + result.Tender2 + '<br/>' + result.Receipt3 + '&nbsp; M' + result.Tender3 + '</div>'
                                                            );
                                                    $("#tbtn-confirm").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Done');
                                                });
                                                $('#tbtn-confirm').click(function (e) {
                                                    e.preventDefault();
                                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                                });
                                            } else if (result.Code == "Done") {
                                                $("#tresult").html('');
                                                data.length = 0;
                                                $("#tresult").fadeIn(100, function () {
                                                    $("#tresult").html(
                                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; ' + result.Response + ' </div>'
                                                            );
                                                    setTimeout(' window.location.href = "lec.html"; ', 500);
                                                });
                                            } else if (result.Code == "Failed") {
                                                data.length = 0;
                                                $("#tresult").fadeIn(100, function () {
                                                    $("#tmeternumber").hide();
                                                    $("#tusernumber").hide();
                                                    $("#tamount").hide();
                                                    $("#tbtn-lec").hide();
                                                    $("#tresult").html(
                                                            '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <br/>' + result.Response + '.<strong><br/><br/>LEC Helpline: +2665210 0000.</strong></div>'
                                                            );
                                                    $("#tbtn-confirm").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Cancel');
                                                    $('#tbtn-confirm').click(function (e) {
                                                        e.preventDefault();
                                                        setTimeout(' window.location.href = "lec.html"; ', 10);
                                                    });
                                                });
                                            }
                                        },
                                        error: function (error) {
                                            $("#tresult").fadeIn(100, function () {
                                                $("#tresult").html(
                                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
                                                        );
                                                $("#tbtn-lec").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Try Again');
                                            });
                                        }
                                    });
                                    e.preventDefault();
                                });
                            }
                        } else if (result.Code == "Failed") {
                            data.length = 0;
                            $("#result").fadeIn(100, function () {
                                $("#btn-cancel").css("visibility", "visible");
                                $("#meternumber").hide();
                                $("#usernumber").hide();
                                $("#amount").hide();
                                $("#btn-lec").hide();
                                $("#tlec-form").hide();
                                $("#rlec-form").hide();
                                $("#result").html(
                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span><br/> &nbsp; <br/>' + result.Response + '.<strong><br/><br/>LEC Phone: +2665210 0000.</strong></div>'
                                        );
                                $('#btn-cancel').click(function (e) {
                                    e.preventDefault();
                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                });
                            });
                        }

                    },
                    error: function (error) {
                        $("#result").fadeIn(100, function () {
                            $("#result").html(
                                    '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
                                    );
                            $("#btn-lec").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Try Again');
                        });
                    }
                });
                //e.preventDefault();
            });

            $('#rbtn-lec').click(function (e) {
                e.preventDefault();
                var data = $("#rlec-form").serializeArray();
                data.push({name: 'phone', value: agentphone});
                data.push({name: 'vendor', value: 'lec'});
                data.push({name: 'purpose', value: 'tokenreprint'});
                data.push({name: 'confirmed', value: 'false'});
                data.push({name: 'amount', value: '0'});

                $.ajax({
                    type: 'POST',
                    url: url + '/gettoken.php',
                    data: data,
                    beforeSend: function () {
                        $("#rresult").fadeOut();
                        $("#rbtn-lec").html('<span class="glyphicon glyphicon-lec"></span> &nbsp; Processing, wait...');
                    },
                    success: function (response) {
                        var result = JSON.parse(response);
                        if (result.Code == "ok" || result.Code == "OK") {
                            data.length = 0;
                            $("#rbtn-lec").html('<img src="btn-ajax-loader.gif" /> &nbsp; Please, wait...');
                            $("#rresult").fadeIn(100, function () {
                                $("#lec-form").hide();
                                $("#tlec-form").hide();
                                $("#rmeternumber").hide();
                                $("#rusernumber").hide();
                                $("#receiptnumber").hide();
                                $("#rresult").html(
                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; <br/><strong>Receipt (Reprint):</strong><br/>Rf#: ' + result.Receipt + '<br/>Vendor: ' + result.AgentName + '<br/>Vendor Phone: ' + result.AgentPhone + '<br/><strong>Owner details</strong><br/>Name: ' + result.Owner + '<br/>Meter: ' + result.Meternumber + '<br/><strong>Transaction details</strong><br/>Amount: M' + numeral(result.Amount).format('0,0.00') + '<br/>Debt: M' + numeral(result.Debt).format('0,0.00') + '<br/>Units: ' + result.Units + ' KW/h<br/>FBE Units: ' + result.FBEUnits + ' KW/h<br/>Token: ' + result.Token + '<br/>VAT Number: 50007525<br/>LEC Phone: +26652100000 </div>'
                                        );
                                $("#buttons").html('<button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-confirm" id="btn-confirm"><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Confirm Details</strong></button><hr><button style="visibility:hidden;" type="submit" class="btn btn-default" name="btn-cancel" id="btn-cancel" ><span class="glyphicon glyphicon-arrow-right"></span> &nbsp; <strong>Cancel</strong></button>');
                            });
                            $("#rbtn-lec").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Done');
                            $('#rbtn-lec').click(function (e) {
                                e.preventDefault();
                                setTimeout(' window.location.href = "lec.html"; ', 10);
                            });
                        } else if (result.Code == "Failed") {
                            data.length = 0;
                            $("#rresult").fadeIn(100, function () {
                                $("#rbtn-lec").html('<span class="glyphicon glyphicon-arrow-right"></span> &nbsp; Cancel');
                                $("#rmeternumber").hide();
                                $("#rusernumber").hide();
                                $("#receiptnumber").hide();
                                $("#amount").hide();
                                $("#btn-lec").hide();
                                $("#tlec-form").hide();
                                $("#lec-form").hide();
                                $("#rresult").html(
                                        '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span><br/> ' + result.Response + '.<strong><br/><br/>LEC Phone: +2665210 0000.</strong></div>'
                                        );
                                $('#rbtn-lec').click(function (e) {
                                    e.preventDefault();
                                    setTimeout(' window.location.href = "lec.html"; ', 10);
                                });
                            });
                        }
                    },
                    error: function (error) {
                        $("#rresult").fadeIn(100, function () {
                            $("#rresult").html(
                                    '<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; Network error! Call Venus Dawn for support.</div>'
                                    );
                            $("#rbtn-lec").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
                        });
                    }
                });
                //e.preventDefault();
            });
        });