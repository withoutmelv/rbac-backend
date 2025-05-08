
import Router from '@koa/router';
import postController from '../controllers/post.controller';

const postRouter = new Router({ prefix: '/sys/post' });

postRouter.post('/save', postController.save);
postRouter.post('/update', postController.update);
postRouter.post('/remove', postController.remove);
postRouter.post('/detail', postController.detail);
postRouter.post('/page', postController.page);


export default postRouter;