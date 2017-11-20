import Prajna from '../../../dist/prajna';

describe('prajna.moduleClick', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        prajna.start();
    });

    it('should report a module click log without error', () => {
        prajna.moduleClick('moduleName', {
            key1: 'padding1',
            key2: 'padding2'
        });
    });
});
