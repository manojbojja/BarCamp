// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

 var speakerDetailsData;
var baseURL = "http://pugdevconservice.telerikindia.com/EventNetworkingService.svc";
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
			data: {
					q: "#Nasscom"
				}
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
              console.log(uid);
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
             
            console.log("hello");
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
    
                console.log("share on Twitter");
     }


function functionToShareOnLinkedin(e) {
    
                console.log("share on Linkedin");
            }

var fsaveDataLocally= function saveDataLocally(e)
 {   
    
     console.log("this is session"); 
     sessionDetailsData.fetch(function() {
          
         item = sessionDetailsData.at(0);  
          
          if (!localStorage.myagenda) 
          localStorage.myagenda = JSON.stringify([]);
          
          var myagenda = JSON.parse(localStorage["myagenda"]);
          if(contains(myagenda,item))
          {
              console.log("I am IF");
              
          }
          else
          {
             console.log("enter");
              myagenda.push(item);    
              localStorage["myagenda"] = JSON.stringify(myagenda);
              $("#saveButton").find(".km-icon").removeClass("km-add").addClass("km-trash");
              $('#saveButton').unbind('click', fsaveDataLocally);   
              $('#saveButton').bind('click', fremoveDataLocally);     
              console.log("exit");
             
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
             console.log("1");
            $("#saveButton").find(".km-icon").removeClass("km-trash").addClass("km-add");
          console.log("2");
            $('#saveButton').unbind('click', fremoveDataLocally);  
           console.log("3");
            $('#saveButton').bind('click',fsaveDataLocally ); 
            console.log("final");
       
              
        
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
    
    $("#usersettings-form").kendoValidator();
    
    $('#ratingSession').ratings(5).bind('ratingchanged', function (event, data) {
        $('#ratingSession-rating').text(data.rating);
    });

});


function savePersonalDetailsfn()
{
    var settings = JSON.parse(localStorage.getItem("userSettings"));
    settings.name = $('#name').val();
    settings.email = $('#email').val();
    settings.anonymous = $('#isAnonymous').data("kendoMobileSwitch").check();
    localStorage.setItem("userSettings", JSON.stringify(settings));
    
    /*var personalDetails = new Array();
    var obj = {'name': $('#name').val()};
    personalDetails.push(obj);
    var obj1 = {'email':$('#email').val() };
    personalDetails.push(obj1);
    var obj2 = {'isAnonymous': $('#isAnonymous').data("kendoMobileSwitch").check()}
    personalDetails.push(obj2);
    
    localStorage['myDetails'] = JSON.stringify(personalDetails);
    */
}



function checkPersonalSettings()
{
    var settings = JSON.parse(localStorage.getItem("userSettings"));
    $('#name').val(settings.name);
    $('#email').val(settings.email);
    $('#isAnonymous').data("kendoMobileSwitch").check(settings.anonymous);
    $('#savePersonalDetails').text('Update');
    
    /*if (localStorage['myDetails'])
    {
        
        var personalDetails = JSON.parse(localStorage['myDetails']);
         
        $('#name').val(personalDetails[0].name);
        $('#email').val(personalDetails[1].email);
        $('#isAnonymous').data("kendoMobileSwitch").check(personalDetails[2].isAnonymous);
        $('#savePersonalDetails').text('Update');
    }*/
}


function submitReview(e)
{
   currentSessionInView;
    
    
    var sessionRating = kendo.data.Model.define({
            id: "SessionRatingID"
        })

        dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://localhost:15684/api/SessionRatings",
                    dataType: "json"
                },
                create: {
                    url: "http://localhost:15684/api/SessionRatings",
                    type: "POST",
                    dataType: "json"
                }
            },
            schema: {
                model: sessionRating
            }
        });
        
    dataSource.add({ SessionID: currentSessionInView, Rating: $("#ratingSession-rating").text(), UserEmail: 'test@test.com'});
    dataSource.sync();
    
    var item = {'review': $("#txtReview").val(),'rating':$("#ratingSession-rating").text(),};
    
    if (!localStorage.myReview) 
    {
        localStorage.myReview = JSON.stringify([]);
    }
    
    
          
          var myreview = JSON.parse(localStorage["myReview"]);          
           myreview.push(item);    
           localStorage["myReview"] = JSON.stringify(myreview);            
             
              
    
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
        center: new google.maps.LatLng(28.547222200000000000,77.250833300000070000),
        zoom: 10,
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
        position: new google.maps.LatLng(28.547222200000000000,77.250833300000070000),
        color: "green",
        map: map, 
        title: "that Conference"
    });
    
    sourcePoint = new google.maps.Marker({
        color: "red", 
        map: map,
        title:"You"
    });

    directionsDisplay.setMap(map);
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
