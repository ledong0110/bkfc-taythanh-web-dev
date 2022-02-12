const Post = require('../models/Post');
const Post_special_list = require('../models/Post-special-list');
const multer = require('multer');
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../utility/mongoose');
const { convertRole, getRandom } = require('../../utility/support');

class PostController {
    post_default(res, req, next){
        let currentTime = new Date();
        Post_special_list
            .findOne({name: "popular"})
            .then(popList => {
                if ((currentTime.getDate() - popList.updatedAt.getDate()) >= 1){
                    console.log("Updating pop list");
                    Post
                        .find({
                            createdAt: {"$gte": currentTime.setDate(currentTime.getDate()-30)}
                        })
                        .limit(6)
                        .sort({views: -1})
                        .then(postList => {
                            // console.log("List of post to update:");
                            // console.log(postList);
                            for(let i = postList.length-1; i>=0 ; i--){
                                popList.posts_checked_load.unshift(postList[i]._id);
                                popList.posts_checked[postList[i]._id.toString()] = "1";
                            }

                            // console.log("After push in:");
                            // console.log(popList.posts_checked_load);

                            while (popList.posts_checked_load.length > 4){
                                delete popList.posts_checked[popList.posts_checked_load[4]];
                                popList.posts_checked_load.pop();
                            }

                            // console.log("After delete:");
                            // console.log(popList.posts_checked_load);

                            popList.save();
                        })
                }
            })

        next();
    }

    post_home(req, res, next) {
        Post_special_list.find()
            .sort({ name: -1 })
            .populate({
                path: 'posts_checked_load',
                options: {
                    sort: { createdAt: -1 },
                },
            })
            .then((post_list_arr) => {
                // console.log('rendering post page...');
                var breaking_post = [];
                for (let singleList in post_list_arr){
                    if (post_list_arr[singleList].name == "hot"){
                        let numPost = post_list_arr[singleList].posts_checked_load.length;
                        for (let i = 0; i < numPost; i++) {
                            breaking_post.push(
                                mongooseToObject(
                                    post_list_arr[singleList].posts_checked_load[i],
                                ),
                            );
                        }
                        break;
                    }
                }
                // console.log(breaking_post);
                res.render('posts/post', {
                    all_list: multipleMongooseToObject(post_list_arr),
                    breaking_post: breaking_post,
                });
            });
    }

    all_post(req, res, next) {
        Promise.all([
            Post.find({})
                .select({ _id: 0, content: 0, updatedAt: 0, deleted: 0 })
                .populate('author', 'name')
                .sort({ createdAt: -1 })
                .limit(10),
            Post_special_list.find()
                .sort({ name: -1 })
                .populate({
                    path: 'posts_checked_load',
                    options: {
                        sort: { createdAt: -1 },
                        populate: {
                            path: 'author',
                            select: {_id: 0, name: 1}
                        }
                    },
                    select: { _id: 0, content: 0, views: 0, updatedAt: 0, deleted: 0 },
                })
        ])
            .then(([posts, post_list_arr]) => {
                var breaking_post = [];
                for (let singleList in post_list_arr){
                    if (post_list_arr[singleList].name == "hot"){
                        let numPost = post_list_arr[singleList].posts_checked_load.length;
                        for (let i = 0; i < numPost; i++) {
                            breaking_post.push(
                                mongooseToObject(
                                    post_list_arr[singleList].posts_checked_load[i],
                                ),
                            );
                        }
                        break;
                    }
                }
                posts = multipleMongooseToObject(posts);
                res.render('posts/post-all',{
                    hot: breaking_post,
                    phobien: posts.concat().sort((a, b) => Number(b.views) - Number(a.views)).slice(0,5),
                    quantam: posts.concat().sort((a, b) => Number(b.views) - Number(a.views)).slice(0,5),
                    tuyensinh: posts.slice(0, 5),
                    moinhat: posts.slice(0, 5),
                    latestNews: getRandom(posts, 5),
                    viral_video: 1,
                    breaking_post,
                });
        })
    }

    create(req, res, next) {
        console.log('In get create');
        res.render('posts/post-create');
    }

