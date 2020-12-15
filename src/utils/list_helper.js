import lodash from 'lodash'

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(e => e.likes)
  const blog = blogs[likes.indexOf(Math.max(...likes))]

  return blog
}

const mostBlogsAuthor = (blogs) => {
  const authorWithBlogNumber = lodash.countBy(blogs, 'author')
  const maxValue = Math.max(...Object.values(authorWithBlogNumber))
  const maxIndex = Object.keys(authorWithBlogNumber).find(key => authorWithBlogNumber[key] === maxValue)

  return {
    "author": maxIndex,
    "blogs": maxValue
  }
}

export default {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogsAuthor
}
