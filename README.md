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

### Skill Setup
Once you've setup your lambda, you'll need an Amazon developer account and start creating a new Alexa skill.
More detailed instructions can be found at the following: [Steps to Create a Smart Home Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/steps-to-create-a-smart-home-skill)
Plase note, from the documentation:


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
