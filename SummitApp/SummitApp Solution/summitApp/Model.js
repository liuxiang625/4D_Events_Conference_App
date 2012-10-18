
guidedModel =// @startlock
{
	SessionSurvey :
	{
		methods :
		{// @endlock
			submitSurveryAnswers:function(sessionSurveyArrayForSubmission)
			{// @lock
				//console.log(sessionSurveyArrayForSubmission);
				//var sessionID= sessionSurveyArrayForSubmission['sessionID'];
				//var userCookieID = sessionSurveyArrayForSubmission['userCookieID'];
				for (var obj in sessionSurveyArrayForSubmission) {
//					if (obj == 'sessionID') { 
//						sessionID = sessionSurveyArrayForSubmission[obj];
//						break;
//					}
//					else if (obj == 'userCookieID') {
//						userCookieID = sessionSurveyArrayForSubmission[obj];
//						break;
//					}
//					else {
//						
//					}

					if (obj != 'sessionID' & obj != 'userCookieID') { 
						//console.log(obj + '   ' +sessionSurveyArrayForSubmission[obj]);
						var questionID = obj;
						//var answer = sessionSurveyArrayForSubmission[obj];
						var newAnswer = ds.Answer.createEntity();
						newAnswer.question = ds.Question.find('ID = :1',questionID);
						newAnswer.sessionSurvey = newAnswer.question.sessionSurvey;
						newAnswer.session = ds.Session.find('ID = :1',sessionSurveyArrayForSubmission['sessionID']);
						newAnswer.userCookieID = sessionSurveyArrayForSubmission['userCookieID'];
						newAnswer.question.isRating?newAnswer.rate = sessionSurveyArrayForSubmission[obj]:newAnswer.answer = sessionSurveyArrayForSubmission[obj];
						newAnswer.save();
					}
				}
				console.log(newAnswer.userCookieID);
			}// @startlock
		}
	},
	Speaker :
	{
		methods :
		{// @endlock
			searchSpeakerByString:function(queryString)
			{// @lock
				var speakersFound = ds.Speaker.query("name = :1", queryString);
				return speakersFound;
			}// @startlock
		}
	},
	Event :
	{
		methods :
		{// @endlock
			searchSessionsAndSpeakesByString:function(queryString)
			{// @lock
				 var searchResult = {
					'sessionsFound':ds.Session.searchSessionByString('*' + queryString + '*'),
					'speakersFound':ds.Speaker.searchSpeakerByString('*' + queryString + '*')
				};
				return searchResult;
			}// @startlock
		}
	},
	Session :
	{
		methods :
		{// @endlock
			searchSessionByString:function(queryString)
			{// @lock
				var sessionsFound = ds.Session.query("name = :1", queryString);
				return sessionsFound;
			}// @startlock
		}
	}
};// @endlock

