const {forwardTo} = require('prisma-binding')
const {
  signup, login,
  updatePassword,
  forgetPassword,
  resetPassword,
  validateEmail,
  sendLinkValidateEmail
} = require('./auth')
const { getUserId } = require('../utils')

async function publish (parent, { id }, ctx, info) {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { isPublished: true }
    },
    info
  )
}

async function deleteUser (parent, { id }, ctx, info) {
  const userId = getUserId(ctx)
  const userExists = await ctx.db.exists.User({
    id
  })
  const requestingUserIsAdmin = await ctx.db.exists.User({
    id: userId,
    role: 'ADMIN'
  })

  if (!userExists && !requestingUserIsAdmin) {
    throw new Error(`Post not found or you don't have access rights to delete it.`)
  }

  return ctx.db.mutation.deleteUser({ where: { id } })
}

async function deleteCar (parent, args, ctx, info) {
  console.log('****ISSUE*****')
  const userId = getUserId(ctx)
  const user = await ctx.db.query.user({ where: { id: userId } })
  console.log('user', user)

  const requestingUserIsAdmin = await ctx.db.exists.User({
    id: userId,
    role: 'CUSTOMER'
  })
  console.log('requestingUserIsAdmin', requestingUserIsAdmin)

  const carExists = await ctx.db.exists.Car({
    id: args.id
  })

  if (!carExists && !requestingUserIsAdmin) {
    throw new Error(`Car not found or you don't have access rights to delete it.`)
  }
  return forwardTo('db')(parent, args, ctx, info)
  // return ctx.db.mutation.deleteCar({ where: { id } })
}

async function createPost (parent, args, ctx, info) {
  const userId = getUserId(ctx)
  args.data.isPublished = false
  args.data.author = {
    connect: {
      id: userId
    }
  }
  return forwardTo('db')(parent, args, ctx, info)
}


async function createWishlist (parent, args, ctx, info) {
  const userId = getUserId(ctx) // requires auth
  if (userId !== args.userId) throw new Error("Provided userId is not equal to your profile id")

  const userExists = await ctx.db.exists.User({
    id: args.userId
  })
  
  const courseExists = await ctx.db.exists.Post({
    id: args.courseId
  })
  
  if (!userExists) throw new Error("User cannot be found with this id")
  if (!courseExists) throw new Error("Course cannot be found with this id")

  return ctx.db.mutation.createWishlist(
      {
        data: {
          courseId: { connect: { id: args.courseId } },
          userId: { connect: { id:  args.userId } }
        }
      },
    info
  )
}

async function deleteWishlist (parent, args, ctx, info) {
  const userId = getUserId(ctx)
  if (userId !== args.userId) throw new Error("Provided userId is not equal to your profile id")

  const userExists = await ctx.db.exists.User({
    id: args.userId
  })
  
  const courseExists = await ctx.db.exists.Post({
    id: args.courseId
  })
  
  if (!userExists) throw new Error("User cannot be found with this id")
  if (!courseExists) throw new Error("Course cannot be found with this id")

  return ctx.db.mutation.deleteWishlist({ where: { id: args.id } })
}


async function createCourselist (parent, args, ctx, info) {
  const userId = getUserId(ctx) // requires auth
  if (userId !== args.userId) throw new Error("Provided user id is not equal to your profile id")

  const userExists = await ctx.db.exists.User({
    id: args.userId
  })
  
  const courseExists = await ctx.db.exists.Post({
    id: args.courseId
  })
  
  if (!userExists) throw new Error("User cannot be found with this id")
  if (!courseExists) throw new Error("Course cannot be found with this id")

  return ctx.db.mutation.createCourselist(
      {
        data: {
          courseId: { connect: { id: args.courseId } },
          userId: { connect: { id:  args.userId } }
        }
      },
    info
  );
}

async function deleteChapter (parent, args, ctx, info) {
  return ctx.db.mutation.deleteChapter({ where: { id: args.id } })
}


async function createChapter (parent, args, ctx, info) {
  // TODO: check if user is admin and is owner of the course

  return ctx.db.mutation.createChapter(
    {
      data: {
        courseBy: { connect: { id: args.courseBy } },
        name: args.name,
        files: args.files
      },
    },
    info,
  )
}



async function createChapterDescription (parent, args, ctx, info) { 
  // check if user is author of this course
  // check if chapter does not exists
  const chapterExists = await ctx.db.exists.Chapter({
    id: args.chapterId
  })

  if (!chapterExists) throw new Error("Chapter cannot be found")

  return ctx.db.mutation.createChapterDescription({
    data: {
      chapterId: { connect: { id: args.chapterId } },
      title: args.title,
      text: args.text
    }
  },
  info)
}

async function createChapterFile (parent, args, ctx, info) {
  const chapterExists = await ctx.db.exists.Chapter({
    id: args.chapterId
  })

  if (!chapterExists) throw new Error("Chapter cannot be found")

  return ctx.db.mutation.createChapterFile({
    data: {
      chapterId: { connect: { id: args.chapterId } },
      title: args.title,
      src: args.src
    }
  },
  info)
}

async function deleteChapterDescription (parent, args, ctx, info) {
  // check if user is author 
  return ctx.db.mutation.deleteChapterDescription({ 
    where: { id: args.id } 
  });
}


async function createChat (parent, args, ctx, info) {
  const userId = getUserId(ctx)
  args.data.author = {
    connect: {
      id: userId
    }
  }
  return forwardTo('db')(parent, args, ctx, info)
}


async function deletePost (parent, { id }, ctx, info) {
  const userId = getUserId(ctx)
  const postExists = await ctx.db.exists.Post({
    id,
    author: { id: userId }
  })

  const requestingUserIsAdmin = await ctx.db.exists.User({
    id: userId,
    role: 'ADMIN'
  })

  if (!postExists && !requestingUserIsAdmin) {
    throw new Error(`Post not found or you don't have access rights to delete it.`)
  }

  return ctx.db.mutation.deletePost({ where: { id } })
}

const Mutation = {
  signup,
  resetPassword,
  validateEmail,
  login,
  updatePassword,
  forgetPassword,
  deletePost,
  deleteUser,
  deleteChapter,
  sendLinkValidateEmail,
  updateUser: (parent, args, ctx, info) => {
    // getUserId(ctx)
    return forwardTo('db')(parent, args, ctx, info)
  },
  publish,
  createCar: forwardTo('db'),
  createUser: forwardTo('db'),
  createChat,
  deleteCar: deleteCar,
  updateCar: forwardTo('db'),
  createPost,
  createWishlist,
  deleteWishlist,
  createCourselist,
  createChapter,
  createChapterDescription,
  deleteChapterDescription,
  createChapterFile
}

module.exports = {
  Mutation
}
