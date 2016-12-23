#Alexa Tesco Skill

##Description
Alexa Skill integration with Tesco. It allows to voice control the shopping on [Tesco Groceries](http://www.tesco.com/groceries/).
It's possible to add products to the grocery basked by only using the voice.

##Features
It supports only one feature at the moment, add a product to the basked
* Alexa ask Tesco to add milk to the basked
* Alexa ask Tesco to add milk
* Alexa ask Tesco to add some milk

##Requirements
* An Amazon Echo/Dot
* A [Tesco Groceries](http://www.tesco.com/groceries/) account
* A [IFTTT](https://ifttt.com) account
* A server to process the requests coming from the Echo. In this guide I will use a Lambda

##Installation
###IFTTT
Tesco doesn't provide public APIs for adding products to the grocery basket, but an alternative exists. IFTTT integrates with Tesco and it does allow the functionality. So, we just need to create an account with IFTTT (if you don't have one) and create the following applet:

* Click on `My Applets` and then `New applet`
* Click on the blue `this` and search for `Maker`. 
    * Give permission to the service and then `Receive a web request`
    * As `Event Name` set `tesco_item`
At the end you should have an applet that looks like this:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/9900050/21463243/143ab56e-c95e-11e6-80f9-d6391bc62e66.png" alt="Applet image"/>
</p>

Once you have created the Applet, we need to copy the Maker URL. So navigate to the Maker webpage, [here](https://ifttt.com/maker), click on Settings and you will see the account info. Something like this:
```
Account Info
Connected as onegambler
URL https://maker.ifttt.com/use/<KEY>
Status active
```
Copy the <key> value and paste at the end of the Maker endpoint

```https://maker.ifttt.com/trigger/tesco_item/with/key/<KEY>```

Let's keep this somewhere as we will need to use it later.

### Skill Setup
More detailed instructions can be found at the following: [Steps to Create a Smart Home Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/steps-to-create-a-smart-home-skill)
Plase note, from the documentation:
> "Make sure you’ve selected the N.Virginia for English (US) skills or the EU (Ireland) region for English (UK) and German skills. The region is displayed in the upper right corner. Providing your Lambda function in the correct region prevents latency issues" 
### Amazon Lambda
An [AWS account](https://aws.amazon.com/): needed to deploy the code to Lambda, which will process the requests. The first 1,000,000 requests/month are free, so more than enough to not spend a penny.
https://ifttt.com/applets/45769228d
For a detailed explanation on how to 
### Building and deploying
Install node version 6
Install gulp globally

