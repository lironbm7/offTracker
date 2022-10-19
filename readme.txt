This version of offTracker offers Limited Code with Read Only database permissions, excluding JavaScript scraping methods and CRUD operations.
* The whole scraping process is seperately executed in a standalone server.
Source Code is limited due to:
1. Respecting websites' Privacy / Terms & Conditions and not publicly sharing crawler / scraping code that targets their website data.
2. Read Only access to my personal real-time Clothing/Frag database, to showcase the capabilities of offTracker without requiring the user to create a database just to see the program's functionality.

Contact me on Linkedin/lironbiam for more information :)

##-- CHANGELOG --##

v1.16
Ability to determine whether web scraper is active or not
	if active, do not allow a parallel scanning activity besides for ADD NEW ITEM which doesnt overload the target server
Modified ASOS selectors for better accuracy with discounts and price formatting 
Red icon only shows on items that werent scanned in 24 Hours, rather than comparing date, which is invalid at 00:01 or similar.
Added manual scan success log message

v1.15
Added MANUAL scan ability every 1h, AUTO SCANS now re-scan items that have been scanned over 4h ago, and are alert > 0.
	Node-cron still checks everything every 10 min in case an item's scan failed due to an error.
Added last scanned data to icon on-hover of each item
EJS calculations and display of no. Total items & no. Tracked items on c-index f-index
Minor CSS changes to properly implement the counter features

v1.14
Server sided changes
> Bypassed Asos' authenthication (Access Denied error when accessed from headless browser)
	assigned an Agent to the headless browser therefore caused a fake identification that works
Client sided changes
> JavaScript for Form Submit buttons to turn grey and inform user that data is being generated
> JS for Manual Scan button to show an animation when scanning items
> Added an item counter to the bottom of the c-index f-index pages (shows total of items in db)

v1.13
Added 'Zara' target website
Took Factory54's Mobile website layout into consideration as querySelectors vary between desktop and mobile
 sometimes when used headless / small browser, pics loaded in diff xpath/selector ids, fixed this

v1.11 - v1.12
Emphasis on the program being dynamic and flexible between localhost and the hosted versions.
Altering between the two by modifying the config.env file's SERVERURL
And the buttons.js file's SERVERURL variable for client-sided URL orientation.
controller.js is now smarter and knows when it needs to be headless and when not to be.

v1.1
Large update including:
 > Deployed the client-sided version to Heroku, limited the code for client-side purposes 
 > Database changes - Client Side uses a Guest-privileged MongoDB User while Server Side uses an Atlas Admin User
 > CSS changes for better mobile support (used an iPhone 12 & 13 Pro Max, iPad for live testing)
 > Minor fixes such as 'Ricco' not being listed in c-form
 > JS replacements for client-side to notify about access restrictions and inability to modify database.

v1.0.7 
Added mobile-support (different resolutions change the grid layout and scale everything)

v1.0.6
Added Ricco.co.il and Diesel.co.il with two different price scrape paths
	When discounted, the price path is diff from the full priced path. Taken into consideration.

v1.0.5
BenMenWear's querySelector for price was constantly changing due to web changes, bypassed this
Readable code revisions, used ES6 Arrow Functions to shorten the code and make it look cleaner
Changed the scraping method, instead of reopening a new automated window for every item, 
	we use the same window and redirect to the next scanned item's URL and close window
	at the end of the loop.

v1.0.4
Seperated the functions function of start-up scans and manual scans to differ the outputs
Added BenMenWear scan parameters (only had create params)

v1.0.3 
Added BenMenWear.com
Various CSS changes fixed button hover titles of update & delete

v1.0.2
Sorted items and frags by recently added in descending order
Fixed ASOS item SCANNING (not creating), didn't RETURN scraped data before 1.0.2 update.

v1.0.1 Added 'untracked' item section and modified auto/manual scans to address it

v1.0.0 project fully functional
