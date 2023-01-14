import puppeteer from "puppeteer";
import fs from 'fs-extra'
import mongoose from 'mongoose'
import Item from "./models/Item.js";

(async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect('mongodb://localhost:27017/grailed-scraped:')

  mongoose.connection.on('connected', () => {
    console.log('mongodb is running')
  })
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://www.grailed.com/designers/example-designer/low-top-sneakers', {waitUntil: 'networkidle2'});
    
    const links = await page.evaluate(() => {
        const feedLinks = Array.from(document.querySelectorAll('a[class="listing-item-link"]'));
        return feedLinks.map(link => link.href);
      });
      //nike, adidas, bape, converse, reebok, new-balance, vans, puma
      const data = [];
      for (const link of links) {
        await page.goto(link);
        const item = await page.evaluate(() => {
            const p = document.querySelector('p[class="Headline_headline__1FUq_ Text Details_designers__2APa_"]');
            const h1 = document.querySelector('h1[class="Body_body__H3fQQ Text Details_title__2ZfSA"]');
            const availableSizes = document.querySelector('span[class="Details_value__2rDQU"]');
            const price = document.querySelector('span[class="Money_root__2p4sA"]')
            const images = Array.from(document.querySelectorAll('.Photo_picture__2msaI'));
            const imagesSrc = images.map(img => img.src);
            
            //Generates an array with a random number of available sizes and then fills each size with another random number
            const numElements = Math.floor(Math.random() * (9 - 3 + 1) + 3);
            const sizes = Array.from({ length: numElements }, () => {
              // Create a set to store the generated numbers
              const set = new Set();
              // Generate a random number between 7 and 14 I generate a random number for shoe sizes  since in grailed, in general each shoe has only one size available
              let randomNumber = Math.floor(Math.random() * (7 - 14 + 1) + 14);
              set.add(randomNumber);
              return randomNumber;
          });
          return {
            title: p ? p.innerText : null,
            designer: 'puma',
            category: 'low-top',
            gender: 'women',
            sizes: sizes ? sizes : null,
            body: h1 ? h1.innerText : null,
            availableSizes: availableSizes ? availableSizes.innerHTML: null,
            price: price ? price.innerHTML: null,
            imagesSrc
          };
        });
        console.log(item)
          
        //Save each item in a document in mongodb, and then save it to a json file locally
        const newItem = new Item(item)
        await newItem.save()
      }
    
      const dataJson = JSON.stringify(data);
      fs.writeFileSync('data.json', dataJson);
      
      console.log(`Data saved to data.json`);
    
      await browser.close();
})();
