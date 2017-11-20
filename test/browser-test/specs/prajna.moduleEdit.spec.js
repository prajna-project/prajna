import Prajna from '../../../dist/prajna';

describe('prajna.moduleEdit', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        prajna.start();
    });

    it('should edit event on page without error', () => {
        prajna.moduleEdit('moduleName', {
            key1: 'page key1',
            key2: 'page key2'
        });
    });
});
