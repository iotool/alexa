'use strict';

const Alexa = require('alexa-sdk');
const fs = require('fs');
const path = require('path');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
 'en': {
  translation: {
   WELCOME_SPEECH: '<lang xml:lang="en-US">Welcome.</lang>',
   WELCOME_CARD_HEAD: 'instructions - first use',
   WELCOME_CARD_BODY: 'Alexa, ask "Oracle Assistent" about ORA [904] or ORA [12] thousand [154].',
   SQLCODE_HELP_SPEECH: '<lang xml:lang="en-US">Say, Alexa ask Oracle Assistent about Ora 904, or Ora 12 thousand 154.</lang>',
   SQLCODE_ERROR_SPEECH: '<lang xml:lang="en-US">Ohh. I did not understand you!</lang>',
   SQLCODE_NOTFOUND_SPEECH: '<lang xml:lang="en-US">Ohh. I did not know this SQL-code!</lang>',
   HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
   HELP_REPROMPT: 'What can I help you with?',
   STOP_MESSAGE: 'Goodbye!',
  },
 },
 'de': {
 translation: {
   WELCOME_SPEECH: '<lang xml:lang="de-DE">Willkommen.</lang>',
   WELCOME_CARD_HEAD: 'Anleitung - erste Nutzung',
   WELCOME_CARD_BODY: 'Alexa, frage "Oracle Assistent" nach ORA [904] oder ORA [12] tausend [154].',
   SQLCODE_HELP_SPEECH: '<lang xml:lang="de-DE">Sage, Alexa frage Oracle Assistent nach Ora neun null vier, oder Ora 12 tausend 154.</lang>',
   SQLCODE_ERROR_SPEECH: '<lang xml:lang="de-DE">Ohh. Ich habe dich nicht verstanden!</lang>',
   SQLCODE_NOTFOUND_SPEECH: '<lang xml:lang="de-DE">Ohh. Ich kenne diesen SQL-Code nicht!</lang>',
   HELP_MESSAGE: 'Sage: Alexa, frage Oracle Assistent nach ORA 904',
   HELP_REPROMPT: 'Wie kann ich dir helfen?',
   STOP_MESSAGE: 'Auf Wiedersehen!',
  },
 },
};

const handlers = {
  'LaunchRequest': function () {
    const speechOutput = this.t('WELCOME_SPEECH')+this.t('SQLCODE_HELP_SPEECH');
    const cardHead = this.t('WELCOME_CARD_HEAD');
    const cardBody = this.t('WELCOME_CARD_BODY');
    this.emit(':tellWithCard', speechOutput, cardHead, cardBody);
  },
  'OraErrorIntent': function () {
    if (!this.event.request.intent.slots.sqlcode.value) {
      const speechOutput = this.t('SQLCODE_ERROR_SPEECH')+this.t('SQLCODE_HELP_SPEECH');
      this.emit(':tell', speechOutput);
    } else {     
      var sqlcode = this.event.request.intent.slots.sqlcode.value;
      var oraerror = getOraErrorByCode('ORA',sqlcode);
      if (!oraerror.ErrorType) {
        this.emit(':tell', this.t('SQLCODE_NOTFOUND_SPEECH'));
      } else {
        const speechOutput = 'ORA '+sqlcode+' '
          +'<lang xml:lang="en-US">'+oraerror.English.Name+'</lang> '
          +'<lang xml:lang="en-US">'+oraerror.English.Cause+'</lang> '
          +'<lang xml:lang="en-US">'+oraerror.English.Action+'</lang> '
        ;
        this.emit(':tell', speechOutput);
      }
    }
  },
  'OraTwoErrorIntent': function () {
    if ((!this.event.request.intent.slots.sqlcode_a.value) 
      ||(!this.event.request.intent.slots.sqlcode_b.value)) {
      const speechOutput = this.t('SQLCODE_ERROR_SPEECH')+this.t('SQLCODE_HELP_SPEECH');
      this.emit(':tell', speechOutput);
    } else {
      var sqlcode_a = this.event.request.intent.slots.sqlcode_a.value;
      var sqlcode_b = this.event.request.intent.slots.sqlcode_b.value;
      var sqlcode = parseInt(sqlcode_a)*1000+parseInt(sqlcode_b);
      var oraerror = getOraErrorByCode('ORA',sqlcode);
      if (!oraerror.ErrorType) {
        this.emit(':tell', this.t('SQLCODE_NOTFOUND_SPEECH'));
      } else {
        const speechOutput = 'ORA '+sqlcode+' '
          +'<lang xml:lang="en-US">'+oraerror.English.Name+'</lang> '
          +'<lang xml:lang="en-US">'+oraerror.English.Cause+'</lang> '
          +'<lang xml:lang="en-US">'+oraerror.English.Action+'</lang> '
        ;
        this.emit(':tell', speechOutput);
      }
    }
  },
  'AMAZON.HelpIntent': function () {
   const speechOutput = this.t('HELP_MESSAGE');
   const reprompt = this.t('HELP_REPROMPT');
   this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
   this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
   this.emit(':tell', this.t('STOP_MESSAGE'));
  },
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
    if (lResponse.English.Type) lResponse.ErrorType = lResponse.English.Type;
    if (lResponse.English.Number) lResponse.ErrorNumber = lResponse.English.Number;
  }
  if (lFileGerman) {
    lResponse.German = getOraErrorDetailByCode(lFileGerman,pErrorType,pErrorNumber);
    if (lResponse.German.Type) lResponse.ErrorType = lResponse.German.Type;
    if (lResponse.German.Number) lResponse.ErrorNumber = lResponse.German.Number;
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
