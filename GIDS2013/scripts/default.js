// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

 var speakerDetailsData;
//var baseURL = "http://pugdevconservice.telerikindia.com/EventNetworkingService.svc";
var baseURL = "http://gids2013.telerikindia.com/EventNetworkingService.svc";
  var c;
var dataReadFromLocalStorage;    


var tweets;

tweets = new kendo.data.DataSource(
	{

	transport: {
			read: {
    			url: "http://search.twitter.com/search.json",
    			contentType: "application/json; charset=utf-8",
    			type: "GET",
    			dataType: "jsonp",
		    },
        parameterMap: function(options) {
                        return {
                            q: "#gids13",
                            page: options.page,
                            count: options.pageSize,
                            since_id: options.since_id //additional parameters sent to the remote service
                        };
                    }
		},
	schema: {
			data: "results",
			total: "results_per_page"
		}

});



function showTweets(e) {    
	//tweets.fetch();
	//var template1 = kendo.template($("#tweetTemplate").text());
	//$("#tweetList").kendoMobileListView({
	//	dataSource: tweets,
	//	template:template1
   
	//});
    /*data-source="tweets"
			data-endlessScroll="true" 
			data-template="tweetTemplate"
			data-role="listview"
			data-style="inset"
    */
    $("#tweetList").kendoMobileListView({
            dataSource: tweets,
            pullToRefresh: true,
            appendOnRefresh: true,
            template: $("#tweetTemplate").text(),
            pullParameters: function(item) {
                return {
                    since_id: item.id_str,
                    page: 1
                };
            }
        });
    
}


        var speakerData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                    cache: "inmemory",
                        read: {
                            // the remote service url

                            url: baseURL+"/SessionAttendees?$expand=UserProfile,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=AttendeeType,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/UserURLs/URL",
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                        }},
                    serverfiltering: true,
                    serverPaging: true,
                    pageSize: 10,
                    batch: false
                });


var allSessionData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                        cache: "inmemory",
                        read: {

                            url: baseURL+"/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=AttendeeType eq 11&$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/UserURLs/URL,Session&$orderby=Session/SessionTimeSlot/FromTime",
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                            
                        }
                    },
                    serverfiltering: false,
                    serverPaging: true,
                    batch: false,
                    pageSize: 20
                    

                });

var trackSessionData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                        cache: "inmemory",
                        read: {

                            url: baseURL+"/SessionInTracks?$expand=Session",
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                        }
                    },
                    serverfiltering: false,
                    serverPaging: true,
                    batch: false,
                    pageSize: 10
                    

                });

 var trackData = new kendo.data.DataSource(
                {
                type: "odata",
                transport: {
                        cache: "inmemory",
                        read: {
                        // the remote service url

                        url: baseURL+"/EventNetworkingService.svc/SessionTracks",
                        dataType: "jsonp",

                        data: {
                                Accept: "application/json"
                            }
                    }
                        
                    
            },
                                 serverfiltering: true,
                                 serverPaging: true,
                                 pageSize: 10,
                                 batch: false
 });

 var venueData = new kendo.data.DataSource(
                {
                type: "odata",
                transport: {
                        cache: "inmemory",
                        read: {
                        // the remote service url

                        url: baseURL+"/EventNetworkingService.svc/Venues",
                        dataType: "jsonp",

                        data: {
                                Accept: "application/json"
                            }
                    }
                        
                    
            },
                serverfiltering: true,
                                 serverPaging: true,
                                               pageSize: 10,
                                                         batch: false
                });

// PhoneGap is ready
function onDeviceReady() {
    //getLocation();
}


function showMe(e)
{
   
      
     if (localStorage.myagenda)
{
     dataReadFromLocalStorage = JSON.parse(localStorage["myagenda"]);
}
    var myAgendaData = new kendo.data.DataSource(
                {
                   
                  data : dataReadFromLocalStorage
                            
         });
    
    
   
    
     if(myAgendaData != null)
    {
       myAgendaData.fetch(); 
    }
   
    var template1 = kendo.template($("#filteredSessionsTemplate").text());
    $("#myAgendaSessionView").kendoMobileListView({
    dataSource: myAgendaData,
    template:template1,
    style:"inset"
   
    });
    
   
    
}

