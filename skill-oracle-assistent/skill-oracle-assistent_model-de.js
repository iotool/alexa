{
  "languageModel": {
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
          {
            "name": "sqlcode",
            "type": "AMAZON.NUMBER"
          }
        ]
      },
      {
        "name": "OraTwoErrorIntent",
        "samples": [
          "ora {sqlcode_a} tausend {sqlcode_b}",
          "code {sqlcode_a} tausend {sqlcode_b}",
          "error {sqlcode_a} tausend {sqlcode_b}",
          "fehler {sqlcode_a} tausend {sqlcode_b}",
          "SQL code {sqlcode_a} tausend {sqlcode_b}",
          "ora {sqlcode_a} tausend und {sqlcode_b}",
          "code {sqlcode_a} tausend und {sqlcode_b}",
          "error {sqlcode_a} tausend und {sqlcode_b}",
          "fehler {sqlcode_a} tausend und {sqlcode_b}",
          "SQL code {sqlcode_a} tausend und {sqlcode_b}",
          "ora {sqlcode_a} thousand {sqlcode_b}",
          "code {sqlcode_a} thousand {sqlcode_b}",
          "error {sqlcode_a} thousand {sqlcode_b}",
          "fehler {sqlcode_a} thousand {sqlcode_b}",
          "SQL code {sqlcode_a} thousand {sqlcode_b}",
          "ora {sqlcode_a} thousand and {sqlcode_b}",
          "code {sqlcode_a} thousand and {sqlcode_b}",
          "error {sqlcode_a} thousand and {sqlcode_b}",
          "fehler {sqlcode_a} thousand and {sqlcode_b}",
          "SQL code {sqlcode_a} thousand and {sqlcode_b}"
        ],
        "slots": [
          {
            "name": "sqlcode_a",
            "type": "AMAZON.NUMBER"
          },
          {
            "name": "sqlcode_b",
            "type": "AMAZON.NUMBER"
          }
        ]
      }
    ],
    "invocationName": "oracle assistent"
  }
}