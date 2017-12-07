'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
  'de': {
    translation: {
        SKILL_NAME: 'Willkommen beim Oracle Assistent',
        HELP_MESSAGE: 'Du kannst sagen, „ORA 9 0 4“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
        HELP_REPROMPT: 'Wie kann ich dir helfen?',
        STOP_MESSAGE: 'Auf Wiedersehen!',
    },
  },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetError');
    },
    'OraErrorIntent': function () {
        this.emit('GetError');
    },
    'GetError': function () {
      var sqlcode = '?';
      if (this.event.request.intent.slots.sqlcode.value) {
        sqlcode = this.event.request.intent.slots.sqlcode.value;
      }
      if (sqlcode == '?') {
        this.response.speak("Ich konnte dich nicht verstehen. Sage zum Beispiel Ora eins null neun");
        this.emit(':responseReady');                
      } else {
        var oraerror = getOraErrorBySqlcode(sqlcode);
        const randomFact = ' <prosody rate="x-slow">'+oraerror.e+'</prosody> bedeutet '+oraerror.d+'. Lösung: '+oraerror.a;
        const speechOutput = 'ORA ' + sqlcode + ' ' + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
      }
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
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

function getOraErrorBySqlcode(sqlcode) {
  var oraerror = {
    "n":sqlcode,
    "e":"unsupported s q l code",
    "d":"ich kann nichts zum S Q L Code "+sqlcode+" sagen",
    "a":"Bitte versuches es noch einmal."
  };
  for (var i = 0; i < data.sqlcode.length; i++) {
    if(parseInt(data.sqlcode[i].n) == parseInt(sqlcode)) {
      oraerror = data.sqlcode[i];
    }
  }
  return oraerror;
}

const data = {
  "sqlcode" : [
    {
      "n":904,
      "e":"invalid column name",
      "d":"eine oder mehrere abgefragten Spalten sind falsch",
      "a":"Mache einen Select Stern from Tabelle, dann siehst du alle Spalten."
    },
    {
      "n":12154,
      "e":"could not resolve the connect identifier specified",
      "d":"Ein TNS Problem besteht, wenn der Connect Identifier nicht aufgelöst werden kann",
      "a":"fehlerhafte Einstellungen in der T N S NAMES Punkt ORA oder S Q L NET Punkt ORA"
    }
  ]
};