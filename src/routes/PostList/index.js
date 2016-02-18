import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPosts } from './actions';
import PostListItem from './components/PostListItem';
import { StyleSheet, css } from 'aphrodite';

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadPosts();
  }

  render() {
    const { posts } = this.props;
    return (
      <div>
        <h2 className={css(styles.blue)}>PostListPage</h2>
        {posts.map((post, i) => <PostListItem key={post.id} post={post} />)}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    posts: state.posts.data,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadPosts }, dispatch);
}

const styles = StyleSheet.create({
  blue: {
    color: "blue",
    ':hover': {
      color: 'red',
    },
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PostListPage);
