const formatMessage = require('./utils/msg')

const flowerNamesWithoutEndings = [
    "krokus",
    "pierwosn", // pierwiosnki
    "szafir", // szafirki
    "tulipan",
    "narcyz",
    "forsycj", // forsycja
    "lilak",
    "magnoli", // magnolia
    "różanecznik",
    "piwoni", // piwonia
    "krzewuszk", // krzewuszka
    "wiśni" // wiśnia
]

function maybeGetBannedWordWarningMessage(userName, msg, botName) {
    if (doesContainBannedWords(msg))
        return formatMessage(botName, `Użytkownik ${userName} napisał zabronione słowo, wiadomość została usunięta.`)
}

function doesContainBannedWords(msg) {
    return msg.replace(/[\W_]+/g, "")
        .split(" ")
        .some(word => flowerNamesWithoutEndings.some(bannedWord => word.includes(bannedWord)))
}

module.exports = {
    maybeGetBannedWordWarningMessage
}