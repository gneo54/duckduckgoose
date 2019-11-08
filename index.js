// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const skillName = 'Duck Duck Goose';
function getAllEntitledProducts(inSkillProductList) {
  const entitledProductList = inSkillProductList.filter(record => record.entitled === 'ENTITLED');
  return entitledProductList;
}


const LaunchRequestISPHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Connections.Response';
    },
    
    
    handle(handlerInput) {
        
        if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ALREADY_PURCHASED'){
            const speakOutputProduct = ' Get ready! Say, Play, to begin!';
              return handlerInput.responseBuilder
                .speak(speakOutputProduct)
                .reprompt(speakOutputProduct)
                .getResponse();
        }
        else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'ACCEPTED'){
            const speakOutputProduct = ' Get ready! Say, Play, to begin!';
              return handlerInput.responseBuilder
                .speak(speakOutputProduct)
                .reprompt(speakOutputProduct)
                .getResponse();
            
        }
        else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'DECLINED'){
            const speakOutputProduct = ' You can still play a short game. Get ready! Say, Play, to begin!';
              return handlerInput.responseBuilder
                .speak(speakOutputProduct)
                .reprompt(speakOutputProduct)
                .getResponse();
            
        }
         else if (handlerInput.requestEnvelope.request.payload.purchaseResult === 'PENDING_PURCHASE'){
            const speakOutputProduct = ' You can still play a short game. Get ready! Say, Play, to begin!';
              return handlerInput.responseBuilder
                .speak(speakOutputProduct)
                .reprompt(speakOutputProduct)
                .getResponse();
            
        }
        

    }
}
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    }, 
    async handle(handlerInput) {
        
        console.log(`~~~~ in LaunchRequest`);
    const locale = handlerInput.requestEnvelope.request.locale;
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    
    //const monetizationService = handlerInput.serviceClientFactory.getMonetizationServiceClient();
    const voicePurchaseSetting = await ms.getVoicePurchaseSetting();
    try {
        const purchasedResults = await ms.getInSkillProducts(locale);
    
    
        const entitledProducts = getAllEntitledProducts(purchasedResults.inSkillProducts);
                console.log(`~~~~ after factory`);
                if (entitledProducts && entitledProducts.length > 0) {
                  // Customer owns one or more products
        console.log(`~~~~ launch re - 1 or more`);            
                  const speakOutputProduct = `Welcome to ${skillName}. You currently own the longer game with more than 10 Ducks. ` +
                      ' Get ready! Say, Play, to begin!';
                  return handlerInput.responseBuilder
                    .speak(speakOutputProduct)
                    .reprompt(speakOutputProduct)
                    .getResponse();
                }
        console.log(`~~~~ launch re - o products`);            
                // Not entitled to anything yet.
                console.log('No entitledProducts');
                var speakOutputNoProduct = `Welcome to ${skillName}. A short game with 5 to 10 Ducks. Get ready to point! Say, Play, to begin. `;
                if (voicePurchaseSetting)
                    speakOutputNoProduct += ' To hear about the longer game that you can purchase, with more than 10 Ducks, say, What can I buy?';
                return handlerInput.responseBuilder
                  .speak(speakOutputNoProduct)
                  .reprompt(speakOutputNoProduct)
                  .getResponse();
    }
    catch (err){
           console.log(`Error calling InSkillProducts API: ${err}`);
        
                return handlerInput.responseBuilder
                  .speak('Something went wrong in loading your purchase history')
                  .getResponse();
    }
    
        
    
    }
    
      /*  const speakOutput = 'Welcome to Eeny, meeny, miny, moe. Get ready by pointing. Say Start to begin! ';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
            */
};
const startIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'startIntent' ;
    },
    async handle(handlerInput) {
        console.log(`~~~~ start or play again`);            
        const locale = handlerInput.requestEnvelope.request.locale;
    
    const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();

    const voicePurchaseSetting = await ms.getVoicePurchaseSetting();
    try {
        const purchasedResults = await ms.getInSkillProducts(locale);
        
        
        const entitledProducts = getAllEntitledProducts(purchasedResults.inSkillProducts);
        
       

        // Create speech output
        //const speechOutput = this.t('GET_STARTGAME_MESSAGE') + wordsToSay;
        var hasLongerGame = false;
        if (entitledProducts && entitledProducts.length > 0) {
          // Customer owns one or more products
          hasLongerGame = true;
            //const speakOutputProduct = 'Eeny, meeny, miny, moe. Catch, a, tiger, by, the, toe. If, he, hollers, let, him, go. Eeny, meeny, miny, moe! If you want to play again, say, play again. To stop, say, stop.';
          
          /*
          return handlerInput.responseBuilder
            .speak(speakOutputProduct)
            .reprompt(speakOutputProduct)
            .getResponse();
            */
        }
        // 5 and 20 (5 and 21)
        // 5 and 10 (5 and 11)
        var floorNumber = 5;
        var ceilingNumber = 11;

        // 15 and 50 (15 and 51)
        // 10 and 50 (10 and 51)
        if (hasLongerGame){
            floorNumber = 10;
            ceilingNumber = 51;
        }

        const randomNumberBetweenFiveAndTwenty = Math.random() * (ceilingNumber - floorNumber) + floorNumber;
        // Get a random space fact from the space facts list
     
        var wordsToSay = '';

        for (var i = 0; i < randomNumberBetweenFiveAndTwenty; i++) {
            wordsToSay += ' Duck. ';

        }
        wordsToSay += 'Goose!';

        // Not entitled to anything yet.
        console.log('Regular Game');
        
        var speakOutputNoProduct = wordsToSay +' If you want to play again, get ready and say, play again.';

        if (voicePurchaseSetting && !hasLongerGame)
            speakOutputNoProduct += ' If you want to play longer, with more than 10 Ducks, say, play longer.';
            
        speakOutputNoProduct+=' To stop, say, stop.';
            
        
        //const speakOutputNoProduct = `Welcome to ${skillName}. Say Start to begin a short game! To hear about the longer game that you can purchase, ' +
        //'say What can I buy.`;
        return handlerInput.responseBuilder
          .speak(speakOutputNoProduct)
          .reprompt(speakOutputNoProduct)
          .getResponse();
    }
    catch(err)
    {
        console.log(`Error calling InSkillProducts API: ${err}`);

        return handlerInput.responseBuilder
          .speak('Something went wrong in loading your purchase history')
          .getResponse();
    }
    
      
      
 
    
    
       
    }
};