//=======================Speaker Detail function=======================//
 function speakerDetailsShow(e) {
              var view = e.view;
              var uid = e.view.params.uid;
              var template = kendo.template($("#speakerDetailsTemplate").text());
             speakerDetailsData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                    cache: "inmemory",
                        read: {
                            // the remote service url

                            url: baseURL+"/UserProfiles?$expand=City,Country,Company,Designation,UserURLs&$filter=Active eq true and UserId eq " +e.view.params.uid,
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                            }
                        },
                    serverfiltering: true,
                    serverPaging: true,
                    pageSize: 10,
                    batch: false,
                    error: function() { console.log(arguments); }
                });


                speakerDetailsData.fetch(function() {
                item = speakerDetailsData.at(0);
                view.scrollerContent.html(template(item));
                kendo.mobile.init(view.content);
               });

   }



function tracksListViewClick(e)
{
    
    
    var sessionsByTracksData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                    cache: "inmemory",
                        read: {
                            // the remote service url

                            url: baseURL+"/SessionInTracks?$expand=Session,Session/SessionTimeSlot&$filter=TrackID eq " + e.dataItem.SessionTrackID,
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                            }
                        },
                    serverfiltering: true,
                    serverPaging: true,
                    pageSize: 10,
                    endlessScroll: true,
                    batch: false,
                    error: function() { console.log(arguments); }
                });
    //sessionsByTracksData.fetch();
    var template1 = kendo.template($("#filteredSessionsTemplate").html());
    $("#sessioninTrackList").kendoMobileListView({
    dataSource: sessionsByTracksData,
    template:template1,
    style:"inset",
    endlessScroll:true
   
  });
    
}

function displaysessionsbyspeaker(e)
{
    
   
   var speakerId=e.dataItem.UserProfile.UserId;
    
    
    var sessionsOfSpeakers = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                    cache: "inmemory",
                        read: {
                            // the remote service url

                            url: baseURL+ "/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=UserProfile/UserId eq "+speakerId+" &$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/UserURLs/URL,Session",
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                            }
                        },
                    serverfiltering: true,
                    serverPaging: true,
                    pageSize: 10,
                    endlessScroll: true,
                    batch: false,
                    error: function() { console.log(arguments); }
                });
    //sessionsByTracksData.fetch();
    var template1 = kendo.template($("#filteredSessionsTemplate").html());
    $("#sessionsOfSpeakerList").kendoMobileListView({
    dataSource: sessionsOfSpeakers,
    template:template1,
    style:"inset",
    endlessScroll:true
   
  });
    
}


function venueListViewClick(e)
{
    
    var sessionsByVenueData = new kendo.data.DataSource(
                {
                    type: "odata",
                    transport: {
                    cache: "inmemory",
                        read: {
                            // the remote service url

                            url: baseURL+"/SessionVenues?$expand=Session,Session/SessionTimeSlot&$filter=VenueID eq " + e.dataItem.VenueID,
                            dataType: "jsonp",

                            data: {
                                Accept: "application/json"
                            }
                            }
                        },
                    serverfiltering: true,
                    serverPaging: true,
                    pageSize: 20,
                    batch: false,
                    error: function() { console.log(arguments); }
                });
    
 
    var template1 = kendo.template($("#filteredSessionsTemplate").text());
    $("#sessioninVenueList").kendoMobileListView({
    dataSource: sessionsByVenueData,
    template:template1,
     style:"inset",
     endlessScroll:true
   
  });
    
}





 var trackData = new kendo.data.DataSource(
                {
                type: "odata",
                transport: {
                        cache: "inmemory",
                        read: {
                        // the remote service url

                        url: baseURL+"/SessionTracks",
                        dataType: "jsonp",

                        data: {
                                Accept: "application/json"
                            }
                    }
                        
                    
            },
                                 serverfiltering: true,
                                 serverPaging: true,
                                 pageSize: 10,
                                 batch: false
 });

 var venueData = new kendo.data.DataSource(
                {
                type: "odata",
                transport: {
                        cache: "inmemory",
                        read: {
                        // the remote service url

                        url: baseURL+"/Venues",
                        dataType: "jsonp",

                        data: {
                                Accept: "application/json"
                            }
                    }
                        
                    
            },
                serverfiltering: true,
                                 serverPaging: true,
                                               pageSize: 10,
                                                         batch: false
                });

