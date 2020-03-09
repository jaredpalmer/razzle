import './client.css';

import { createClientConfig } from '@christophediprima/razzle-react-redux-observable-found';

import Action from './core/Action';
import State from './core/State';

import rootEpic from './core/rootEpic';
import rootReducer from './core/rootReducer';
import routes from './core/routes';

createClientConfig<State, Action>(rootEpic, rootReducer, routes);
