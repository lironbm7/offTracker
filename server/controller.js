let fragdb = require('../server/f_model');
let clothingdb = require('../server/c_model');

const puppeteer = require('puppeteer');

let ISHEADLESS = true;
if(process.env.SERVERURL == 'http://localhost:3000') {  // if localhost, we can use puppeteer GUI. I prefer so.
    ISHEADLESS = false;
}
console.log(`Puppeteer method { headless } automatically set to '${ISHEADLESS}'.`);

let isScanning = false;
const websiteMap = {
    'Asos': 'asos.com',
    'Factory54': 'factory54.co.il',
    'ExampleWesbite': 'example.website'
};

// FRAGRANCES
exports.create = (req,res) => {    
    if(!req.body.url || !req.body.ownership) {
        res.status(400).redirect('/add-frag');
        return;
    }
    else if (!req.body.url.includes('https://www.fragrantica.com')) { 
        res.status(400).send('<script>alert("You have to use a www.fragrantica.com URL."); location.replace("/add-frag")</script>')
        return;
    }

    (async () => {
        const browser = await puppeteer.launch( { headless: ISHEADLESS, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36');    
        let scraped = false;
        try {
            await page.goto(req.body.url, {timeout: 20000});
            const full_title = await page.evaluate(() => {
                const title = document.querySelector("div#toptop").textContent;
                let formatted = title.replace(/for women|for men|for women and men|and men/, '');
                formatted = formatted.replace('and men', '');  // remove remaining 'and men' if unisex
                return formatted;
            })
            const data_designer = await page.evaluate(() => {
                return document.querySelector("span.vote-button-name").textContent;
            })
            const data_title = full_title.replace(`${data_designer}`, '');
            const data_rating = await page.evaluate(() => {
                return document.querySelector("p.info-note span").textContent;
            })
            const data_image = await page.evaluate(() => {
                return document.querySelector('.cell .small-12 img').src;
            })

            await browser.close();

            const frag = new fragdb({
                url: req.body.url,
                ownership: req.body.ownership,
                link: req.body.link,
                designer: data_designer,
                title: data_title,
                rating: data_rating,
                imgurl: data_image
            })
    
            frag
                .save(frag)
                .then(data => {
                    res.send('<script>alert("Fragrance successfully added."); location = "/f-index"</script>')
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occured while running a create operation"
                    })
                })

        } catch(err) {
            res.status(500).send('<script>alert("An error occured trying to generate data from URL. Please make sure the Fragrantica link inputted is valid."); location.replace("/add-frag")</script>')
            await browser.close();
        }
    })();
}

exports.find = (req, res) => {
    if(req.query.id) {
        const id = req.query.id;

        fragdb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Frag ID ${id} not found.` });
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving Frag ID ${id}`})
        })

    } else {
        fragdb.find() 
        .then(frag => {
            res.send(frag)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error occured while retrieving frag info"});
        })
    }
}

