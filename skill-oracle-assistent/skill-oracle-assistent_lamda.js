'use strict';

const Alexa = require('alexa-sdk');
const fs = require('fs');
const path = require('path');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
 'en': {
  translation: {
   LAUCH_VOICE: '<lang xml:lang="en-US">You are welcome to the Oracle assistant. How can I help you? Do you have an error message or a syntax question?</lang>',
   SKILLINFO_VOICE: '<lang xml:lang="en-US">Release nine of this skill. The Oracle Assistant demonstrates the possibilities of voice-driven guidebooks. More information and feedback on this skill can be found in the Alexa app.</lang>',
   SKILLINFO_CARDHEAD: 'Skill Info (Release 9)',
   SKILLINFO_CARDBODY: 'The Oracle Assistant demonstrates the possibilities of voice-driven guidebooks. Your feedback about this skill in the Alexa app would be very nice ;-)',
   STARTERROR_VOICE: '<lang xml:lang="en-US">Say, <prosody rate="x-slow"><say-as interpret-as="characters">ORA</say-as></prosody> 609, to get more about SQL-Code Ora 609. What error do you have?</lang>',
   STARTSYNTAX_VOICE: '<lang xml:lang="en-US">Say, syntax of "order by", to get syntactical rules of sort order. Which syntax are you looking for?</lang>',
   ORAERROR_NULL_VOICE: '<lang xml:lang="en-US">Ohh. I did not understand you. Say, <prosody rate="x-slow"><say-as interpret-as="characters">ORA</say-as></prosody> 609, to get more about SQL-Code Ora 609. What error do you have?</lang>',
   ORAERROR_UNKNOWN_VOICE: '<lang xml:lang="en-US">I do not know this code. Which error should I seek?</lang>',
   HELP_VOICE: '<lang xml:lang="en-US">Say error message or say syntax question. What do you want?</lang>',
   CANCEL_VOICE: '<lang xml:lang="en-US">Goodbye, see you next time.</lang>',
   STOP_VOICE: '<lang xml:lang="en-US">bye Bye. <break time="1s"/>Your feedback on the Oracle Assistant is possible via the Alexa app.</lang>',
   UNHANDLED_VOICE: '<lang xml:lang="en-US">Oops, I did not understand you. Can you repeat please or say help!</lang>',
   OVERANDOUT_VOICE: '<lang xml:lang="en-US">over and out.</lang>', 
   NEXTQUESTION_VOICE: '<lang xml:lang="en-US">Which error or syntax question do you have yet?</lang>'
  },
 },
 'de': {
 translation: {
   LAUCH_VOICE: '<lang xml:lang="de-DE">Hallo, ich bin der Orakel Assistent und helfe dir bei Fragen zur Datenbank. Was hast du? Eine Fehlermeldung oder eine Syntaxfrage?</lang>',
   SKILLINFO_VOICE: '<lang xml:lang="de-DE">Skill Version neun. Der Oracle Assistent demonstriert die Möglichkeiten von sprachgesteuerten Ratgebern. Mehr Informationen und Feedback zu diesem Skill findest du in der Alexa App.</lang>',
   SKILLINFO_CARDHEAD: 'Skill Info (Version 9)',
   SKILLINFO_CARDBODY: 'Der Oracle Assistent demonstriert die Möglichkeiten von sprachgesteuerten Ratgebern. Dein Feedback zum Skill in der Alexa App würde mich sehr freuen ;-)',
   STARTERROR_VOICE: '<lang xml:lang="de-DE">Sage Ora 609, um zum Beispiel den SQL-Kot Ora 609 zu suchen. Welchen Fehler hast du?</lang>',
   STARTSYNTAX_VOICE: '<lang xml:lang="de-DE">Sage Syntax Sortierung, um zum Beispiel die Ergebnisse von Abfragen zu sortieren. Welche Syntax suchst du?</lang>',
   ORAERROR_NULL_VOICE: '<lang xml:lang="de-DE">Ohh. Ich habe dich nicht richtig verstanden. Sage Ora 609, um zum Beispiel mehr über SQL-Kot Ora 609 abzufragen. Welchen Fehler hast du?</lang>',
   ORAERROR_UNKNOWN_VOICE: '<lang xml:lang="de-DE">Ich kenne diesen Fehlercode nicht! Welchen Fehler kann ich suchen?</lang>',
   HELP_VOICE: '<lang xml:lang="de-DE">Sage Fehlermeldung oder sage Syntaxfrage. Was möchtest du?</lang>',
   CANCEL_VOICE: '<lang xml:lang="de-DE">Auf Wiedersehen, bis zum nächsten Mal.</lang>',
   STOP_VOICE: '<lang xml:lang="de-DE">Tschau. <break time="1s"/>Dein Feedback zum Oracle Assistenten ist über die Alexa App möglich.</lang>',
   UNHANDLED_VOICE: '<lang xml:lang="de-DE">Ähh, ich habe dich leider nicht verstanden. Kannst du das bitte wiederholen oder sage Hilfe!</lang>',
   OVERANDOUT_VOICE: '<lang xml:lang="de-DE">Ende der Durchsage.</lang>', 
   NEXTQUESTION_VOICE: '<lang xml:lang="de-DE">Welche Fehlermeldung oder Syntaxfrage hast du noch?</lang>'
  },
 },
};

