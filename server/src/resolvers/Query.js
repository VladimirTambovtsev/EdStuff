const {forwardTo} = require('prisma-binding')
const {getUserId} = require('../utils')
const {me} = require('./auth')

async function feed(parent, args, ctx, info) {
  return ctx.db.query.posts({
    where: {
      isPublished: true
    }
  }, info)
}
async function drafts(parent, args, ctx, info) {

  const id = getUserId(ctx)
  const where = {
    isPublished: false,
    author: {
      id
    }
  }

  return ctx.db.query.posts({
    where
  }, info)
}


async function post (parent, {id}, ctx, info) {
  const userId = getUserId(ctx)
  const requestingUserIsAuthor = await ctx.db.exists.Post({
    id,
    author: {
      id: userId
    }
  })
  const requestingUserIsAdmin = await ctx.db.exists.User({id: userId, role: 'ADMIN'})
  if (requestingUserIsAdmin || requestingUserIsAuthor) {
    return ctx.db.query.post({
      where: {
        id
      }
    }, info)
  }
  throw new Error('Invalid permissions, you must be an admin or the author of this post to retrieve it.',)
}


async function wishlist (parent, { userId }, ctx, info) {
  const userExists = await ctx.db.exists.User({
    id: userId
  })
  if (!userExists) {
    throw new Error("User cannot be found with this id")
  }

  return ctx.db.query.wishlists({
    where: {
      userId: {
        id: userId
      }
    }
  }, info)

}

async function courselist (parent, { userId }, ctx, info) {

  const userExists = await ctx.db.exists.User({
    id: userId
  })
  if (!userExists) {
    throw new Error("User cannot be found with this id")
  }

  return ctx.db.query.courselists({
    where: {
      userId: {
        id: userId
      }
    }
  }, info)
}

async function chapters (parent, args, ctx, info) {
  return ctx.db.query.chapters();
}

async function chapter (parent, {id}, ctx, info) {
  return ctx.db.query.chapter({
    where: {
        id
    }
  }, 
  info)
}

const Query = {
  me,
  user: (parent, args, ctx, info) => {
    // getUserId(ctx)
    return forwardTo('db')(parent, args, ctx, info)
  },
  feed,
  drafts,
  post,
  wishlist,
  courselist,
  chapters,
  chapter,
  // cars: forwardTo('db'),
  chatsConnection: forwardTo('db'),
  car: forwardTo('db'),
  carsConnection: (parent, args, ctx, info) => {
    getUserId(ctx)
    return forwardTo('db')(parent, args, ctx, info)
  },
  usersConnection: (parent, args, ctx, info) => {
    getUserId(ctx)
    return forwardTo('db')(parent, args, ctx, info)
  }
}

module.exports = {
  Query
}
