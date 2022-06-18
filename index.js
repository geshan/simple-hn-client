const HnClient = require('./src/hnClient');
const axios = require('axios');

const keyword = process.argv[2];
(async () => {
  const hnClient = new HnClient(axios);
  console.log(`keyword: `, keyword);

  const stories = await hnClient.getLatestStories(keyword);
  console.table(stories.map(story => {
    const { title, author } = story;
    return {title, author};
  }));  
})();
