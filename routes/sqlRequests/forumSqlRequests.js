const sqlRequestForumCategoriesRoute= "SELECT * FROM forumCategories";

exports.sqlRequestForumCategoriesRoute=sqlRequestForumCategoriesRoute;

const sqlRequestForumCategoriesTopicsRoute= `SELECT * FROM forumTopics
                                                WHERE categoryId=?`;
exports.sqlRequestForumCategoriesTopicsRoute=sqlRequestForumCategoriesTopicsRoute;

const sqlRequestPostsDisplayRoute= `SELECT * FROM forumPosts
                                    INNER JOIN forumTopics ON forumPosts.topicId
                                    INNER JOIN (SELECT userName, userId FROM usersProfils) usersProfils ON forumPosts.userId
                                    WHERE forumPosts.topicId=?
                                    AND forumTopics.topicId=forumPosts.topicId AND forumPosts.userId=usersProfils.userId`;
exports.sqlRequestPostsDisplayRoute=sqlRequestPostsDisplayRoute;

const sqlRequestNewTopicRoute=` INSERT INTO forumTopics(
                                        categoryId,
                                        userId,
                                        topicTitle,
                                        topicCreationDate
                                    )
                                VALUES (?,?,?,NOW());`;
exports.sqlRequestNewTopicRoute=sqlRequestNewTopicRoute;

const sqlRequestNewTopicRouteFirstPost=`INSERT INTO forumPosts(
                                                topicId,
                                                userId,
                                                postContent,
                                                postCreationDate
                                            )
                                        VALUES(?,?,?,NOW());`;
exports.sqlRequestNewTopicRouteFirstPost=sqlRequestNewTopicRouteFirstPost;

const sqlRequestNewTopicRouteFirstPostWithImage=`INSERT INTO forumPosts(
                                                    topicId,
                                                    userId,
                                                    postContent,
                                                    imagePath,
                                                    postCreationDate
                                                )
                                                VALUES(?,?,?,?,NOW());`;
exports.sqlRequestNewTopicRouteFirstPostWithImage=sqlRequestNewTopicRouteFirstPostWithImage;

const sqlRequestNewPostRoute=`  INSERT INTO forumPosts(
                                        topicId,
                                        userId,
                                        postContent,
                                        postCreationDate
                                    )
                                VALUES(?,?,?,NOW())`;
exports.sqlRequestNewPostRoute=sqlRequestNewPostRoute;

const sqlRequestNewPostRouteWithImage=`  INSERT INTO forumPosts(
                                            topicId,
                                            userId,
                                            postContent,
                                            imagePath,
                                            postCreationDate
                                        )
                                        VALUES(?,?,?,?,NOW())`;
exports.sqlRequestNewPostRouteWithImage=sqlRequestNewPostRouteWithImage;
