import { unstable_createRoot } from 'react-dom';
import Root from './Root.client';

const initialCache = new Map();
const root = unstable_createRoot(document.getElementById('root'));
root.render(<Root initialCache={initialCache} />);