// PhoneGap is ready
function onDeviceReady() {
    //getLocation();
}


 function getAllSessions() {
            allSessionData.fetch();
             
 };





function getMyAgendaData(e)
{
    
    if(myAgendaData != null)
    {
       myAgendaData.read(); 
    }
    
 
}



//=======================Speaker Detail function=======================//

var currentSessionInView;

function sessionDetailsShow(e)
{
             
            var view = e.view;
            var item;
            currentSessionInView = e.view.params.sid;
    
             var urlToFetchSessionDetail = baseURL+"/SessionAttendees?$expand=UserProfile,Session,Session/SessionTimeSlot,UserProfile/UserURLs&$filter=AttendeeType eq 11 and SessionID eq "+e.view.params.sid+" &$select=Session/SessionID,UserProfile/UserId,UserProfile/FirstName,UserProfile/LastName,UserProfile/UserURLs/URL,UserProfile/UserURLs/SNTypeID,Session"
          
            var template = kendo.template($("#sessionDetailsTemplate").text());
           
           sessionDetailsData = new kendo.data.DataSource(
            {
            type: "odata",
            transport: {
            cache: "inmemory",
            read: {
             

         
              url:  urlToFetchSessionDetail,
            dataType: "jsonp",

            data: {
            Accept: "application/json"
            }
            }
            },
            serverfiltering: true,
            serverPaging: true,
            pageSize: 1,
            batch: false,
            error: function() { console.log(arguments); }
            });

            sessionDetailsData.fetch(function() {
            item = sessionDetailsData.at(0);
           
         
            view.scrollerContent.html(template(item));
            kendo.mobile.init(view.content);
            
                     if (localStorage.myagenda) 
                        { 
                             
                            
                            var myagenda = JSON.parse(localStorage["myagenda"]);
                            //var i = myagenda.length;                           
                            
                           
                        
                              if(contains(myagenda,item))
                                  {
                                    
                                   
                                      $("#saveButton").find(".km-icon").removeClass("km-add").addClass("km-trash");
                                      $('#saveButton').unbind('click', fsaveDataLocally);   
                                      $('#saveButton').bind('click', fremoveDataLocally);    
                                    
                                  }
                              else
                              {
                                
                                              
                                $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
                                $('#saveButton').unbind('click', fremoveDataLocally); 
                                $('#saveButton').bind('click', fsaveDataLocally); 
                                  
                               }
                      
                            
                    
                        }
                else
                {
                     $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
                     $('#saveButton').unbind('click', fremoveDataLocally); 
                    $('#saveButton').bind('click', fsaveDataLocally); 
                }
                
                
            });
   
   
    
}




function functionToShareOnFacebook(e) {
               
               var item;
              var sName;
            speakerDetailsData.fetch(function() {
                item = speakerDetailsData.at(0);
           
                var sFName = item.FirstName; 
                var sLName = item.LastName;
                 sName = "I am going to attend session of" + sFName + sLName + "in Delhi Technology Forum event" ;
              
               // view.scrollerContent.html(template(item));
               // kendo.mobile.init(view.content);
               });

            FB.ui(
                {
                    method: 'feed',
                    name: 'DebugmodeEventPlans',
                    link: 'http://localhost:1461/DevReach.html',
                   // source: 'http://www.youtube.com/watch?v=eFjjO_lhf9c',
                    //picture: 'http://debugmode.net/dj.jpg',
                    caption: sName,
                    description: sName,
                    message: ''
                });
               
 }

function functionToShareOnTwitter(e) {
    

     }


function functionToShareOnLinkedin(e) {
    
                
            }

