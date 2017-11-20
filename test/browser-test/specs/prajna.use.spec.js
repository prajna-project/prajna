import Prajna from '../../../dist/prajna';

describe('prajna.use', () => {
    let prajna;
    before(() => {
        prajna = Prajna.init({
            pageId: 'test',
            channel: 'web'
        });
    });

    it('should set an middleware function without error', () => {
        prajna.use((ctx, next) => {
            console.log(ctx.senceId);
            next();
        });
    });
});
