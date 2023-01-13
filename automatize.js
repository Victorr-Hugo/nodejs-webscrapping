import puppeteer from "puppeteer";
import fs from 'fs-extra'

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('example.com/sneakers', {waitUntil: 'networkidle2'});
    
    const links = await page.evaluate(() => {
        const feedLinks = Array.from(document.querySelectorAll('a[class="listing-item-link"]'));
        return feedLinks.map(link => link.href);
      });
    
      const data = [];
      console.log(links.length)
      for (const link of links) {
        await page.goto(link);
        const item = await page.evaluate(() => {
            const p = document.querySelector('p[class="Headline_headline__1FUq_ Text Details_designers__2APa_"]');
            const h1 = document.querySelector('h1[class="Body_body__H3fQQ Text Details_title__2ZfSA"]');
            const availableSizes = document.querySelector('span[class="Details_value__2rDQU"]');
            const price = document.querySelector('span[class="Money_root__2p4sA"]')
            const images = Array.from(document.querySelectorAll('.Photo_picture__2msaI'));
            const imagesSrc = images.map(img => img.src);

          return {
            title: p ? p.innerText : null,
            category: 'category-example',
            body: h1 ? h1.innerText : null,
            availableSizes: availableSizes ? availableSizes.innerHTML: null,
            price: price ? price.innerHTML: null,
            imagesSrc
          };
        });
        data.push(item);
        console.log(data)
      }
    
      const dataJson = JSON.stringify(data);
      fs.writeFileSync('example.json', dataJson);
      
      console.log(`Data saved to data.json`);
    
      await browser.close();
})();