const handlers = {
  'LaunchRequest': function () {
    this.attributes['dialogMode'] = 'Y'; 
    this.emit(':ask', this.t('LAUCH_VOICE'));
  },
  'AllgemeineInformation_Intent': function () {
    this.emit(':tellWithCard', this.t('SKILLINFO_VOICE'), this.t('SKILLINFO_CARDHEAD'), this.t('SKILLINFO_CARDBODY'));
  },
  'EinstiegFehlermeldung_Intent': function () {
    this.emit(':ask', this.t('STARTERROR_VOICE'));
  },
  'EinstiegSyntaxfrage_Intent': function () {
    this.emit(':ask', this.t('STARTSYNTAX_VOICE'));
  },
  'OraErrorA_Intent': function () {
    if (!this.event.request.intent.slots.sqlcode.value) {
      const speechOutput = 
      this.emit(':ask', this.t('ORAERROR_NULL_VOICE'));
    } else if (this.event.request.intent.slots.sqlcode.value == '?') {
      this.emit(':ask', this.t('ORAERROR_NULL_VOICE'));
      this.emit(':ask', speechOutput);
    } else {     
      var sqlcode = this.event.request.intent.slots.sqlcode.value;
      var oraerror = getOraErrorByCode('ORA',sqlcode);
      if (!oraerror.ErrorType) {
        this.emit(':ask', 'Ora '+sqlcode+'. '+this.t('ORAERROR_UNKNOWN_VOICE'));
      } else {
        var speechOutput = 'ORA '+sqlcode;
        if (oraerror.English) {if (oraerror.English.Name) speechOutput += ' <lang xml:lang="en-US">'+oraerror.English.Name+'</lang>';}
        if (oraerror.German && (this.event.request.locale.indexOf("de")>=0)) {if (oraerror.German.Cause) speechOutput += ' <break time="1s"/>'+oraerror.German.Cause;}
        else if (oraerror.English) {if (oraerror.English.Cause) speechOutput += ' <break time="1s"/>'+oraerror.English.Cause;}
        if (oraerror.German && (this.event.request.locale.indexOf("de")>=0)) {if (oraerror.German.Action) speechOutput += ' <break time="1s"/>'+oraerror.German.Action;}
        else if (oraerror.English) {if (oraerror.English.Action) speechOutput += ' <break time="1s"/>'+oraerror.English.Action;}
        if (this.attributes['dialogMode'] && (this.attributes['dialogMode'] == 'Y')) {
          speechOutput += ' <break time="1s"/>'+this.t('NEXTQUESTION_VOICE');
          this.emit(':ask', speechOutput);
        } else {
          speechOutput += ' <break time="1s"/>'+this.t('OVERANDOUT_VOICE');
          this.emit(':tell', speechOutput);
        }
      }
    }
  },
  'OraErrorB_Intent': function () {
    if ((!this.event.request.intent.slots.sqlcode_a.value) 
      &&(!this.event.request.intent.slots.sqlcode_b.value)) {
      this.emit(':ask', this.t('ORAERROR_NULL_VOICE'));
      this.emit(':ask', speechOutput);
    } else if (this.event.request.intent.slots.sqlcode_a.value
       && this.event.request.intent.slots.sqlcode_b.value
       && this.event.request.intent.slots.sqlcode_a.value == '?'
       && this.event.request.intent.slots.sqlcode_b.value == '?') {
      this.emit(':ask', this.t('ORAERROR_NULL_VOICE'));
      this.emit(':ask', speechOutput);
    } else {
      var sqlcode_a = 0;
      var sqlcode_b = 0;
      if (!this.event.request.intent.slots.sqlcode_a.value) {
        sqlcode_a = 1;
      } else if (this.event.request.intent.slots.sqlcode_a.value == '?') {
        sqlcode_a = 0;
      } else {
        sqlcode_a = this.event.request.intent.slots.sqlcode_a.value;
      }
      if (!this.event.request.intent.slots.sqlcode_b.value) {
        sqlcode_b = 0;
      } else if (this.event.request.intent.slots.sqlcode_b.value == '?') {
        sqlcode_b = 0;
      } else {
        sqlcode_b = this.event.request.intent.slots.sqlcode_b.value;
      }
      var sqlcode = parseInt(sqlcode_a)*1000+parseInt(sqlcode_b);
      var oraerror = getOraErrorByCode('ORA',sqlcode);
      if (!oraerror.ErrorType) {
        this.emit(':ask', 'Ora '+sqlcode+'. '+this.t('ORAERROR_UNKNOWN_VOICE'));
      } else {
        var speechOutput = 'ORA '+sqlcode;
        if (oraerror.English) {if (oraerror.English.Name) speechOutput += ' <lang xml:lang="en-US">'+oraerror.English.Name+'</lang>';}
        if (oraerror.German && (this.event.request.locale.indexOf("de")>=0)) {if (oraerror.German.Cause) speechOutput += ' <break time="1s"/>'+oraerror.German.Cause;}
        else if (oraerror.English) {if (oraerror.English.Cause) speechOutput += ' <break time="1s"/>'+oraerror.English.Cause;}
        if (oraerror.German && (this.event.request.locale.indexOf("de")>=0)) {if (oraerror.German.Action) speechOutput += ' <break time="1s"/>'+oraerror.German.Action;}
        else if (oraerror.English) {if (oraerror.English.Action) speechOutput += ' <break time="1s"/>'+oraerror.English.Action;}
        if (this.attributes['dialogMode'] && (this.attributes['dialogMode'] == 'Y')) {
          speechOutput += ' <break time="1s"/>'+this.t('NEXTQUESTION_VOICE');
          this.emit(':ask', speechOutput);
        } else {
          speechOutput += ' <break time="1s"/>'+this.t('OVERANDOUT_VOICE');
          this.emit(':tell', speechOutput);
        }
      }
    }
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', this.t('HELP_VOICE'));
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('CANCEL_VOICE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_VOICE'));
  },
  'SessionEndedRequest': function () {
    console.log('session ended!');
  },
  'Unhandled': function() {
    this.emit(':ask', whit.t('UNHANDLED_VOICE'));
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// 3. Helper Function  =================================================================================================

function getOraErrorByCode(pErrorType,pErrorNumber) {
  console.log("getOraErrorByCode("+pErrorType+","+pErrorNumber+")");
  var lResponse = {
   'ErrorType':null,
   'ErrorNumber':null
  };
  // Index
  var lIndexFile = fs.readFileSync(path.resolve('data/index.txt'),'utf8')
    , lIndexLine = lIndexFile.replace('\r','').split('\n')
    , lIndexData = []
  ;
  lIndexFile = null;
	 for (var lIndex=0; lIndex<lIndexLine.length; lIndex++) {
	   if (lIndexLine[lIndex].indexOf('file:')>=0) {
	     lIndexData[lIndexData.length] = {'file':lIndexLine[lIndex].substr('file:'.length)};
	   } else if (lIndexLine[lIndex].indexOf('language:')>=0) {
	     lIndexData[lIndexData.length-1].language = lIndexLine[lIndex].substr('language:'.length);
	   } else if (lIndexLine[lIndex].indexOf('type:')>=0) {
	     lIndexData[lIndexData.length-1].type = lIndexLine[lIndex].substr('type:'.length);
	   } else if (lIndexLine[lIndex].indexOf('min:')>=0) {
	     lIndexData[lIndexData.length-1].min = lIndexLine[lIndex].substr('min:'.length);
	   } else if (lIndexLine[lIndex].indexOf('max:')>=0) {
	     lIndexData[lIndexData.length-1].max = lIndexLine[lIndex].substr('max:'.length);
	   }
  }
  lIndexLine = null;
  // Search
  var lFileEnglish = null
    , lFileGerman = null
    , lSearchVal = null
  ;
  lSearchVal = ''+pErrorNumber;
  while(lSearchVal.length<5) lSearchVal = '0'+lSearchVal;
  lSearchVal = pErrorType+'-'+lSearchVal;
  for (var lIndex=0; lIndex<lIndexData.length; lIndex++) {
    if ((lIndexData[lIndex].min <= lSearchVal)
     && (lIndexData[lIndex].max >= lSearchVal)) {
      switch(lIndexData[lIndex].language) {
        case 'english': lFileEnglish = lIndexData[lIndex].file; break;
        case 'german': lFileGerman = lIndexData[lIndex].file; break;
      }
    }
  }
  lIndexData = null;
  if (lFileEnglish) {
    lResponse.English = getOraErrorDetailByCode(lFileEnglish,pErrorType,pErrorNumber);
    if (!lResponse.ErrorType && lResponse.English.Type) lResponse.ErrorType = lResponse.English.Type;
    if (!lResponse.ErrorNumber && lResponse.English.Number) lResponse.ErrorNumber = lResponse.English.Number;
  }
  if (lFileGerman) {
    lResponse.German = getOraErrorDetailByCode(lFileGerman,pErrorType,pErrorNumber);
    if (!lResponse.ErrorType && lResponse.German.Type) lResponse.ErrorType = lResponse.German.Type;
    if (!lResponse.ErrorNumber && lResponse.German.Number) lResponse.ErrorNumber = lResponse.German.Number;
  }
  return lResponse;
}

function getOraErrorDetailByCode(pDataFile,pErrorType,pErrorNumber) {
  console.log("getOraErrorDetailByCode("+pDataFile+","+pErrorType+","+pErrorNumber+")");
  var lResponse = {
   'Type':null,
   'Number':null
  };
  // Content
  var lContentFile = fs.readFileSync(path.resolve('data/'+pDataFile),'Latin1')
    , lContentLine = lContentFile.replace('\r','').split('\n')
    , lSearchVal = null
    , lParseState = 'BEGIN'
    , lParseIndex = null
  ;
  lContentFile = null;
  lSearchVal = ''+pErrorNumber;
  while(lSearchVal.length<5) lSearchVal = '0'+lSearchVal;
  lSearchVal = pErrorType+'-'+lSearchVal;
  console.log(lSearchVal);
  for (var lContent=0; lContent<lContentLine.length; lContent++) {
 			switch(lParseState) {
 				case 'BEGIN':
 				  if (lContentLine[lContent].indexOf(lSearchVal+': ')>=0) {
 				    lParseIndex = lContentLine[lContent].indexOf(lSearchVal+':')+1+(lSearchVal+':').length; 
 				    lResponse.Type = pErrorType;
 				    lResponse.Number = pErrorNumber;
 				    lResponse.Name = lContentLine[lContent].substr(lParseIndex);
 				    lParseState = 'CAUSE';
 				  }
 				  break;
 				case 'CAUSE':
 				  if (lContentLine[lContent].indexOf('Cause: ')>=0) {
 				    lParseIndex = lContentLine[lContent].indexOf('Cause:')+1+('Cause:').length; 
 				    lResponse.Cause = lContentLine[lContent].substr(lParseIndex);
 				    lParseState = 'ACTION';
 				  }
 				  if (lContentLine[lContent].indexOf('Ursache: ')>=0) {
 				    lParseIndex = lContentLine[lContent].indexOf('Ursache:')+1+('Ursache:').length; 
 				    lResponse.Cause = lContentLine[lContent].substr(lParseIndex);
 				    lParseState = 'ACTION';
 				  }
 				  break;
 				case 'ACTION':
 				  if (lContentLine[lContent].indexOf('Action: ')>=0) {
 				    lParseIndex = lContentLine[lContent].indexOf('Action:')+1+('Action:').length; 
 				    lResponse.Action = lContentLine[lContent].substr(lParseIndex);
 				    lParseState = 'NEXT';
 				  }
 				  if (lContentLine[lContent].indexOf('Aktion: ')>=0) {
 				    lParseIndex = lContentLine[lContent].indexOf('Aktion:')+1+('Aktion:').length; 
 				    lResponse.Action = lContentLine[lContent].substr(lParseIndex);
 				    lParseState = 'NEXT';
 				  }
 				  break;
 				case 'NEXT':
 				  if (lContentLine[lContent].indexOf('ORA-')>=0) {
 				    lContent = lContentLine.length;
 				  }
 				  break;
 			}
  }
  return lResponse;
}
