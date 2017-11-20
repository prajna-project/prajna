import Prajna from '../../../dist/prajna';

describe('prajna.pageView', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        prajna.start();
    });

    it('should set page view messages without error', () => {
        prajna.pageView({
            key1: 'page key1',
            key2: 'page key2'
        });
    });
});
