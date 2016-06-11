import { Schema, arrayOf } from 'normalizr'
export const post = new Schema('post', { idAttribute: 'slug' })
export const arrayOfPosts = arrayOf(post)
