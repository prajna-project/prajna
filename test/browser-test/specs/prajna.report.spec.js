import Prajna from '../../../dist/prajna';

describe('prajna.report', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
        prajna.start();
    });

    it('should report a log without error', () => {
        prajna.report({
            level: 'ERROR',
            name: 'sample-error',
            padding: {
                key1: 'padding1',
                key2: 'padding2'
            },
            content: 'Reporting a prajna log message'
        });
    });
});
