import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from './store/configureStore';
import Root from './containers/Root';

import ServiceWorkerManager from './lib/ServiceWorkerManager';

const theStore = configureStore();

render(
    <AppContainer>
        <Root store={theStore} history={history} />
    </AppContainer>,
    document.getElementById('root')
);


if (module.hot) {

    module.hot.accept('./containers/Root', () => {
        const newConfigureStore = require('./store/configureStore');
        const newStore = newConfigureStore.configureStore();
        const newHistory = newConfigureStore.history;
        const NewRoot = require('./containers/Root').default;
        render(
            <AppContainer>
                <NewRoot store={newStore} history={newHistory} />
            </AppContainer>,
            document.getElementById('root')
        );
    });

}

export const store = theStore;