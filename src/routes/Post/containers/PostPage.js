import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPost, invalidate } from '../actions';
import PrimaryText from '../../../components/PrimaryText';
import Helmet from 'react-helmet';
import Post from '../components/Post';

class PostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var elem = this.refs.post;

    // Set the opacity of the element to 0
    elem.style.opacity = 0;
    window.requestAnimationFrame(function () {
      // Now set a transition on the opacity
      elem.style.transition = "opacity 250ms";

      // and set the opacity to 1
      elem.style.opacity = 1;
    });

    this.props.loadPost(this.props.params.slug);
  }

  componentWillUnmount() {
    this.props.invalidate();
  }

  render() {
    const { title, body, isLoading } = this.props;
    const helm = <Helmet
      title={`${title} | React Production Starter`}
      meta={[
          { name: "description", content: "Helmet application" },
          { property: "og:type", content: "article" },
      ]}
    />;
    return (
      <div ref='post'>
        {helm}
        {isLoading ?
          <PrimaryText>Loading...</PrimaryText> :
          <Post title={title} body={body} />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.currentPost.isLoading,
    title: state.currentPost.data.title,
    body: state.currentPost.data.body,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadPost, invalidate }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