var fsaveDataLocally= function saveDataLocally(e)
 {   
    
     
     sessionDetailsData.fetch(function() {
          
         item = sessionDetailsData.at(0);  
          
          if (!localStorage.myagenda) 
          localStorage.myagenda = JSON.stringify([]);
          
          var myagenda = JSON.parse(localStorage["myagenda"]);
          if(contains(myagenda,item))
          {
                            
          }
          else
          {
             
              myagenda.push(item);    
              localStorage["myagenda"] = JSON.stringify(myagenda);
              $("#saveButton").find(".km-icon").removeClass("km-add").addClass("km-trash");
              $('#saveButton').unbind('click', fsaveDataLocally);   
              $('#saveButton').bind('click', fremoveDataLocally);     
                           
          }       
          
          
      });     
     
    
 }

var fremoveDataLocally= function removeDataLocally(e)
{
    sessionDetailsData.fetch(function() {
         var myagenda = JSON.parse(localStorage["myagenda"]);
         var index= 0;
         var i=0;
        for(_obj in myagenda)
        {
            i++;
        }

         item = sessionDetailsData.at(0);   
        
        for( var iq =0;iq< i ; iq ++)
        {
            if(myagenda[iq].Session.SessionID===item.Session.SessionID)
            {
                break;
            }
            index ++;
        }      
        
       
            
                  
            myagenda.splice(index,1);
            localStorage["myagenda"] = JSON.stringify(myagenda); 

            $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
          
            $('#saveButton').unbind('click', fremoveDataLocally);  
           
            $('#saveButton').bind('click',fsaveDataLocally ); 
            
       
              
        
        });
    
    
}


function readDataFromLocalStorage(e)
{
     var datasaved =  JSON.parse(localStorage["myagenda"]);
    
}


function contains(a, obj) {
    var i = a.length;

    
    while (i--) {

       if (a[i].Session.SessionID === obj.Session.SessionID) {
 
           return true;
       }
    }
    return false;
}




$(document).ready(function () {
    
     $("#ratingSession-rating").text("Not Set")
    
});


function savePersonalDetailsfn()
{
    var settings = JSON.parse(localStorage.getItem("userSettings"));
    settings.name = $('#name').val();
    settings.email = $('#email').val();
    settings.anonymous = $('#isAnonymous').data("kendoMobileSwitch").check();
    localStorage.setItem("userSettings", JSON.stringify(settings));
}



function checkPersonalSettings()
{
    var settings = JSON.parse(localStorage.getItem("userSettings"));
    $('#name').val(settings.name);
    $('#email').val(settings.email);
    $('#isAnonymous').data("kendoMobileSwitch").check(settings.anonymous);
    $('#savePersonalDetails').text('Update');

}


function submitReview(e)
{
     
    var networkState = navigator.network.connection.type;
    if(networkState.toLowerCase() == "none")
    {
        alert("No network connection");
        return;
    }
    
   var settings = JSON.parse(localStorage.getItem("userSettings")); 
   var email = settings.email;
     var comments = $("#txtReview").val();
    
    
    // Convert the form into an object 
    var data = { SessionID: currentSessionInView,ReviewComment:comments,Rating: currentRating, UserEmail: email}; 
    
    // JSONify the data 
    var data = JSON.stringify(data);
    
    
    // Post it 
    $.ajax({ 
    	type: "POST", 
    	contentType: "application/json", 
    	url: baseURL + "/SessionRatings", 
    	data: data,
    	dataType: "json", 
    	success: function(){
                 var reviewItem = {'sessionRatingid':null,'sessionId':currentSessionInView, 'rating': currentRating,'review': comments}
    
                if (!localStorage.getItem("review_session_"+currentSessionInView)) 
                {
                    localStorage.setItem("review_session_"+currentSessionInView, JSON.stringify(reviewItem))
                }
                
                $("#btnRate").css("display","none")
                $("#btnSubmitReview").css("display","none")
                $("#submitReviewMessage").text("Your rating has been recorded.")
        },
    	error:function(XMLHttpRequest, textStatus, errorThrown) {
    			console.log("error : " + errorThrown)
    			alert("error");
    		}
    
    }); 
    
    
    /*var sessionRating = kendo.data.Model.define({
            id: "SessionRatingID"
        })

        dataSource = new kendo.data.DataSource({
            type:"odata",
            transport: {
                read: {
                    //url:baseURL + "/SessionRatings",
                    //url: "http://localhost:33515/Services/GIDSEventService.svc/SessionRatings",
                    url:"http://gids2013.telerikindia.com/NetworkingDataContextService.svc/SessionRatings",
                    dataType: "json",
                },
                create: {
                    //url:baseURL + "/SessionRatings",
                    //url: "http://localhost:33515/Services/GIDSEventService.svc/SessionRatings",
                    url:"http://gids2013.telerikindia.com/NetworkingDataContextService.svc/SessionRatings",
                    type: "POST",
                    dataType: "json",
                }
            },
            schema: {
                 data: function(data) {
                    return data.value;
                },
                total: function(data) {
                    return data['odata.count'];

                },
                model: sessionRating
            }
        });
        
   console.log(data);
    dataSource.add(data);
    
    dataSource.sync();
   */
   
}

  

