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
        "name": "AllgemeineInformation_Intent",
        "samples": [
          "impressum",
          "informationen zum skill",
          "version vom skill",
          "version des skills",
          "skillversion",
          "skill version",
          "skillrelease",
          "skill relase",
          "imprint",
          "information about skill",
          "information about the skill",
          "version of skill",
          "version of the skill"
        ],
        "slots": [
        ]
      },
      {
        "name": "EinstiegFehlermeldung_Intent",
        "samples": [
          "fehlermeldung",
          "eine fehlermeldung",
          "ich habe eine fehlermeldung",
          "habe eine fehlermeldung",
          "ich habe ein problem mit einem fehler",
          "ich habe ein problem mit einer fehlermeldung",
          "errormessage",
          "an error message",
          "a error message",
          "i had an error",
          "i had a error",
          "i had error",
          "i has an error",
          "i has a error",
          "i has error",
          "i have an error",
          "i have a error",
          "i have error"
        ],
        "slots": [
        ]
      },
      {
        "name": "EinstiegSyntaxfrage_Intent",
        "samples": [
          "syntaxfrage",
          "eine syntaxfrage",
          "ich habe eine syntaxfrage",
          "habe eine syntaxfrage",
          "syntaxproblem",
          "ein syntaxproblem",
          "ich habe ein syntaxproblem",
          "habe ein syntaxproblem",
          "ich habe eine frage zur syntax",
          "ich habe ein problem mit der syntax",
          "ich ein problem mit der syntax",
          "ich kenne die syntax nicht"
        ],
        "slots": [
        ]
      },
      {
        "name": "OraErrorA_Intent",
        "samples": [
          "ora",
          "sql code",
          "s q l code",
          "sql kot",
          "s q l kot",
          "ora {sqlcode}",
          "error {sqlcode}",
          "fehler {sqlcode}",
          "sql code {sqlcode}",
          "s q l code {sqlcode}",
          "sql kot {sqlcode}",
          "s q l kot {sqlcode}"
        ],
        "slots": [
          { "name":"sqlcode", "type":"AMAZON.NUMBER" }
        ]
      },
      {
        "name": "OraErrorB_Intent",
        "samples": [
          "ora {sqlcode_a} tausend {sqlcode_b}",
          "error {sqlcode_a} tausend {sqlcode_b}",
          "fehler {sqlcode_a} tausend {sqlcode_b}",
          "sql code {sqlcode_a} tausend {sqlcode_b}",
          "s q l code {sqlcode_a} tausend {sqlcode_b}",
          "sql kot {sqlcode_a} tausend {sqlcode_b}",
          "s q l kot {sqlcode_a} tausend {sqlcode_b}",
          "ora {sqlcode_a} tausend und {sqlcode_b}",
          "error {sqlcode_a} tausend und {sqlcode_b}",
          "fehler {sqlcode_a} tausend und {sqlcode_b}",
          "sql code {sqlcode_a} tausend und {sqlcode_b}",
          "s q l code {sqlcode_a} tausend und {sqlcode_b}",
          "sql kot {sqlcode_a} tausend und {sqlcode_b}",
          "s q l kot {sqlcode_a} tausend und {sqlcode_b}",
          "ora {sqlcode_a} thousand {sqlcode_b}",
          "error {sqlcode_a} thousand {sqlcode_b}",
          "fehler {sqlcode_a} thousand {sqlcode_b}",
          "sql code {sqlcode_a} thousand {sqlcode_b}",
          "s q l code {sqlcode_a} thousand {sqlcode_b}",
          "ora {sqlcode_a} thousand and {sqlcode_b}",
          "error {sqlcode_a} thousand and {sqlcode_b}",
          "fehler {sqlcode_a} thousand and {sqlcode_b}",
          "sql code {sqlcode_a} thousand and {sqlcode_b}",
          "s q l code {sqlcode_a} thousand and {sqlcode_b}",
          "ora ein tausend {sqlcode_b}",
          "error ein tausend {sqlcode_b}",
          "fehler ein tausend {sqlcode_b}",
          "sql code ein tausend {sqlcode_b}",
          "s q l code ein tausend {sqlcode_b}",
          "sql kot ein tausend {sqlcode_b}",
          "s q l kot ein tausend {sqlcode_b}",
          "ora ein tausend und {sqlcode_b}",
          "error ein tausend und {sqlcode_b}",
          "fehler ein tausend und {sqlcode_b}",
          "sql code ein tausend und {sqlcode_b}",
          "s q l code ein tausend und {sqlcode_b}",
          "sql kot ein tausend und {sqlcode_b}",
          "s q l kot ein tausend und {sqlcode_b}"
        ],
        "slots": [
          { "name":"sqlcode_a", "type":"AMAZON.NUMBER" },
          { "name":"sqlcode_b", "type":"AMAZON.NUMBER" }
        ]
      }
    ]
  }
}