exports.update = (req, res) => {
    if(!req.body) {
        return res
            .status(400)
            .send( { message: "Data can not be empty" })
    }
    const id = req.params.id;
    fragdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Frag ID ${id} not found.`});
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Error updating fragrance info' });
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;

    fragdb.findByIdAndDelete(id)
    .then(data => {
        if(!data) {
            res.status(404).send({ message: `Can not delete ID ${id}. Frag not found.`})
        } else {
            res.send({ message: 'Frag was deleted successfuly.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: `Could not delete frag with ID ${id}` });
    })
}

// CLOTHING
exports.c_create = async (req,res) => {    
    // Form validation, check if form empty and then check valid url input according to object
    if(!req.body.url) {
        res.status(400).redirect('/add-clothing');
        return;
    }
    if(Object.entries(websiteMap).find(([, website]) => req.body.url.includes(website)) === undefined) {
        return res.status(422).send('<script>alert("You have to use a supported website."); location.replace("/add-clothing")</script>');
    }

    const url = req.body.url;
    const targetSite = Object.keys(websiteMap).find(site => url.includes(websiteMap[site]));
    let data_imgurl, data_ftitle, data_designer, data_title, data_price, data_palert, data_site, data_fprice;
    let data_date = new Date();        
    const browser = await puppeteer.launch( { headless: ISHEADLESS, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36');
    try {
        await page.goto(formatted_url, {timeout: 20000});
        switch(targetSite) {
            // Provided 5 scraping examples, modify to your own taste and needs
            case 'Factory54':
                data_imgurl = await page.evaluate(() => {
                    let query = '';
                    try { query = document.querySelector("#imgCarousel-0 img").getAttribute('src'); }  // desktop query
                    catch(err) { query = document.querySelector("#slick-slide00 > img").getAttribute('src'); }  // mobile query
                    return `https://www.factory54.co.il${query}`;
                })
                data_designer = await page.evaluate(() => {
                    try { return document.querySelector('div.row.name-product h1 a').textContent; }
                    catch(err) { return document.querySelector(".product-name").textContent; }
                })
                data_title = await page.evaluate(() => {
                    try { return document.querySelector('div.row.name-product h1.product-name.name-product__product ').textContent; }
                    catch(err) { return document.querySelector(".name-product__product").textContent; }
                })
                data_price = await page.evaluate(() => {
                    try { return document.querySelector('.sale-price .price-inverse').textContent; }  // if on sale
                    catch(err) { return document.querySelector("div.price-info span").innerText; }
                })
                break;
            case 'BenMenWear':
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
            case 'Diesel':
                data_imgurl = await page.evaluate(() => document.querySelector(".flickity-slider a").getAttribute('href'));
                data_ftitle = '';
                data_designer = 'Diesel';
                data_title = await page.evaluate(() => document.querySelector(".ac-single-prod-title-wrapper h1").innerText); 
                data_price = await page.evaluate(() => {
                    try { return document.querySelector(".woocommerce-variation-add-to-cart-disabled ins bdi").textContent; }
                    catch(err) { return document.querySelector(".woocommerce-Price-amount bdi").textContent; }
                })
                break;
            case 'Terminal X':
                data_imgurl = await page.evaluate(() => document.querySelector("meta[property='og:image']").getAttribute("content"));
                data_ftitle = '';
                data_designer = await page.evaluate(() => {
                    try { return document.querySelector("div.name-and-brand_m2Cb.rtl_3N3l > a").textContent }
                    catch(err) { return document.querySelector(".brand_2ltz").textContent }
                })
                data_title = await page.evaluate(() => document.querySelector("div.name-and-brand_m2Cb.rtl_3N3l > h1").textContent);
                data_price = await page.evaluate(() => document.querySelector(".prices_3bzP .rtl_2D7O .row_2tcG").textContent);
                break;
            case 'April':
                data_imgurl = await page.evaluate(() => {
                    const query = document.querySelector(".imgProduct > img").getAttribute('src');
                    return `https://www.april.co.il/${query}`;
                })
                data_ftitle = '';
                data_designer = await page.evaluate(() => document.querySelector("div.collection > a").textContent);
                data_title = await page.evaluate(() => document.querySelector('div.subtitle').textContent);
                data_price = await page.evaluate(() => document.querySelector(".saleprice").textContent);
                break;
        }
        data_fprice = Number(data_price.replace(/[^0-9\.-]+/g,""));
        data_site = targetSite;
        if(req.body.palert < 0 || req.body.palert === null || req.body.palert === undefined || req.body.palert === '') {
            data_palert = data_fprice;
        } else {
            data_palert = req.body.palert;
        }

        await browser.close();  // done scraping and defining variables, move on to saving them into db

        const clothing = new clothingdb({
            url: formatted_url,
            designer: data_designer,
            title: data_title,
            site: data_site,
            imgurl: data_imgurl,
            alert: data_palert,
            price: data_price,
            fprice: data_fprice,
            lastupdate: data_date
        })
        clothing
            .save(clothing)
            .then(data => {
                res.send('<script>alert("Clothing Item successfully added."); location = "/c-index"</script>')
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occured while running a create operation"
                })
            })
    } catch(err) {
        console.log(err);
        res.status(500).send('<script>alert("An error occured trying to generate data from URL. Please make sure the link inputted is valid."); location.replace("/add-clothing")</script>')
        await browser.close();
    }
}