// ================================================================================================//
// =======================================Geolocation Operations===================================//
// ================================================================================================//

// ================================================================================================//

var map, sourcePoint, destionationPoint, directionsDisplay, locId,
    directionsService = new google.maps.DirectionsService(); 

function showMap() {
	locId = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { enableHighAccuracy: true });
}

function hideMap() {
    navigator.geolocation.clearWatch(locId);
}

function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    
    var mapOptions = {
        sensor: true,
        center: new google.maps.LatLng(13.014421, 77.564448),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
    };

    map = new google.maps.Map($("#map_canvas")[0], mapOptions);

    destinationPoint = new google.maps.Marker({
        position: new google.maps.LatLng(13.014421, 77.564448),
        color: "green",
        map: map, 
        title: "Tata Institute, IISC, Bangalore"
    });
    
    sourcePoint = new google.maps.Marker({
        color: "red", 
        map: map,
        title:"You"
    });

    //directionsDisplay.setMap(map);
}

function onGeolocationSuccess(position) {
    
    sourcePoint.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var request = {
        origin: sourcePoint.position, 
        destination: destinationPoint.position,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
	//$("#myLocation").html("<span class='err'>" + error.message + "</span>");
}


function OnHomeViewLoad()
{
    if (!window.localStorage){
        return;
    }
   
    if (!localStorage.getItem("userSettings"))
    {
        $("#modalview-usersettings").data("kendoMobileModalView").open();
    }    
}


function SaveUserSettings()
{
    var name = $("#txtUserName").val();
    var email = $("#txtEmail").val();
    if(name === "")
    {
        $("#usersettings-form-status").text("Name is required.");    
        return;
    }
    if(email === "")
    {
        $("#usersettings-form-status").text("Email is required.");    
        return;
    }
    var userSettings = {'name':name,'email':email,'anonymous':$('#chkIsAnonymous').data("kendoMobileSwitch").check()};
    localStorage.setItem("userSettings", JSON.stringify(userSettings));
    $("#modalview-usersettings").data("kendoMobileModalView").close();
}


function OnSessionReviewFormLoad(e)
{
    var userReview = null;
    userReview = localStorage.getItem("review_session_"+currentSessionInView)
    var reviewTextBox = $("#txtReview")
    var ratingValue = $("#rating-value");
    
    if (userReview != null) 
    {
        userReview = JSON.parse(userReview);
        reviewTextBox.text(userReview.review);
        ratingValue.text(ratingText[userReview.rating-1]);
        $("#btnRate").css("display","none")
        $("#btnSubmitReview").css("display","none")
        $("#submitReviewMessage").text("Note: You have already reviewed this session")
    }   
    else
    {
        currentRating=-1;
        reviewTextBox.text('');
        ratingValue.text("Not Set");
        $("#btnRate").css("display","block")
        $("#btnSubmitReview").css("display","block")
        $("#submitReviewMessage").text("")
    }
}

var ratingText = ["Bad","Poor","Regular","Good","Excellent"];

var currentRating = -1;

function OnExcellentClick()
{
    SetRating(5)
}

function OnGoodClick()
{
    SetRating(4)
}

function OnRegularClick()
{
    SetRating(3)
}

function OnPoorClick()
{
    SetRating(2)
}

function OnBadClick()
{
    SetRating(1)
}

function SetRating(v, d)
{
    currentRating=v;
    $("#rating-value").text(ratingText[v-1]);
}