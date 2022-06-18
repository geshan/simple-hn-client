module.exports = class HnClient {
  constructor(axios) {
    axios.defaults.baseURL = 'https://hn.algolia.com/api/v1';
    this.axios = axios;
  }

  async getLatestStories(keyword = '') {
    try {
      const response = await this.axios.get(`/search_by_date?query=${keyword}&tags=story`);
      return response.data?.hits || [];
    } catch(e) {
      console.log(`Error while getting stories ${e.message}`, e);
      return [];
    }    
  }
}
