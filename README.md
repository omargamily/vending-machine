# vending-machine
vending machine api

## installation
download the code, then ```cd /to/code/dir && npm install``` 

## usage
to be able to use the api endpoints, you will need to sign up using the ```POST /api/user/``` endpoint <br />
```POST /api/user/``` takes the following parameters in request body```username``` ```password``` ```role``` role can either be ```buyer``` or ```seller```<br />
all content going into the app and out should be json
### you can:
  &nbsp; ```login``` into your account to be able to use the api. using ```POST /api/user/signin```<br/>
  &nbsp; ```delete``` your account using ```DELETE /api/user/``` endpoint<br />
  &nbsp; ```get``` your profile using ```GET /api/user/``` endpoint<br />
  &nbsp; ```change``` your password using ```PUT /api/user/``` endpoint which takes following parameters in the body: ```password```<br />
  &nbsp; you can get the products being sold usign  ```GET /api/product/``` <br/>
  
  #### if you are a ```buyer```:
  &nbsp; you can deposit money into your account using ```POST /api/user/deposit``` whitch takes the following parameter in the body ```deposit``` &nbsp; and the deposit should be a value from the following ```[5,10,20,50,100]```<br/>
  &nbsp; <br/>you can reset your deposit using this end point ```GET /api/user/```<br/>
  &nbsp; <br/>you can buy a product using ```POST /api/product/buy``` which take the following parameter in the request body:<br/>
  &nbsp; &nbsp; ```productId``` the id of the product you want to buy. ```quantity``` how many piece do you want
  
  #### if you are a ```seller```:
  &nbsp; you can create a product for buyers to buy using ```POST /api/product/``` which takes the following parameters in the request body <br/>  &nbsp; ```productName``` ```amountAvaliable``` ```cost``` <br/>
  &nbsp; <br/> you can delete a product using ```DELETE /api/product/?productId``` which takes ```productId``` in the url query 
  &nbsp; <br/> you can update one of your products using ```PUT /api/product/``` which takes the following parameters in the request body <br/> 
  &nbsp; &nbsp; ```key``` which the key you want ot change<br/>
  &nbsp; &nbsp; ```value``` which the new value for this key <br/>
  &nbsp; &nbsp; ```productId``` the prouct id for the product you want to update<br/>
