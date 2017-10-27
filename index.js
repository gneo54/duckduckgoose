/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = '';  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            
            SKILL_NAME: 'Duck Duck Goose',
            //GET_FACT_MESSAGE: "Here's your fact: ",
            GET_STARTGAME_MESSAGE: "Okay. Let's start!",
            HELP_MESSAGE: 'You can say play duck duck goose, or, you can say stop... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'en-US': {
        translation: {
           
            SKILL_NAME: 'Duck Duck Goose',
        },
    },
    'en-GB': {
        translation: {
 
            SKILL_NAME: 'British Duck Duck Goose',
        },
    
    }
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('StartGame');
    },
    'StartGameIntent': function () {
        this.emit('StartGame');
    },
    'StartGame': function () {

        const randomNumberBetweenFiveAndTwenty = Math.random() * (21 - 5) + 5;
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        //const factArr = this.t('FACTS');
        //const factIndex = Math.floor(Math.random() * factArr.length);
        //const randomFact = factArr[factIndex];
        var wordsToSay = '';

        for (var i = 0; i < randomNumberBetweenFiveAndTwenty; i++) {
            wordsToSay += ' Duck. ';

        }
        wordsToSay += 'Goose!';

        const cardDetails = 'Duck ' + randomNumberBetweenFiveAndTwenty + ' time(s), then Goose!';
        // Create speech output
        const speechOutput = this.t('GET_STARTGAME_MESSAGE') + wordsToSay;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), cardDetails);
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
