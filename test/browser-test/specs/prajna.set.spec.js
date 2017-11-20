import Prajna from '../../../dist/prajna';

describe('prajna.set', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
    });

    it('should set prajna new options without error', () => {
        prajna.set({
            pageId: 'test1',
            channel: 'browser'
        });
    });
});
