
var pageFirstInit = true;
$(document).live('pageinit',function(event){//Force the app to go home after force refresh the page on browser
	if(pageFirstInit){
		$.mobile.changePage($('#page0'));
		pageFirstInit = false;
	}	
})



WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
	
		$(document).bind("pagechange", onPageChange);
		//$(document).bind("pagebeforeload", onPageLoad);
		
		function onPageLoad(event, data) {
			var toPageId = data.toPage.attr("id");
			console.log("Current Page ID: " + toPageId);
		}
		
		function onPageChange(event, data) {
			var toPageId = data.toPage.attr("id");
			console.log("Current Page ID: " + toPageId);
		}
		var dayDescription = {
			'10/23/2012':'4D Summit Pre-Class',
			'10/24/2012':'4D Summit keynotes  breakout sessions',
			'10/25/2012':'4D Summit keynotes  breakout sessions',
			'10/26/2012':'JS.everyWhere(2012)',
			'10/27/2012':'Wakandaay 2012'	
		}


//		var localStorageAvailable = true;
//		if (typeof(localStorage) =='undefined') {
//    		alert('Local storage not supported by this browser.');
//    		localStorageAvailable = false;
//  		}
//  		
//  		if (localStorage.getItem($.mobile.activePage[0].id) != null & $.mobile.activePage[0].id != 'page0' )
//        {
//            var listViewItem = localStorage.getItem($.mobile.activePage[0].id);
//            $('.listViewContainer:visible').empty();
//            $('.listViewContainer:visible').append(listViewItem);
//            //listViewItem.listview();
//            $('.listViewContainer:visible').listview('refresh');
//        }
		//preload all sponsor pics:
		var allSponsorsImageArray = ['styles/images/Sponsors/sponsor-logo-hm.png','styles/images/Sponsors/sponsor-logo-paypal.png',  'styles/images/Sponsors/sponsor-logo-objsys.png', 'styles/images/Sponsors/ebay.png', 'styles/images/Sponsors/logo-mongolab.png', 'styles/images/Sponsors/redhat.png', 'styles/images/Sponsors/openshift.png'];// Array of images:
		var summitSponsorsImageArray = ['styles/images/Sponsors/sponsor-logo-hm.png','styles/images/Sponsors/sponsor-logo-paypal.png',  'styles/images/Sponsors/sponsor-logo-objsys.png'];
		$.each(allSponsorsImageArray, function (i, val) {
  			$('<img/>').attr('class','allSponsorImage').attr('src', val).attr('width',150).attr('height',60).appendTo('#allSponsors');
		});
		$.each(allSponsorsImageArray, function (i, val) {
  			$('<img/>').attr('src', val).attr('width',150).attr('height',60).appendTo('#summitSponsors');
		});
		//$.mobile.changePage($("#page0"), "none");
		
		var allEventsCollection = {
			eventCollections:{},
			available:false
		};
		//Retrive data from local storage;