    create_post(req, res, next) {
        console.log('Post submited');
        req.body.content = JSON.parse(req.body.content);
        console.log(req.body);

        let newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image_url: req.body.image_url,
            author: req.app.locals.user._id,
        });

        if (newPost) {
            console.log(newPost);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }
        newPost
            .save()
            .then((result) => {
                console.log('Success uploading');
                res.send('Done');
            })
            .catch((err) => {
                console.log('Failed to upload post:', err);
                res.send('Failed');
            });

        // console.log(Object.values(req.body.title));
        // console.log(Object.values(req.body.content));
    }

    //[GET] /post/show
    show(req, res, next) {
        Post.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } })
            .populate('author', 'name')
            .then((post) => {
                if (post) {
                    post = mongooseToObject(post);

                    Post_special_list.find()
                        .sort({ name: -1 })
                        .populate({
                            path: 'posts_checked_load',
                            options: {
                                sort: { createdAt: -1 },
                            },
                        })
                        .then((post_list_arr) => {
                            var breaking_post = [];
                            for (let i = 0; i < 3; i++) {
                                if (
                                    post_list_arr[0].posts_checked_load[i] !=
                                    undefined
                                ) {
                                    breaking_post.push(
                                        mongooseToObject(
                                            post_list_arr[0].posts_checked_load[
                                                i
                                            ],
                                        ),
                                    );
                                }
                            }
                            // post.createdAt = post.createdAt.toLocaleDateString('vi-Vi', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                            // console.log(breaking_post);
                            res.render('posts/show', {
                                post: post,
                                all_list:
                                    multipleMongooseToObject(post_list_arr),
                                breaking_post: breaking_post,
                            });
                        });
                } else {
                    res.status(404);
                    res.render('notFound');
                }
            })
            .catch(next);
    }

    post_edit(req, res, next) {
        console.log('in edit page');
        const postSlug = req.params.slug;
        Post.findOneWithDeleted({ slug: postSlug })
            .then((foundPost) => {
                console.log('Found post');
                var returnPost = mongooseToObject(foundPost);
                returnPost['content_json'] = returnPost.content;
                res.render('posts/post-edit', { post: returnPost });
            })
            .catch((err) => {
                console.log('Can not find post:');
                console.log(err);
                res.send('Some error occured, please try again');
            });
    }

    post_edit_save(req, res, next) {
        console.log('updating post...');
        req.body.content = JSON.parse(req.body.content);

        let newQuery = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            image_url: req.body.image_url,
        };

        if (newQuery) {
            console.log(newQuery);
            // newBlog.body = newBlog.body.replace(/\r\n/g, "\n");
        }

        Post.findOneAndUpdateWithDeleted({ slug: req.body.slug }, newQuery)
            .then((result) => {
                console.log('Success updating post');
                console.log(result);
                res.send('Done');
            })
            .catch((err) => {
                console.log('Failed to update post:', err);
                res.send('Failed');
            });
    }

    post_delete(req, res, next) {
        console.log('In delete post');
        var postSlug = req.body.slug;
        console.log(req.body);
        console.log('Deleting post...');

        Post.findOne({ slug: postSlug })
            .then((result) => {
                result
                    .delete()
                    .then((result_2) => {
                        console.log('Deleted post');
                        res.append('Signal', 1);
                        res.send('Done');
                    })
                    .catch((err) => {
                        console.log(err);
                        res.append('Signal', 0);
                        res.send('Failed');
                    });
            })
            .catch((err) => {
                console.log(err);
                res.append('Signal', 0);
                res.send('Failed');
            });
    }

    //[PATCH] /post/:id/restore
    post_restore(req, res, next) {
        Post.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[GET] /post/my-post
    my_post(req, res, next) {
        Promise.all([
            Post.find({ author: req.app.locals.user._id }).sort({
                createdAt: -1,
            }),
            Post.countDocumentsDeleted({ author: req.app.locals.user._id }),
        ]).then(([result, deletedPost]) => {
            // console.log(deletedPost);
            // res.send(result);
            res.render('posts/my-post', {
                my_post: multipleMongooseToObject(result),
                deletedPost,
            });
        });
    }

    //[GET] /post/my-post-bin
    my_post_bin(req, res, next) {
        Post.findDeleted({ author: req.app.locals.user._id })
            .then((posts) =>
                res.render('posts/my-post-bin', {
                    deletedPosts: multipleMongooseToObject(posts),
                }),
            )
            .catch(next);
    }

    //[DELETE] /post/force-delete
    post_force_delete(req, res, next) {
        var pid = req.body.id;
        Post.deleteOne({ _id: pid })
            .then(() => {
                res.append('Signal', 1);
                res.send('Done');
            })
            .catch((err) => {
                console.log(err);
                res.append('Signal', 0);
                res.send('Failed');
            });
    }

    //[POST] /post/all/loadmore
    post_loadmore(req, res, next) {
        var limit = 3;
        var startFrom = parseInt(req.body.startFrom);
        Post.find({})
                .select({ _id: 0, content: 0, updatedAt: 0, deleted: 0 })
                .populate('author', 'name')
                .sort({ createdAt: -1 })
                .skip(startFrom)
                .limit(limit)
                .then((posts) => {
                    res.json(multipleMongooseToObject(posts));
                })
    }
}

module.exports = new PostController();
