import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPost } from '../actions';
import PrimaryText from '../../../components/PrimaryText';
import { StyleSheet, css } from 'aphrodite';
import { layout } from '../../../constants';

class PostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadPost(this.props.params.slug);
  }

  render() {
    const { title, content, isLoading } = this.props;
    if (isLoading) {
      return <PrimaryText>Loading...</PrimaryText>;
    }

    return (
      <div>
        <PrimaryText className={css(styles.primary)}>{ title }</PrimaryText>
        <p className={css(styles.primary)}>{ content }</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.currentPost.isLoading,
    title: state.currentPost.data.title,
    content: state.currentPost.data.content,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadPost }, dispatch);
}

const styles = StyleSheet.create({
  primary: {
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontFamily: layout.serif,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
