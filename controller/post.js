const Post = require('../model/post')

exports.addPost = (req, res, next) => {
    const { title, body, pic } = req.body;
    
    console.log(pic)
    if(!title || !body || !pic){
        return res.status(401).json({error: "All field are required"});
    }
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save()
        .then(result => {
            return res.status(201).json({post: result});
        })
        .catch(err => console.log(err))
    }

exports.getAllPosts = (req, res, next) => {
    Post.find()
        .populate("postedBy", "-password")
        .populate("comments.postedBy", "_id, name")
        .sort("-createdAt")
        .then(allPosts => {
            return res.status(200).json({posts: allPosts})
        })
        .catch(err => console.log(err))
}

exports.getPostsOfFollowedUser = (req, res, next) => {
    Post.find({postedBy: {$in: req.user.following}})
        .populate("postedBy", "-password")
        .populate("comments.postedBy", "_id, name")
        .sort("-createdAt")
        .then(allPosts => {
            return res.status(200).json({posts: allPosts})
        })
        .catch(err => console.log(err))
}

exports.getMyPosts = (req, res, next) => {
    const id = req.user._id;
    Post.find({postedBy: id})
        .populate("postedBy", "_id, name, pic")
        .then(loggedInUserPost => {
            return res.status(200).json({posts: loggedInUserPost})
        })
        .catch(err => console.log(err))
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId
    Post.findOne({_id: postId})
        .populate("postedBy", "_id")
        .exec((err, post) => {

            if(err || !post){
                return res.status(422).json({error: err})
            }
            if(post.postedBy._id.toString() == req.user._id.toString()){
                post.remove()
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => console.log(err))
            }
        })
}

exports.likePost = (req, res ) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes : req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
}

exports.unLikePost = (req, res ) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes : req.user._id}
    }, {
        new: true
    })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id, name")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
}

exports.postComment = (req, res ) => {
    const comment = {
        postedBy : req.user._id,
        text: req.body.text
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            comments: comment
        }
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name pic")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
}

exports.deleteComment = (req, res, next) => {
    Post.findById(req.params.postId)
    .populate("postedBy", "-password")
    .populate("comments.postedBy", "_id, name")
        .then(post => {
            console.log(post)
            const comment = post.comments.find(comment => comment._id == req.params.commentId)
            console.log(comment)
            // check user 
            if(comment.postedBy._id.toString() !== req.user._id.toString()){
                return res.status(404).json({msg: 'user not authorized'});
            }
            
            const commentIndex = post.comments.findIndex(comment => comment.postedBy.toString() == req.user._id.toString())
            
            post.comments.splice(commentIndex, 1)
            post.save()
                .then(() => {
                    res.json(post)
                })
        })
        .catch(err => console.log(err))
}