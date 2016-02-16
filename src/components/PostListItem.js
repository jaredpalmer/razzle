import React, { PropTypes } from 'react';
import { Link } from 'react-router';
const PostListItem = ({ post }) =>
  <div><Link to={`/post/${post.slug}`}>{post.title}</Link></div>;

export default PostListItem;
