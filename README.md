
# offTracker - Discounted Online Shopping Solution

Track discounts on favorite items across the web using scraping methods and an interactive dashboard.

![Index](https://i.imgur.com/dwxe7J4.png)

## Table of Contents

- [Overview](#overview)
- [Architecture / Event Chain](#architecture--event-chain)
- [Installation](#installation)
- [API Instructions](#api-instructions)
- [Contributing](#contributing)
- [Authors & License](#authors--license)

## Overview

offTracker is a JavaScript program that utilizes primarily Puppeteer to achieve the purpose of automating the process of tracking the client's favorite items for discounts and sales. 

Instead of the client manually checking several products on different websites every day, the program scans items for price changes every 2 hours (`controller.js` -> `c_launchscan`) and acknowledges the user that a discount has been applied.

## Architecture / Event Chain

#### The program is written in a Model, View, Controller (**MVC**) Architecture;

**Model** - MongoDB & Mongoose to store and load data.

**View** - EJS engine for HTML with Embeeded-JavaScript to present data to the client.

**Controller** - NodeJs & Express for the scraping functionalities and client-server communication.

#### The chain of events works in the following methodology
* Product URL is inputted in the 'Add' form (either clothes or fragrances)
* After form validation, server uses hard-coded (or RegEx if you choose to) query selectors to withdraw information from the target website
* Information is saved in the MongoDB Cluster and is then displayed in the index page under different sections, according to pre-set criteria.
* In the clothing section, items are "checked" every 5 minutes via node-cron scheduled scans (@server.js > cron_schedule), if the item has been scanned in the last 2 hours - skip it, if not - scan it.

## Installation

Clone the repository to your local machine

```bash
git clone git@github.com:lironbm7/offTracker.git
```
Install the required dependencies
```bash
npm install 
```

Create a .env with the following parameters
```bash
MONGO_URI = ...
SERVERURL = http://address:PORT
// For localhost, simply input localhost:3000
```

Modify SERVERURL @ assets/js/buttons.js
```bash
const SERVERURL = 'https://address';
// PORT is not needed, simply the URL.
```

Start the server
```bash
npm start
```


## API Instructions

#### controller.js includes the API endpoint functions, ex. scraping, creating instances / updating / deleting them.
#### Functions are divided into two sections - Clothing items / Fragrances. 

Fragrances will not be scanned nor updated unless the user decides to, manually, and are presented in a different page (Menu -> Fragrances).

Clothing items will be scanned and updated and displayed in the index page. In order to track items, adding proper selectors for every website is required and is explained below:

`controller.js`

|  Variable | Description                |
| :-------- | :---------------- |
| `websiteMap` | Object that contains all authorized/compatible websites and their URL, used in form validation |
| `switch(targetSite)` | Define the required query selectors for every target website (ex. case 'Asos':) |
| `data_...` | Represents a property of the clothing item, define a querySelector that dynamically detects it |
| `diff < 3600000` | Difference in ms between right now and when the item was last scanned (modifiable) |
| `timeout: 20000` | Time in ms from when search for an element has begun until skipping to next item due to failure


websiteMap Object used for Form Validation
```javascript
const websiteMap = {
    'Asos': 'asos.com',
    'Factory54': 'factory54.co.il',
    'ExampleWebsite': 'example.website'
};
```

Assigning the Object Key as the targetSite so the program knows which query selectors to address when scraping
```javascript
const targetSite = Object.keys(websiteMap).find(site => url.includes(websiteMap[site]));
```

```javascript
case 'ExampleWebsite':
    data_imgurl = await page.evaluate(() => {
        const query = document.querySelector('.product__media-image-wrapper > img').getAttribute('src');
        return `https:${query}`;
    })
    data_designer = await page.evaluate(() => document.querySelector("product-meta > h2 > a").textContent);
    data_ftitle = await page.evaluate(() => document.querySelector("product-meta > h1").textContent);
    data_title = data_ftitle.replace(`${data_designer} `, '');
    data_price = await page.evaluate(() => {
        let path = document.querySelector("meta[property='product:price:amount']").getAttribute("content");
        return `₪ ${path}`
    })
    break;
```

## Contributing

If you would like to contribute to this project, please open an issue or pull request on GitHub.


## Authors & License

[@lironbm7](https://github.com/lironbm7)

This project is licensed under the MIT license. See the LICENSE file for more details.




