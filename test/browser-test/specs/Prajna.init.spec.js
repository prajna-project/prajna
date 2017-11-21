import Prajna from '../../../dist/prajna';

describe('Prajna.init', () => {
    it('should init Prajna without error', () => {
        Prajna.init({
            pageId: 'unit-test',
            channel: 'web'
        });
    });
});