exports.c_find = (req, res) => {
    if(req.query.id) {
        const id = req.query.id;

        clothingdb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Clothing ID ${id} not found.` });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: `Error retrieving Clothing ID ${id}`})
        })

    } else {
        clothingdb.find()
        .then(clothing => {
            res.send(clothing)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error occured while retrieving clothing info"});
        })
    }
}

exports.c_update = (req, res) => {
    if(!req.body) {
        return res
            .status(400)
            .send( { message: "Data can not be empty" })
    }
    const id = req.params.id;
    clothingdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if(!data) {
                res.status(404).send({ message: `Clothing ID ${id} not found.`});
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Error updating clothing info' });
        })
}

exports.c_delete = (req, res) => {
    const id = req.params.id;
    clothingdb.findByIdAndDelete(id)
    .then(data => {
        if(!data) {
            res.status(404).send({ message: `Can not delete ID ${id}. Clothing not found.`})
        } else {
            res.send({ message: 'Clothing was deleted successfuly.' });
        }
    })
    .catch(err => {
        res.status(500).send({ message: `Could not delete clothing with ID ${id}` });
    })
}

exports.c_scanprices = async (req, res) => {  // manual scan button
    if (isScanning === true) {
        return res.status(429).send({ error: 'Scanning already in progress' });
    }
    const today = new Date();
    let eligible = 0;  // items with '.alert > 0' that we want to scan for price changes
  
    try {
        const clothing = await clothingdb.find();
        for (let i = 0; i < clothing.length; i++) {
            if (clothing[i].alert > 0) eligible += 1;
            const datescanned = new Date(clothing[i].lastupdate);
            const diff = today - datescanned;
            if ((diff < 3600000) && (clothing[i].alert > 0)) eligible -= 1;
        }
        if (eligible === 0) {
            return res.status(202).send({ message: 'All tracked items have already been scanned in the last 60 minutes' });
        } else {
            isScanning = true;
            console.log(`${eligible} items are being updated.`);

            const browser = await puppeteer.launch({ headless: ISHEADLESS, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36');

            for (let i = 0; i <= clothing.length; i++) {
                if (i === clothing.length) {
                    await browser.close();
                    isScanning = false;
                    console.log('Scanning finished.');
                    return res.status(200).send({ message: 'Scanning finished.' });
                }
                const datescanned = new Date(clothing[i].lastupdate);
                const diff = today - datescanned;
                if ((clothing[i].alert > 0) && (diff > 3600000)) {  // if scanned over 1h ago & alerts enabled
                    let data_price = '';
                    const url = clothing[i].url;
                    const site = clothing[i].site;
                    try {
                        await page.goto(url, { timeout: '20000' });
                            if(site == 'Factory54') data_price = await page.evaluate(() => {
                                try { return document.querySelector('.sale-price .price-inverse').textContent; }  // if on sale
                                catch(err) { return document.querySelector("div.price-info span").innerText; }
                            })
                            else if(site == 'Asos') {
                                data_price = await page.evaluate(() => document.querySelector('.a0j7k > .MwTOW').textContent);
                                data_price = data_price.replace('Now ', '');  // if its on discount, remove 'Now ' from price
                            }
                            else if(site == 'BenMenWear') data_price = await page.evaluate(() => `₪ ${document.querySelector("meta[property='product:price:amount']").getAttribute("content")}`);
                            else if(site == 'Diesel') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector(".woocommerce-variation-add-to-cart-disabled ins bdi").textContent; }
                                    catch(err) { return document.querySelector(".woocommerce-Price-amount bdi").textContent; }
                                })
                            }
                            else if(site == 'Ricco') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector("p.price ins span.woocommerce-Price-amount.amount > bdi").textContent;}
                                    catch(err) { return document.querySelector("p.price span.woocommerce-Price-amount.amount > bdi").textContent; }
                                })
                            }
                            else if(site == 'Zara') data_price = await page.evaluate(() => document.querySelector("span.price-current__amount > div > span").textContent);
                            else if(site == 'Terminal X') data_price = await page.evaluate(() => document.querySelector(".prices_3bzP .rtl_2D7O .row_2tcG").textContent);
                            else if(site == 'Jack Monsonego') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector("ins span.woocommerce-Price-amount.amount > bdi").textContent; }
                                    catch(err) { return  document.querySelector(".woocommerce-Price-amount.amount > bdi").textContent; }
                                })
                            }
                            else if(site == 'Platin') data_price = await page.evaluate(() => document.querySelector('.price-container.price-final_price.tax.weee').textContent);
                            else if(site == 'April') data_price = await page.evaluate(() => document.querySelector(".saleprice").textContent);
                            else if(site =='Craiser') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector(".price-on-sale ins .woocommerce-Price-amount.amount > bdi").textContent; }
                                    catch(err) { return document.querySelector(".price .woocommerce-Price-amount.amount").textContent; } 
                                })
                            }

                            data_fprice = Number(data_price.replace(/[^0-9\.-]+/g,""));

                            clothingdb.findByIdAndUpdate(clothing[i]._id, { price: data_price, fprice: data_fprice, lastupdate: today }, { useFindAndModify: false })
                            .then(data => {
                                if(!data) {
                                    res.status(404).send({ message: `Clothing ID ${clothing[i]._id} not found.`});
                                } else {
                                    console.log(`Successfully scanned ${clothing[i].title}`);
                                }
                            })
                            .catch(err => {
                                res.status(500).send({ message: `Error updating clothing info - ${err}` });
                            })
                        } catch(err) {
                            console.log(`ERROR (${clothing[i].title})\n${err}`);
                            isScanning = false;
                        }
                    }
                }
            }
        } catch(err) {
            res.status(500).send({ message: 'Error retrieving clothing database info' });
        }
}

exports.c_launchscan = async (req, res) => {  // Auto scans
    /* All items in database are checked for price change eligibility every 10 min per node-cron in server.js
    Eligible item (for the auto scan) is a database item with:
    1. '.alert > 0' AND last scan was over 2h ago
    2. item that failed to scan earlier due to an error and still meets criteria #1 */
    if(isScanning == true) return console.log("Scanning already in progress.");
    const today = new Date();
    let eligible = 0;
    try {
        const clothing = await clothingdb.find();
        for (let i = 0; i < clothing.length; i++) {
            if (clothing[i].alert > 0) eligible += 1;
            const datescanned = new Date(clothing[i].lastupdate);
            const diff = today - datescanned;
            if ((diff < 7200000) && (clothing[i].alert > 0)) eligible -= 1;
        }
        if(eligible == 0) console.log('[AUTO-SCAN] All tracked items have been scanned in the last 2 hours.');
        else {
            console.log(`${eligible} items are being updated.`);
            isScanning = true;
            const browser = await puppeteer.launch( { headless: ISHEADLESS, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Mobile Safari/537.36');    
            for(let i = 0; i <= clothing.length; i++) {
                if( i == clothing.length) {
                    await browser.close();
                    isScanning = false;
                    return console.log("Scanning finished.");
                }
                if(clothing[i].alert > 0) {
                    datescanned = new Date(clothing[i].lastupdate);
                    diff = today - datescanned;
                    if((clothing[i].alert > 0) && (diff > 7200000)) {  // if scanned over 2h ago & alerts enabled
                        let data_price, data_fprice = '';
                        const url = clothing[i].url;
                        const site = clothing[i].site;
                        try {
                            await page.goto(url, { timeout: '20000' });

                            if(site == 'Factory54') data_price = await page.evaluate(() => {
                                try { return document.querySelector('.sale-price .price-inverse').textContent; }  // if on sale
                                catch(err) { return document.querySelector("div.price-info span").innerText; }
                            })
                            else if(site == 'Asos') {
                                data_price = await page.evaluate(() => document.querySelector('.a0j7k > .MwTOW').textContent);
                                data_price = data_price.replace('Now ', '');  // if its on discount, remove 'Now ' from price
                            }
                            else if(site == 'BenMenWear') data_price = await page.evaluate(() => `₪ ${document.querySelector("meta[property='product:price:amount']").getAttribute("content")}`);
                            else if(site == 'Diesel') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector(".woocommerce-variation-add-to-cart-disabled ins bdi").textContent; }
                                    catch(err) { return document.querySelector(".woocommerce-Price-amount bdi").textContent; }
                                })
                            }
                            else if(site == 'Ricco') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector("p.price ins span.woocommerce-Price-amount.amount > bdi").textContent;}
                                    catch(err) { return document.querySelector("p.price span.woocommerce-Price-amount.amount > bdi").textContent; }
                                })
                            }
                            else if(site == 'Zara') data_price = await page.evaluate(() => document.querySelector("span.price-current__amount > div > span").textContent);
                            else if(site == 'Terminal X') data_price = await page.evaluate(() => document.querySelector('.prices_3bzP .rtl_2D7O .row_2tcG').textContent);
                            else if(site == 'Jack Monsonego') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector("ins span.woocommerce-Price-amount.amount > bdi").textContent; }
                                    catch(err) { return  document.querySelector(".woocommerce-Price-amount.amount > bdi").textContent;}
                                })
                            }
                            else if(site == 'Platin') data_price = await page.evaluate(() => document.querySelector('.price-container.price-final_price.tax.weee').textContent);
                            else if(site == 'April') data_price = await page.evaluate(() => document.querySelector(".saleprice").textContent);
                            else if(site =='Craiser') {
                                data_price = await page.evaluate(() => {
                                    try { return document.querySelector(".price-on-sale ins .woocommerce-Price-amount.amount > bdi").textContent; }  // Discounted price
                                    catch(err) { return document.querySelector(".price .woocommerce-Price-amount.amount").textContent; } // Full price
                                })
                            }

                            data_fprice = Number(data_price.replace(/[^0-9\.-]+/g,""));

                            clothingdb.findByIdAndUpdate(clothing[i]._id, { price: data_price, fprice: data_fprice, lastupdate: today }, { useFindAndModify: false })
                            .then(data => {
                                if(!data) {
                                    console.log(`Clothing ID ${clothing[i].title} not found`);
                                } else {
                                    console.log(`Successfully scanned ${clothing[i].title}`);
                                }
                            })
                            .catch(err => {
                                console.log(`Error scanning ${clothing[i].title} - ${err}`);
                            })
                        } catch(err) {
                            console.log(`\nERROR (${clothing[i].title})\n${err}`);
                            isScanning = false;
                        }
                    }
                }
            }
        }
    } catch(err) {
        console.log(err);
    }
}
