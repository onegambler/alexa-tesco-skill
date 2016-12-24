#Alexa Tesco Skill

##Description
Alexa Skill integration with Tesco. It allows to voice control the shopping on [Tesco Groceries](http://www.tesco.com/groceries/).
It's possible to add products to the grocery basket by only using the voice.

##Features
At the moment it only allows to add a product to the basket
* Add one item to the Tesco Groceries basket
    * Alexa ask Tesco to add milk to the basket
    * Alexa ask Tesco to add milk
* Add multiple items to the Tesco Groceries basket
    * Alexa ask Tesco to add milk times three
    * Alexa ask Tesco to add some milk -> It will prompt you with a question on how many.

##Requirements
* [NodeJs 6](https://nodejs.org/en/download/) and npm
* An Amazon Echo/Dot
* An Amazon developer account
* A [Tesco Groceries](http://www.tesco.com/groceries/) account
* A [IFTTT](https://ifttt.com) account
* A server to process the requests coming from the Echo. In this guide I will use AWS Lambda

##Installation

Ok, let's set everything up.

###IFTTT
Tesco doesn't provide public APIs for adding products to the grocery basket, but an alternative exists. IFTTT integrates with Tesco and it does allow the functionality. So, we just need to create an account with IFTTT (if you don't have one) and create the following applet:

* Click on `My Applets` and then `New applet`
* Click on the blue `this` and search for `Maker`. 
    * Give permission to the service by clicking on `Connect` and then on `Receive a web request`
    * As `Event Name` set `tesco_item`
    * And click on `create trigger`
* Click now on the blue `that` and search for `Tesco`
    * Give permission to the service by clicking on `Connect`and then on `Add product to your basket`
    * Write `{{Value1}}` as `ProductId`. It can be also done by clicking on `ingredients` and then `value1`
    * Finally click on `Create action` and then `Finish` 

At the end you should have an applet that looks like this:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/9900050/21463243/143ab56e-c95e-11e6-80f9-d6391bc62e66.png" alt="Applet image"/>
</p>

Once you have created the Applet, we need to copy the Maker URL. So navigate to the Maker webpage, [here](https://ifttt.com/maker), click on Settings and you will see the account info. Something like this:
```
Account Info
Connected as ...
URL https://maker.ifttt.com/use/<KEY>
Status active
```
Copy the `<KEY>` value and paste at the end of the Maker endpoint:
```
https://maker.ifttt.com/trigger/tesco_item/with/key/<KEY>
```
Let's keep this somewhere as we will need to use it later.

### Amazon Lambda
As mentioned before we are going to need an [AWS account](https://aws.amazon.com/). We will needed to deploy the code to Lambda, which will process the requests. The first 1,000,000 requests/month are free, so more than enough to not spend a penny.

There's plenty of tutorials on how to set it up, so I won't get into details. 
*Before setting it up, please note!*
> "Make sure you’ve selected the N.Virginia for English (US) skills or the EU (Ireland) region for English (UK) and German skills. The region is displayed in the upper right corner. Providing your Lambda function in the correct region prevents latency issues" 

Here's a useful link to set up a Lambda for an Alexa Skill, follow the _Creating a Lambda Function for an Alexa Skill_ paragraph:
* https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function

In order to work properly Lambda needs some environment variables, in the `general` tab let's add these variables:
* _APP_ID_: It's the lambda identification string, it's not a mandatory parameter, but it makes a little bit more secure by making your lambda only accept requests from your specific skill. It can be found in the Alexa Skill set up page.
* _TRIGGER_URL_: It's the IFTTT url we have saved before

### Skill Setup
Once you've setup your lambda, you'll need an Amazon developer account and start creating a new Alexa skill.
1. Tab `Skill Information` 
    * Add `Name` and `Invocation Name`. Be aware that the second is the name you are going to use to activate the skill. I use `Tesco`, so I can say `Alexa ask Tesco..` but it's completely up to you.
    * Click no on `Audio Player`
2. Tab `Interaction Model`
    * Paste the `speechAssets/IntentSchema.json` file into the `Intent Schema` field
    * Paste the `speechAssets/SampleUtterances.txt`. file in the `Sample Utterances` field.
    * Create a `Custom Slot Type` called `GROCERY` and add the content of the file `speechAsset/slot-types/GROCERY`. More info about custom slots can be found [here](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface#custom-slot-types). The list is not comprehensive and you should personalised with items you use. To make it clearer, this is what Alexa will understand. So if there's no `milk` in the list, it would be harder to be understood. Ideally you want a mapping 1 to 1 with the mapping in the file `item-repository.js` (explained later).
3. Tab `Configuration`
    * Set `AWS Lambda ARN` as `Service Endpoint Type`, select the correct geographic region (same as Lambda) and insert the Lambda ARN in the input field.
4. Skip other tabs and click on `Save`

More detailed instructions can be found at the following: [Steps to Create a Smart Home Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/steps-to-create-a-smart-home-skill)

### Customising the products
Now what we need to do is tell the skill which product we want to add to the basket when we say `milk`!
So, in the project open `lib/repository/item-repository.js`. The file contains a mapping between an item and Tesco Item Id (IFTTT accepts only ids). This needs to be personalised according to your shopping. In order to do so, go to the Tesco Groceries web page and start getting all the item ids for the products you usually buy.
In each product page you can find the id in the url

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/9900050/21467441/f19ceb16-c9e5-11e6-96fe-c501691e832e.png" alt="Applet image"/>
</p>

````
http://www.tesco.com/groceries/product/details/?id=264245536
````
In this case *264245536* and then add it to the `item-repository` list.

```javascript
const items = {
    banana: '275280804',
    'cherry tomatoes': '285212132',
    halloumi : '264245536'
};
```
If the product is a compound word, like `cherry tomatoes` you can defined them surrounded by apostrophe. Once products are mapped, you can save and move to the next step.

### Building and deploying
Install node version 6 with npm, if you haven't done it already, and make sure it works properly.
Clone this project: 
```
git clone https://github.com/onegambler/alexa-tesco-skill.git
```
and `cd` into the folder alexa-tesco-skill.

Then run 
```
npm install
```
to download all dependencies

The project comes with some gulp scripts to make the build easy. So let's install it globally
```
npm install -g gulp
```
Ok, now we can build the project into a zip file that can be uploaded into the lambda.
```
gulp build
```
If everything went ok, you should now see a `dist` folder containing a `dist.zip` file.

#Putting all together
Ok, so; as last step we need to deploy the file into AWS Lambda. The project comes with `node-aws-lambda` a node utility used for Lambda's deployment. You can read more about it [here](https://www.npmjs.com/package/node-aws-lambda).
I honestly prefer to do it manually so I don't have to deal with access keys and tokens; so let's go back to the newly created lambda - on the AWS console page - and let's upload the `dist.zip` file.
Then click on `save` and we should be ready to go. Try with one of your products and see if it works!
