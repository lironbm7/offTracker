This version of offTracker is a Client version with only Guest permissions / authorization.
Therefore, users under this repo are only authorized to access and read from the database and not write changes to it.
* The whole scraping process is seperately executed in another server which includes a back-end for scraping and CRUD functionalities.

The reasons behind creating a Guest (viewer) version of offTracker:
> Respecting companies' / websites' Terms & Conditions and not using web scrapers / crawlers for commercial / non-private use.
(The only way to create new items and track them is by hosting the program independently and creating a seperate MongoDB Cluster/database and writing data to it, modifying controller.js to target specific website elements for scraping)

> Showcasing the capabilities of offTracker without requiring a user to create a database and modify it, by revealing the database I (the program writer) personally use on a daily basis.
(Users can see database changes in real-time but are unable to create/delete/modify elements, but only read/view them)