//		if (localStorage.getItem('allEventsCollection') != null) allEventsCollection = localStorage.getItem('allEventsCollection');
		var sesssionCollection = {
			sessionEntityCollection:{},
			available:false
		};
		var sessionIDSet = {};
		ds.Event.all({
		    autoExpand: "sessions",
		    onSuccess: function(eventsCollectionEvent) {
		    	allEventsCollection.eventCollections = eventsCollectionEvent.entityCollection;
		        allEventsCollection.available= true;
		        //if (localStorageAvailable) localStorage.setItem("allEventsCollection", allEventsCollection);
		            
		    }
		});
		$(".loadDays").live('vclick', function() { //tap event handler of Event listitem
		    //daysPageGeneration(eventsCollectionEvent.entityCollection, this.id);
		    $.blockUI({
		    	 message: null,
		    	  overlayCSS: {
		    	  	 opacity: 0
		    	  }
		    });
		    if (allEventsCollection.available && allEventsCollection.eventCollections.length > 0) {
		        allEventsCollection.eventCollections.query("name = :1 | name %% :1", this.id, {
		            autoExpand: "sessions",
		            onSuccess: function(event) {
		                event.entityCollection.forEach({
		                    onSuccess: function(eventItemEvent) {
		                        var startDate = eventItemEvent.entity.startDate.getValue();
		                        var endDate = eventItemEvent.entity.endDate.getValue();
		                        $('#eventPageHead h3').text(this.id);
		                        $('#daysListView').empty();
		                        $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots"  data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>'+dayDescription[formatDate(startDate)] +'</p>' + '</li>');
		                        while (startDate < endDate) {
		                            startDate.setDate(startDate.getDate() + 1);
		                            $('#daysListView').append('<li data-theme="c"><a id="' + formatDate(startDate) + '" class="loadTimsSlots"  data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>'+dayDescription[formatDate(startDate)] +'</p></li>');
		                        }
		                        //if (localStorageAvailable) localStorage.setItem("page1", $('#daysListView').html());
		                        var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
		                        sessionsCollectionRel.orderBy("startTime", {
		                            onSuccess: function(event) { // handle anything special here
		                                sesssionCollection.sessionEntityCollection = event.entityCollection;
		                                sesssionCollection.available = true;
		                            }
		                        });
		                        if ($('#daysListView').hasClass('ui-listview')) $('#daysListView').listview('refresh');
		                    }
		                });
		                $.mobile.changePage("#page1", {
		                    transition: "slide"
		                });
		                $.unblockUI();
		            }
		        });
		    }
		});
		
		    $(".loadTimsSlots").live('tap', function() {
		        var currentDate = this.id;
//		        if (currentDate == "JS.everywhere") currentDate = '10/26/2012';
//		        else if (currentDate == "Wakanday") currentDate = '10/27/2012'
		        if ( sesssionCollection.available && sesssionCollection.sessionEntityCollection.length > 0) {
		            //Check if listView is initialized, if not listview('refresh') causes error.
		            $('#timSlotListView').empty();
		            var sessionTimes = [];
		            var tagsSet = {};
		            $('#dayPageHead h3').text(currentDate);
		            sesssionCollection.sessionEntityCollection.forEach({
		                onSuccess: function(sessionRelevent) {
		                    var sessionItem = sessionRelevent.entity;
		                    var sessionDate = formatDate(sessionItem.sessionDate.getValue());
		                    var sessionTime = sessionItem.startTime.getValue() + "- " + sessionItem.endTime.getValue();
		                    var sessionFirstTag = "";
		                    if (sessionItem.tags.getValue()) {
		                        sessionFirstTag = sessionItem.tags.getValue().match(/,/) ? sessionItem.tags.getValue().split(',')[0] : sessionItem.tags.getValue();
		                        if (sessionTimes.indexOf(sessionTime) != -1) {
		                            if (typeof sessionIDSet[sessionTime] === "undefined") sessionIDSet[sessionTime] = [];
		                            sessionIDSet[sessionTime].push(sessionItem.ID.getValue());
		                            var seperator;
		                            tagsSet[sessionTime].length > 0 ? seperator = ',' : seperator = "";
		                            (typeof tagsSet[sessionTime] === "undefined") ? tagsSet[sessionTime] = "" : tagsSet[sessionTime] = tagsSet[sessionTime].concat(seperator + ' ' + sessionFirstTag);
		                        }
		                    }
		                    if (sessionDate == currentDate & sessionTimes.indexOf(sessionTime) == -1) {
		                        sessionTimes.push(sessionTime);
		                        if (sessionItem.isActivity.getValue()) {
		                            $('#timSlotListView').append('<li role="heading" data-role="list-divider" ><h3>' + sessionTime + '  ' + sessionItem.name.getValue() + '</h3></li>');
		                        }
		                        else {
		                            $('#timSlotListView').append('<li data-theme="c" ><a class="loadSessions" id="' + sessionItem.ID.getValue() + '" class=""  data-transition="slide" >' + '<h3>' + sessionTime + '</h3><p class="' + sessionTime + '">' + sessionFirstTag + '</p></li>');
		                            if (typeof tagsSet[sessionTime] === "undefined") tagsSet[sessionTime] = "";
		                            var seperator;
		                            tagsSet[sessionTime].length > 0 ? seperator = ',' : seperator = "";
		                            tagsSet[sessionTime] = tagsSet[sessionTime].concat(seperator + ' ' + sessionFirstTag);
		                            tagsSet[sessionItem.ID.getValue()] = sessionTime;
		                            sessionIDSet[sessionItem.ID.getValue()] = sessionTime;
		                            if (typeof sessionIDSet[sessionTime] === "undefined") sessionIDSet[sessionTime] = [];
		                            sessionIDSet[sessionTime].push(sessionItem.ID.getValue());
		                        }
		                    }
		                },
		                atTheEnd: function(end) {
		                    //Replace the tag paragraph in displayed li item with concated all sessions tags
		                    for (var key in tagsSet) {
		                        if (key.match(/\d{1,2}[:-]\d{2}([:-]\d{2,3})*/)) {
		                            var idToAddTags = getKeyForValue(tagsSet, key);
		                            $('#' + idToAddTags + " p").text(tagsSet[key]);
		                        }
		                    }
		                    //if (localStorageAvailable) localStorage.setItem("page3", $('#timSlotListView').html());
		                    if ($('#timSlotListView').hasClass('ui-listview')) $('#timSlotListView').listview('refresh');
		                    $.mobile.changePage("#page3", {transition: "slide"});

		                }
		            });

		        }
		    });
		$(".loadSessions").live('tap', function() {
			if ( sesssionCollection.available && sesssionCollection.sessionEntityCollection.length > 0 && sessionIDSet.hasOwnProperty(this.id)) {
		                $('#sessionsPageHead h3').text(sessionIDSet[this.id]);
		                sesssionCollection.sessionEntityCollection.query("ID in :1", sessionIDSet[sessionIDSet[this.id]], {
		                    onSuccess: function(sessionsInTimeEvent) {
		                        $('#sessionsListView').empty();
		                        var sessionsInTimeCollection = sessionsInTimeEvent.entityCollection;
		                        sessionsInTimeCollection.forEach({
		                            onSuccess: function(sessionsEvent) {
		                                $('#sessionsListView').append(constructSessionListItem(sessionsEvent.entity));
		                            }
		                        });
		                        if ($('#sessionsListView').hasClass('ui-listview')) $('#sessionsListView').listview('refresh');
		                        //if (localStorageAvailable) localStorage.setItem("page5", $('#sessionsListView').html());
		                        $.mobile.changePage("#page5", {transition: "slide"});
		                    },
		                    onError: function(error) {
		                    	console.log(error['error'][0].message);
		                    }
		                });
		     }
		});
		
		$(".loadSessionDetail").live('tap', function() { //on() is not working in this context
		    ds.Session.find("ID = :1", this.id, {
		        onSuccess: function(sessionDetailEvent) {
		            var session = sessionDetailEvent.entity;
		            var sessionName = session.name.getValue();
		            var speakerName = session.presenterName.getValue();
		            var sessionDetail = formatDate(session.sessionDate.getValue()) + ", " + session.startTime.getValue() + "- " + session.endTime.getValue() + ", " + session.room.getValue();
		            //$('#sessionDetailPageHead h3').text(sessionName);
		            $('#sessionDetail h3').text(sessionName);
		            $('#sessionDetail p').text(sessionDetail);
		            $('.sessionDetailParagraph').append('<a id="' + session.ID.getValue() + '" data-role="button" data-inline="true" data-iconpos="notext" data-icon="star" class="likeCurrentSession" ></a>').trigger('create');
		            $('#sessionDetail #sessionDescription ').text(session.description.getValue());
		            $('#speakersListView').empty();
		            $('#speakersListView').append('<li data-theme="c">' + '<a id="'+ speakerName +'"  href="#page7" data-transition="slide">Speaker: ' + speakerName + '</a></li>');
		            //Assume there is one speaker per session;
		            if($('#speakersListView').hasClass('ui-listview')) $('#speakersListView').listview('refresh');
		            $.mobile.changePage("#page6", {transition: "slide"});
		            ds.Speaker.find("name = :1", speakerName, {
		            	autoExpand: "sessions",
		            	onSuccess: function(speakerEvent) {
		            		var speaker = speakerEvent.entity;
		            		 $('#speakerName').text(speaker.name.getValue());
		            		 $('#speakerTitle').text(speaker.title.getValue()+', '+speaker.company.getValue());
		            		 (speaker.speakerBio.getValue())?$('#speakerBio').text(speaker.speakerBio.getValue()):$('#speakerBio').text("No speaker biography yet");
		            		 (speaker.speakerPicURL.getValue())?('#speakerPic').attr("src",speaker.speakerPicURL.getValue()):$('#speakerPic').attr("src","styles/images/profilePicPlaceHolder.gif");
							 $('#speakerSessionsList').empty();
							 $('#speakerSessionsList').append('<li role="heading" data-role="list-divider">Sessions</li>');
							 sessionsCollectionRel = speaker.sessions.relEntityCollection;
							 sessionsCollectionRel.forEach({ // browse PTO reqeusts
	                         	onSuccess: function(sessionEvent) {
	                         		var sessionOfCurrentSpeaker = sessionEvent.entity; 
	                            	$('#speakerSessionsList').append('<li data-theme="c">' + '<a id="' + sessionOfCurrentSpeaker.ID.getValue() + '" class="loadSessionDetail" href="#page6" data-transition="slide">' + '<h3>' + sessionOfCurrentSpeaker.name.getValue() + '</h3></li>');
	                            }
	                         })
							 if($('#speakerSessionsList').hasClass('ui-listview')) $('#speakerSessionsList').listview('refresh');
		            	}
		            	
		            });

		        }
		    });
		});
		
		$(".likeCurrentSession").live('tap', function() {
			($(this).attr('data-theme') != "e")?$(this).buttonMarkup({theme: 'e'}):$(this).buttonMarkup({theme: 'b'}).trigger('refresh');
		});
		function daysPageGeneration(eventCollections, eventName) { //Load days of event if more than one
		   
		}



		function getKeyForValue(jsonObjet, value) {
		    for (var key in jsonObjet) {
		        if (jsonObjet.hasOwnProperty(key) && typeof(key) !== 'function') {
		            if (jsonObjet[key] == value) return key;
		        }
		    }
		}
		function constructSessionListItem (entity) {
			if(entity.presenterName) var sessionSpeakerName = entity.presenterName.getValue();
			return '<li data-theme="c"><a  id="'+entity.ID.getValue() +'" class="loadSessionDetail" data-transition="slide"><h1>'+ entity.name.getValue() + '</h1><p style="font-family:Arial;font-size: 18;">Presenter: ' + sessionSpeakerName + '<br/>Room: ' + entity.room.getValue() + '<br/>Tags: ' + entity.tags.getValue() + '<br/>Description: '+ entity.description.getValue() +'</p></a></li>';

		}
		
		$(".allSponsorImage").live('click', function() {
			$.mobile.changePage("#page8", {
		            transition: "slide",
		            reverse: false
		        });
		});
		
//		$('.goBack').live('tap', function() {
//		    if ($('#daysListView li').size() > 1) {
//		        $.mobile.changePage("#page1", {
//		            transition: "slide",
//		            reverse: true
//		        });
//		    }
//		    else {
//		        $.mobile.changePage("#page0", {
//		            transition: "slide",
//		            reverse: true
//		        });
//		    }

//		})

		 function formatDate(date) { // ultility to formate date to mm/dd/yyyy
		    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
		};

		function getTheDay(date) {

		    weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		    return weekday[date.getDay()];
		}

		$('#allSponsors').cycle();
		$('#summitSponsors').cycle();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
