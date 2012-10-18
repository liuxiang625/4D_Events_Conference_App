
guidedModel =// @startlock
{
	SessionSurvey :
	{
		methods :
		{// @endlock
			submitSurveryAnswers:function(sessionSurveyArrayForSubmission)
			{// @lock
				console.log(sessionSurveyArrayForSubmission);
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

