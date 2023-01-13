# NodeJS Web Scrapping
I create this app to do web scraping on the grailed site for a personal ecommerce project

### :eyes: how to use
#### Using the command npm run automate automatically looks for the web page declared in page.goto('example.com/sneakers'
##### You can manually change the page to search and also the structure of the json file by altering the return of the item function.
##### The application automatically searches all the links in the page feed, accesses each item and takes the values of the title, designer, price, and creates an array with the images extracted from the carousel