const WhatCanIBuyIntentHandler = {
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'WhatCanIBuyIntent');
    },
   async handle(handlerInput) {
        console.log('~~~~ WhatCanIBuyIntentHandler');

        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        

        const voicePurchaseSetting = await ms.getVoicePurchaseSetting();
        return ms.getInSkillProducts(locale).then(
            function reportPurchasedProducts(result) {

                
                if (!voicePurchaseSetting) {
                    const cannotBuy = 'Sorry, In-Skill Purchasing is disabled. If you want to play, get ready and say, play. To stop, say, stop.';

                    return handlerInput.responseBuilder
                        .speak(cannotBuy)
                        .reprompt(cannotBuy)
                        .getResponse();
                }

                const entitledProducts = getAllEntitledProducts(result.inSkillProducts);
                if (entitledProducts && entitledProducts.length > 0) {
                    // Customer owns one or more products

                    const speakOutputProduct = 'You already own the longer game. If you want to play, get ready and say, play. To stop, say, stop.';

                    return handlerInput.responseBuilder
                        .speak(speakOutputProduct)
                        .reprompt(speakOutputProduct)
                        .getResponse();
                }

                // Not entitled to anything yet.
                console.log('pitch');
                const speakOutputNoProduct = 'You can purchase and play the Longer Game which includes more than 10 Ducks by saying, Buy Longer Game.';
                //const speakOutputNoProduct = `Welcome to ${skillName}. Say Start to begin a short game! To hear about the longer game that you can purchase, ' +
                //'say What can I buy.`;
                return handlerInput.responseBuilder
                    .speak(speakOutputNoProduct)
                    .reprompt(speakOutputNoProduct)
                    .getResponse();
            },
            function reportPurchasedProductsError(err) {
                console.log(`Error calling InSkillProducts API: ${err}`);

                return handlerInput.responseBuilder
                    .speak('Something went wrong in loading your purchase history')
                    .getResponse();
            },
        );

    }
};

  
const BuyLongerGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'BuyIntent');
    },
    handle(handlerInput) {
        
        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        console.log(`~~~~ after factory`);
        return ms.getInSkillProductsTransactions(locale).then(
          function reportCurrentProductStatus(result) {
              
              var startPurchase = false;
              
              if (result.length > 0){
                  if (result[0].Status === 'PENDING_APPROVAL_BY_PARENT' ){
                      const speakOutput = 'Until it is approved, you can play now by saying, Play';
    
                        return handlerInput.responseBuilder
                            .speak(speakOutput)
                            .reprompt(speakOutput)
                            .getResponse();
                  }
                  else{
                    startPurchase = true;        
                  }
              }
              else{
                  startPurchase = true;
              }
              
              if (startPurchase){
                return handlerInput.responseBuilder
                    .addDirective({
                        type: "Connections.SendRequest",
                        name: "Buy",
                        payload: {
                            InSkillProduct: {
                                productId: "amzn1.adg.product.77c38941-8a05-4055-b9fb-a5fd3e20781e",
                            }
                        },
                        token: "correlationToken"
                    })
                    .getResponse();
              }
        }
    );
        //const speakOutput = 'You can purchase the Longer Game by saying, Buy Longer Game.';

        
    }
};
const CancelLongerGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'RefundProductIntent');
    },
    handle(handlerInput) {
        //const speakOutput = 'You can purchase the Longer Game by saying, Buy Longer Game.';
        return handlerInput.responseBuilder
        .addDirective({
            type: "Connections.SendRequest",
            name: "Cancel",
            payload: {
                InSkillProduct: {
                    productId: "amzn1.adg.product.77c38941-8a05-4055-b9fb-a5fd3e20781e",
                }
            },
            token: "correlationToken"
        })
        .getResponse();
        
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const voicePurchaseSetting = await ms.getVoicePurchaseSetting();
        
        
        var speakOutput = 'You can say, play, to play the game.';
        if (voicePurchaseSetting){
            speakOutput += ' or you can say, what can I buy.';
        }
        speakOutput += ' What would you like to do? ';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye, thanks for playing!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ err`);          
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        startIntentHandler,
        WhatCanIBuyIntentHandler,
        BuyLongerGameIntentHandler,
        LaunchRequestISPHandler,
        HelpIntentHandler,
        CancelLongerGameIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
