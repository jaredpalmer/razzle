import {
  INVALIDATE_POST
} from '../../constants';

export function invalidate() {
  return {
    type: INVALIDATE_POST,
  };
}
