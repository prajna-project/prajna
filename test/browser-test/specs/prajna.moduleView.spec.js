import Prajna from '../../../dist/prajna';

describe('prajna.moduleView', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'unit-test',
            channel: 'web'
        });
        prajna.start();
    });

    it('should report a module view log without error', () => {
        prajna.moduleView('moduleName', {
            key1: 'padding1',
            key2: 'padding2'
        });
    });
});
