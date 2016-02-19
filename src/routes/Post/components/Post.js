import React, { PropTypes } from 'react';
import PrimaryText from '../../../components/PrimaryText';
import { StyleSheet, css } from 'aphrodite';
import { layout } from '../../../constants';
const Post = ({ title, body }) =>
  <div>
    <PrimaryText>{ title }</PrimaryText>
    <p className={css(styles.primary)}>{ body }</p>
  </div>;

const styles = StyleSheet.create({
  primary: {
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '1rem 0',
    fontFamily: layout.serif,
  },
});

export default Post;
