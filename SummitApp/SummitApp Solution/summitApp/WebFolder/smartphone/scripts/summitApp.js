
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$.mobile.changePage($("#page0"), "none");
		ds.Event.all({
		    autoExpand: "sessions",
		    onSuccess: function(eventsCollectionEvent) {
		        $(".loadDays").live('click', function() { //Click event handler of Event listitem
		            daysPageGeneration(eventsCollectionEvent.entityCollection, this.id);
		        });
		    }
		});
		$(".loadSessionDetail").live('click', function() { //on() is not working in this context
		    console.log(this.id);
		    ds.Session.find("ID = :1", this.id, {
		    	autoExpand: "presenter",
		    	onSuccess: function(sessionDetailEvent) {
		    		var session = sessionDetailEvent.entity;
		    		var sessionName = session.name.getValue();
		    		var sessionDetail = formatDate(session.sessionDate.getValue()) + ", " + session.startTime.getValue() + "- " + session.endTime.getValue() + ", " + session.room.getValue(); 
		    		$('#sessionDetailPageHead h3').text(sessionName);
		    		$('#sessionDetail h3').text(sessionName);
		    		$('#sessionDetail p').text(sessionDetail);
		    		$('#sessionDetail #sessionDescription ').text(session.description.getValue());
		    	}
		    });
		});
		
		
		function daysPageGeneration(eventCollections, eventName) { //Load days of event if more than one
		    eventCollections.query("name = :1 | name %% :1", eventName, {
		        autoExpand: "sessions",
		        onSuccess: function(event) {
		            event.entityCollection.forEach({
		                onSuccess: function(eventItemEvent) {
		                    var startDate = eventItemEvent.entity.startDate.getValue();
		                    var endDate = eventItemEvent.entity.endDate.getValue();
		                    $('#eventPageHead h3').text(eventName);
		                    $('#daysListView').empty().listview('refresh');
		                    $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit Pre-Class</p>' + '</li>').listview('refresh');
		                    while (startDate < endDate) {
		                        startDate.setDate(startDate.getDate() + 1);
		                        $('#daysListView').append('<li data-theme="c"><a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#page3" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>4D Summit keynotes  breakout sessions</p></li>').listview('refresh');
		                    }
		                    var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
		                    sessionsCollectionRel.orderBy("startTime", {
		                   		onSuccess: function(event) { // handle anything special here
		                        	var sortedSessionsCollection = event.entityCollection;
		                    		timeSlotPageGeneration(sortedSessionsCollection);
		                        }
		                    });
		                    
		                }
		            });
		            //entittyCollection.length >1?$.mobile.changePage("#page1"):$.mobile.changePage("#page3");
		        }
		    })
		}

		function timeSlotPageGeneration(sortedSessionsCollection){
			$(".loadTimsSlots").live('click', function() {
		                        var currentDate = this.id;
		                        if (sortedSessionsCollection.length > 0) {
		                            //Check if listView is initialized, if not listview('refresh') causes error.
		                            ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').empty().listview('refresh') : $('#timSlotListView').empty());
		                            var sessionTimes = [];
		                            var tagsSet = {};
		                            var sessionIDSet = {};
		                            $('#dayPageHead h3').text(currentDate);
		                                    sortedSessionsCollection.forEach({
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
		                                                    tagsSet[sessionTime].length >0?seperator = ',':seperator = "";
		                                                    (typeof tagsSet[sessionTime] === "undefined") ? tagsSet[sessionTime] = "" : tagsSet[sessionTime] = tagsSet[sessionTime].concat(seperator + ' ' + sessionFirstTag);
		                                                }
		                                            }
		                                            if (sessionDate == currentDate & sessionTimes.indexOf(sessionTime) == -1) {
		                                                sessionTimes.push(sessionTime);
		                                                if (sessionItem.isActivity.getValue()) {
		                                                    ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li role="heading" data-role="list-divider" ><h3>' + sessionTime + '  ' + sessionItem.name.getValue() + '</h3></li>').listview('refresh') : $('#timSlotListView').append('<li role="heading" data-role="list-divider" ><h3>' + sessionTime + '  ' + sessionItem.name.getValue() + ' ' + sessionItem.room.getValue() + '</h3></li>'));
		                                                }
		                                                else {
		                                                    ($('#timSlotListView').hasClass('ui-listview') ? $('#timSlotListView').append('<li data-theme="c" ><a class="loadSessions" id="' + sessionItem.ID.getValue() + '" class="" href="#page5" data-transition="slide" >' + '<h3>' + sessionTime + '</h3><p class="' + sessionTime + '">' + sessionFirstTag + '</p></li>').listview('refresh') : $('#timSlotListView').append('<li data-theme="c" >' + '<a class="loadSessions" id="' + sessionItem.ID.getValue() + '" class="" href="#page5" data-transition="slide">' + '<h3>' + sessionTime + '</h3><p  class="' + sessionTime + '">' + sessionFirstTag + '</p></li>'));
		                                                    if (typeof tagsSet[sessionTime] === "undefined") tagsSet[sessionTime] = "";
		                                                    var seperator;
		                                                    tagsSet[sessionTime].length >0?seperator = ',':seperator = "";
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
		                                                    console.log(idToAddTags + ': ' + tagsSet[key]);
		                                                    $('#' + idToAddTags + " p").text(tagsSet[key]);
		                                                }
		                                            }
		                                            //console.log(tagsSet);
		                                            $(".loadSessions").live('click', function() {
		                                            	$('#sessionsPageHead h3').text('Session in ' + sessionIDSet[this.id]);
		                                                //alert(this.id+'-----'+sessionIDSet[this.id]+"---" + sessionIDSet[sessionIDSet[this.id]]);
		                                                sortedSessionsCollection.query("ID in :1",sessionIDSet[sessionIDSet[this.id]],{
		                                                	onSuccess: function(sessionsInTimeEvent){
		                                                		$('#sessionsListView').empty().listview('refresh');
		                                                		var sessionsInTimeCollection = sessionsInTimeEvent.entityCollection;
		                                                		 sessionsInTimeCollection.forEach({
		                                        					onSuccess: function(sessionsEvent) {
		                                        						$('#sessionsListView').append(constructSessionListItem(sessionsEvent.entity)).listview('refresh');
		                                        					}
		                                        				})
		                                                	}	
		                                                });
		                                            });
		                                        }
		                                    }) 
		                                }
		                           	});
		}
		function getKeyForValue(jsonObjet, value) {
		    for (var key in jsonObjet) {
		        if (jsonObjet.hasOwnProperty(key) && typeof(key) !== 'function') {
		            if (jsonObjet[key] == value) return key;
		        }
		    }
		}
		function constructSessionListItem (entity) {
			if(entity.presenter.relEntity) var sessionSpeakerName = entity.presenter.name.getValue();
			return '<li data-theme="c"><a href="#page6" id="'+entity.ID.getValue() +'" class="loadSessionDetail" data-transition="slide"><h1>'+ entity.name.getValue() + '</h1><p style="font-family:Arial;font-size: 18;">Presenter: ' + sessionSpeakerName + '<br/>Room: ' + entity.room.getValue() + '<br/>Tags: ' + entity.tags.getValue() + '<br/>Description: '+ entity.description.getValue() +'</p></a></li>';

		}
		$('.goBack').click(function() {
		    if ($('#daysListView li').size() > 1) {
		        $.mobile.changePage("#page1", {
		            transition: "slide",
		            reverse: true
		        });
		    }
		    else {
		        $.mobile.changePage("#page0", {
		            transition: "slide",
		            reverse: true
		        });
		    }

		})

		 function formatDate(date) { // ultility to formate date to mm/dd/yyyy
		    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
		};

		function getTheDay(date) {

		    weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		    return weekday[date.getDay()];
		}

		$('#right').cycle();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
