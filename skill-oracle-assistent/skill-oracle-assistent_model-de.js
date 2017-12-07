{
  "languageModel": {
    "invocationName": "oracle assistent",
    "intents": [
      {
        "name": "AMAZON.CancelIntent",
        "samples": []
      },
      {
        "name": "AMAZON.HelpIntent",
        "samples": []
      },
      {
        "name": "AMAZON.StopIntent",
        "samples": []
      },
      {
        "name": "OraErrorIntent",
        "samples": [
          "ora {sqlcode}",
          "code {sqlcode}",
          "error {sqlcode}",
          "fehler {sqlcode}",
          "SQL code {sqlcode}"
        ],
        "slots": [
          { "name":"sqlcode", "type":"AMAZON.NUMBER" }
        ]
      }
    ]
  }
}