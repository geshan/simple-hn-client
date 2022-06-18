const HnClient = require('../src/hnClient');
const log = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('HnClient', () => {
  let axiosMock = {
    defaults: {},
    get: jest.fn(),
  };
  let hnClient;

  beforeEach(() => {
    hnClient = new HnClient(axiosMock);
  });

  describe('getLatestStories', () => {
    it('should return an array of stories for given keyword', async () => {
      const returnedStories = [
        {
          created_at: '2022-06-17T13:47:57.000Z',
          title: 'Qwik and Partytown: How to remove 99% of JavaScript from main thread',
          url: 'https://www.youtube.com/watch?v=0dC11DMR3fU',
          author: 'barisx',         
        },
        {
          created_at: '2022-06-17T09:59:00.000Z',
          title: 'Prepack – A tool for making JavaScript code run faster',
          url: 'https://prepack.io/',
          author: 'longrod',         
        },      
      ];
      axiosMock.get = jest.fn().mockResolvedValueOnce({ data: { hits: returnedStories } });

      const stories = await hnClient.getLatestStories('javascript');

      expect(axiosMock.defaults.baseURL).toBe('https://hn.algolia.com/api/v1');
      expect(axiosMock.get).toHaveBeenCalledWith('/search_by_date?query=javascript&tags=story');
      expect(stories).toBeInstanceOf(Array);
      expect(stories.length).toBe(2);
      expect(stories[0]).toHaveProperty('title');
      expect(stories[0].title).toBe('Qwik and Partytown: How to remove 99% of JavaScript from main thread');
      expect(stories[1]).toHaveProperty('url');
      expect(stories[1].url).toBe('https://prepack.io/');
    });

    it('should return an empty array if no stories are found', async () => {
      axiosMock.get = jest.fn().mockResolvedValueOnce({});

      const stories = await hnClient.getLatestStories();

      expect(stories).toBeInstanceOf(Array);
      expect(stories.length).toBe(0);
    });

    it('should handle any error and return empty stories array', async () => {
      axiosMock.get = jest.fn().mockRejectedValueOnce(new Error('server down'));

      const stories = await hnClient.getLatestStories('python');
      expect(log).toHaveBeenCalledWith(expect.stringContaining('server down'), expect.anything());
      expect(stories).toBeInstanceOf(Array);
      expect(stories.length).toBe(0);
    });
  });
});
