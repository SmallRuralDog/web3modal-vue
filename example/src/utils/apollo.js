import {ApolloClient, InMemoryCache} from '@apollo/client';

const QglClient = new ApolloClient({
    uri: process.env.VUE_APP_THEGRAPH_URL,
    cache: new InMemoryCache()
});

export {
    QglClient
}